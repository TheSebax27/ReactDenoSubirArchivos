import React, { useState } from 'react';
import type { CategoryFormData } from '../../types';
import { Loading } from '../common/Loading';

interface BulkUploadCategoriesProps {
  onBulkUpload: (categories: CategoryFormData[]) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

interface ParsedCategory {
  nombreCategoria: string;
  valid: boolean;
  errors: string[];
}

export const BulkUploadCategories: React.FC<BulkUploadCategoriesProps> = ({
  onBulkUpload,
  onCancel,
  loading = false
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedCategory[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      console.log('📁 Archivo seleccionado:', {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type
      });

      // Verificar si es CSV o Excel
      const isCSV = selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv');
      const isExcel = selectedFile.type === 'application/vnd.ms-excel' || 
                    selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                    selectedFile.name.endsWith('.xlsx') || 
                    selectedFile.name.endsWith('.xls');

      if (!isCSV && !isExcel) {
        setErrors(['Por favor selecciona un archivo CSV o Excel válido (.csv, .xlsx, .xls)']);
        return;
      }

      setFile(selectedFile);
      setErrors([]);
      setParsedData([]);
    }
  };

  const parseCSV = (csvText: string): ParsedCategory[] => {
    console.log('📊 Parseando CSV...');
    const lines = csvText.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      throw new Error('El archivo está vacío');
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    console.log('📋 Headers encontrados:', headers);
    
    // Buscar columna de categorías
    const headerIndex = headers.findIndex(h => 
      h === 'nombrecategoria' || 
      h === 'categoria' || 
      h === 'nombre' ||
      h === 'name' ||
      h === 'category'
    );

    if (headerIndex === -1) {
      throw new Error('No se encontró una columna válida. El archivo debe contener una columna llamada "nombreCategoria", "categoria", "nombre", "name" o "category"');
    }

    console.log(`✅ Usando columna: ${headers[headerIndex]} (índice ${headerIndex})`);

    const dataRows = lines.slice(1);
    const categories: ParsedCategory[] = [];
    const seenNames = new Set<string>();

    dataRows.forEach((row, index) => {
      const values = row.split(',').map(v => v.trim().replace(/"/g, ''));
      const nombreCategoria = values[headerIndex] || '';
      
      console.log(`📝 Procesando fila ${index + 1}: "${nombreCategoria}"`);
      
      const category: ParsedCategory = {
        nombreCategoria,
        valid: true,
        errors: []
      };

      // Validaciones
      if (!nombreCategoria) {
        category.errors.push('Nombre de categoría requerido');
        category.valid = false;
      } else if (nombreCategoria.length < 2) {
        category.errors.push('Nombre debe tener al menos 2 caracteres');
        category.valid = false;
      } else if (seenNames.has(nombreCategoria.toLowerCase())) {
        category.errors.push('Categoría duplicada en el archivo');
        category.valid = false;
      } else {
        seenNames.add(nombreCategoria.toLowerCase());
      }

      categories.push(category);
    });

    console.log(`📊 Procesamiento completado: ${categories.length} categorías encontradas`);
    return categories;
  };

  const parseExcel = async (file: File): Promise<ParsedCategory[]> => {
    console.log('📊 Parseando archivo Excel...');
    
    // Para Excel, convertimos a texto y procesamos como CSV
    // En un proyecto real, usarías una librería como SheetJS
    const text = await file.text();
    return parseCSV(text);
  };

  const handleProcessFile = async () => {
    if (!file) return;

    console.log('🔄 Iniciando procesamiento del archivo');
    setIsProcessing(true);
    setErrors([]);

    try {
      let parsed: ParsedCategory[];
      
      if (file.name.endsWith('.csv')) {
        const text = await file.text();
        parsed = parseCSV(text);
      } else {
        // Para archivos Excel
        parsed = await parseExcel(file);
      }
      
      setParsedData(parsed);
      console.log('✅ Archivo procesado exitosamente');
    } catch (error) {
      console.error('💥 Error al procesar archivo:', error);
      setErrors([error instanceof Error ? error.message : 'Error al procesar archivo']);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpload = async () => {
    const validCategories = parsedData.filter(p => p.valid);
    if (validCategories.length === 0) {
      setErrors(['No hay categorías válidas para cargar']);
      return;
    }

    console.log(`🚀 Iniciando carga de ${validCategories.length} categorías válidas`);

    const categoriesToUpload: CategoryFormData[] = validCategories.map(c => ({
      nombreCategoria: c.nombreCategoria
    }));

    try {
      await onBulkUpload(categoriesToUpload);
      console.log('✅ Carga masiva completada exitosamente');
    } catch (error) {
      console.error('💥 Error en carga masiva:', error);
      setErrors([error instanceof Error ? error.message : 'Error al cargar categorías']);
    }
  };

  const downloadTemplate = () => {
    console.log('📥 Descargando plantilla...');
    const csvContent = [
      'nombreCategoria',
      'Electrónicos',
      'Ropa y Accesorios',
      'Hogar y Jardín',
      'Deportes',
      'Libros y Medios',
      'Salud y Belleza',
      'Automóviles',
      'Juguetes',
      'Alimentación'
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_categorias.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    console.log('✅ Plantilla descargada');
  };

  const validCount = parsedData.filter(p => p.valid).length;
  const invalidCount = parsedData.filter(p => !p.valid).length;

  return (
    <div className="bulk-upload-container">
      <div className="upload-header">
        <h3>📤 Carga Masiva de Categorías</h3>
        <p>Sube un archivo CSV o Excel con múltiples categorías para agregarlas automáticamente a la base de datos</p>
      </div>

      {/* Información y plantilla */}
      <div className="upload-info">
        <div className="info-section">
          <h4>📋 Formato requerido</h4>
          <p>El archivo debe contener una columna con uno de estos nombres:</p>
          <ul>
            <li><strong>nombreCategoria:</strong> Nombre de la categoría (recomendado)</li>
            <li><strong>categoria:</strong> Nombre de la categoría</li>
            <li><strong>nombre:</strong> Nombre de la categoría</li>
            <li><strong>name:</strong> Category name (inglés)</li>
            <li><strong>category:</strong> Category name (inglés)</li>
          </ul>
          <p><strong>Formatos soportados:</strong> CSV (.csv), Excel (.xlsx, .xls)</p>
        </div>

        <div className="template-section">
          <h4>📥 Plantilla</h4>
          <p>Descarga una plantilla de ejemplo con categorías comunes:</p>
          <button
            type="button"
            onClick={downloadTemplate}
            className="btn btn-secondary"
          >
            📥 Descargar Plantilla CSV
          </button>
          <p className="template-note">
            💡 <strong>Tip:</strong> Puedes abrir el archivo CSV con Excel, editarlo y guardarlo como CSV nuevamente
          </p>
        </div>
      </div>

      {/* Selector de archivo */}
      <div className="file-upload-section">
        <div className="form-group">
          <label htmlFor="csvFile" className="form-label">
            📁 Seleccionar archivo CSV o Excel *
          </label>
          <input
            type="file"
            id="csvFile"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="form-input-file"
            disabled={loading || isProcessing}
          />
          {file && (
            <div className="file-info">
              <span className="file-icon">
                {file.name.endsWith('.csv') ? '📄' : '📊'}
              </span>
              <span className="file-name">{file.name}</span>
              <span className="file-size">({Math.round(file.size / 1024)} KB)</span>
              <span className="file-type">
                {file.name.endsWith('.csv') ? 'CSV' : 'Excel'}
              </span>
            </div>
          )}
        </div>

        {file && !parsedData.length && (
          <button
            type="button"
            onClick={handleProcessFile}
            disabled={isProcessing}
            className="btn btn-primary"
          >
            {isProcessing ? (
              <>
                <span className="spinner-small"></span>
                Procesando archivo...
              </>
            ) : (
              <>
                🔍 Procesar y Validar Archivo
              </>
            )}
          </button>
        )}
      </div>

      {/* Errores */}
      {errors.length > 0 && (
        <div className="error-section">
          <h4>❌ Errores encontrados</h4>
          <ul className="error-list">
            {errors.map((error, index) => (
              <li key={index} className="error-item">{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Vista previa de datos procesados */}
      {parsedData.length > 0 && (
        <div className="preview-section">
          <div className="preview-header">
            <h4>📊 Vista Previa - {parsedData.length} categorías encontradas</h4>
            <div className="preview-stats">
              <span className="stat-valid">✅ Válidas: {validCount}</span>
              <span className="stat-invalid">❌ Con errores: {invalidCount}</span>
            </div>
          </div>

          <div className="categories-preview">
            {parsedData.map((category, index) => (
              <div 
                key={index} 
                className={`category-preview-item ${category.valid ? 'valid' : 'invalid'}`}
              >
                <div className="category-status">
                  {category.valid ? '✅' : '❌'}
                </div>
                <div className="category-content">
                  <div className="category-name">
                    📁 {category.nombreCategoria || 'Sin nombre'}
                  </div>
                  {category.errors.length > 0 && (
                    <div className="category-errors">
                      {category.errors.map((error, errIndex) => (
                        <div key={errIndex} className="error-item-small">
                          ⚠️ {error}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={loading}
        >
          Cancelar
        </button>
        
        {validCount > 0 && (
          <button
            type="button"
            onClick={handleUpload}
            className="btn btn-primary"
            disabled={loading || validCount === 0}
          >
            {loading ? (
              <>
                <Loading size="small" message="" />
                Subiendo a la base de datos...
              </>
            ) : (
              `📤 Subir ${validCount} Categorías a la BD`
            )}
          </button>
        )}
      </div>
    </div>
  );
};