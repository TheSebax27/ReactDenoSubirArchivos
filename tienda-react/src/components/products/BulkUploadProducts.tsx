import React, { useState } from 'react';
import type { Category, ProductFormData } from '../../types';
import { Loading } from '../common/Loading';

interface BulkUploadProductsProps {
  categories: Category[];
  onBulkUpload: (products: ProductFormData[]) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

interface ParsedProduct {
  cantidad: number;
  descripcion: string;
  precio: number;
  unidad: string;
  categoria: string;
  idCategoria?: number;
  valid: boolean;
  errors: string[];
}

export const BulkUploadProducts: React.FC<BulkUploadProductsProps> = ({
  categories,
  onBulkUpload,
  onCancel,
  loading = false
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedProduct[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    console.log('📁 Archivo seleccionado:', selectedFile);
    
    if (selectedFile) {
      // Aceptar tanto CSV como Excel
      const validTypes = [
        'text/csv', 
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      const validExtensions = ['.csv', '.xls', '.xlsx'];
      const hasValidExtension = validExtensions.some(ext => 
        selectedFile.name.toLowerCase().endsWith(ext)
      );
      
      if (!validTypes.includes(selectedFile.type) && !hasValidExtension) {
        setErrors(['Por favor selecciona un archivo CSV o Excel válido (.csv, .xls, .xlsx)']);
        return;
      }
      
      setFile(selectedFile);
      setErrors([]);
      setParsedData([]);
      console.log('✅ Archivo válido aceptado:', {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size
      });
    }
  };

  const parseCSV = (csvText: string): ParsedProduct[] => {
    console.log('📋 Parseando CSV, contenido:', csvText.substring(0, 200) + '...');
    
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) {
      throw new Error('El archivo está vacío');
    }
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    console.log('📋 Headers encontrados:', headers);
    
    // Validar headers requeridos (más flexible)
    const requiredHeaders = ['descripcion', 'precio', 'cantidad', 'unidad', 'categoria'];
    const headerMapping: { [key: string]: string } = {};
    
    // Mapear headers con flexibilidad
    headers.forEach((header, index) => {
      const cleanHeader = header.toLowerCase();
      if (cleanHeader.includes('descripcion') || cleanHeader.includes('producto') || cleanHeader.includes('nombre')) {
        headerMapping['descripcion'] = headers[index];
      } else if (cleanHeader.includes('precio') || cleanHeader.includes('price')) {
        headerMapping['precio'] = headers[index];
      } else if (cleanHeader.includes('cantidad') || cleanHeader.includes('stock') || cleanHeader.includes('qty')) {
        headerMapping['cantidad'] = headers[index];
      } else if (cleanHeader.includes('unidad') || cleanHeader.includes('unit')) {
        headerMapping['unidad'] = headers[index];
      } else if (cleanHeader.includes('categoria') || cleanHeader.includes('category')) {
        headerMapping['categoria'] = headers[index];
      }
    });
    
    console.log('🗺️ Mapeo de headers:', headerMapping);
    
    const missingHeaders = requiredHeaders.filter(required => !headerMapping[required]);
    if (missingHeaders.length > 0) {
      throw new Error(`Faltan columnas requeridas: ${missingHeaders.join(', ')}`);
    }

    const dataRows = lines.slice(1);
    const products: ParsedProduct[] = [];

    dataRows.forEach((row, index) => {
      const values = row.split(',').map(v => v.trim().replace(/"/g, ''));
      const product: ParsedProduct = {
        cantidad: 0,
        descripcion: '',
        precio: 0,
        unidad: '',
        categoria: '',
        valid: true,
        errors: []
      };

      // Mapear valores según headers
      headers.forEach((header, headerIndex) => {
        const value = values[headerIndex] || '';
        const mappedHeader = Object.keys(headerMapping).find(key => headerMapping[key] === header);
        
        if (!mappedHeader) return;
        
        switch (mappedHeader) {
          case 'descripcion':
            product.descripcion = value;
            if (!value) {
              product.errors.push('Descripción requerida');
              product.valid = false;
            }
            break;
          case 'precio':
            const precio = parseFloat(value.replace(/[^0-9.]/g, ''));
            if (isNaN(precio) || precio <= 0) {
              product.errors.push('Precio debe ser un número mayor a 0');
              product.valid = false;
            } else {
              product.precio = precio;
            }
            break;
          case 'cantidad':
            const cantidad = parseInt(value);
            if (isNaN(cantidad) || cantidad < 0) {
              product.errors.push('Cantidad debe ser un número mayor o igual a 0');
              product.valid = false;
            } else {
              product.cantidad = cantidad;
            }
            break;
          case 'unidad':
            product.unidad = value;
            if (!value) {
              product.errors.push('Unidad requerida');
              product.valid = false;
            }
            break;
          case 'categoria':
            product.categoria = value;
            const foundCategory = categories.find(cat => 
              cat.nombreCategoria.toLowerCase() === value.toLowerCase()
            );
            if (!foundCategory) {
              product.errors.push(`Categoría "${value}" no existe`);
              product.valid = false;
            } else {
              product.idCategoria = foundCategory.idCategoria;
            }
            break;
        }
      });

      products.push(product);
    });

    console.log('📊 Productos parseados:', products.length, 'válidos:', products.filter(p => p.valid).length);
    return products;
  };

  const handleProcessFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    setErrors([]);
    console.log('🔄 Procesando archivo:', file.name);

    try {
      let text = '';
      
      if (file.name.toLowerCase().endsWith('.csv')) {
        // Procesar CSV directamente
        text = await file.text();
      } else {
        // Para archivos Excel, convertir a CSV
        const arrayBuffer = await file.arrayBuffer();
        
        // Simulación de conversión Excel a CSV (en un proyecto real usarías una librería como xlsx)
        // Por ahora, le decimos al usuario que use CSV
        throw new Error('Para archivos Excel, por favor guárdalos como CSV primero. Ve a "Archivo > Guardar como > CSV"');
      }
      
      const parsed = parseCSV(text);
      setParsedData(parsed);
      
      console.log('✅ Archivo procesado exitosamente');
      
    } catch (error) {
      console.error('💥 Error procesando archivo:', error);
      setErrors([error instanceof Error ? error.message : 'Error al procesar archivo']);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpload = async () => {
    const validProducts = parsedData.filter(p => p.valid);
    if (validProducts.length === 0) {
      setErrors(['No hay productos válidos para cargar']);
      return;
    }

    console.log('🚀 Iniciando carga de productos válidos:', validProducts.length);

    const productsToUpload: ProductFormData[] = validProducts.map(p => ({
      cantidad: p.cantidad,
      descripcion: p.descripcion,
      precio: p.precio,
      unidad: p.unidad,
      idCategoria: p.idCategoria!
    }));

    try {
      await onBulkUpload(productsToUpload);
      console.log('✅ Carga masiva completada exitosamente');
    } catch (error) {
      console.error('💥 Error en carga masiva:', error);
      setErrors([error instanceof Error ? error.message : 'Error al cargar productos']);
    }
  };

  const downloadTemplate = () => {
    console.log('📥 Descargando plantilla CSV...');
    
    const headers = ['descripcion', 'precio', 'cantidad', 'unidad', 'categoria'];
    const exampleRows = [
      ['Smartphone Samsung Galaxy A54', '599999', '10', 'unidad', 'Electrónicos'],
      ['Laptop HP Pavilion 15', '899999', '5', 'unidad', 'Electrónicos'],
      ['Camisa de algodón', '45999', '20', 'unidad', 'Ropa'],
      ['Auriculares Bluetooth', '299999', '15', 'unidad', 'Electrónicos'],
      ['Mesa de comedor', '750000', '3', 'unidad', 'Hogar']
    ];

    const csvContent = [
      headers.join(','),
      ...exampleRows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_productos.csv';
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
        <h3>📤 Carga Masiva de Productos</h3>
        <p>Sube un archivo CSV o Excel con múltiples productos para agregarlos automáticamente a la base de datos</p>
      </div>

      {/* Información y plantilla */}
      <div className="upload-info">
        <div className="info-section">
          <h4>📋 Formato requerido</h4>
          <p>El archivo debe contener las siguientes columnas:</p>
          <ul>
            <li><strong>descripcion:</strong> Nombre del producto</li>
            <li><strong>precio:</strong> Precio en números (ej: 59999)</li>
            <li><strong>cantidad:</strong> Cantidad en stock</li>
            <li><strong>unidad:</strong> Unidad de medida (ej: unidad, kg, litro)</li>
            <li><strong>categoria:</strong> Nombre exacto de la categoría existente</li>
          </ul>
          <div className="file-format-note">
            <strong>📄 Formatos aceptados:</strong> CSV (.csv), Excel (.xls, .xlsx)
          </div>
        </div>

        <div className="template-section">
          <h4>📥 Plantilla de Ejemplo</h4>
          <p>Descarga una plantilla con ejemplos para facilitar la carga:</p>
          <button
            type="button"
            onClick={downloadTemplate}
            className="btn btn-secondary"
          >
            📥 Descargar Plantilla CSV
          </button>
          <small>Puedes abrir el archivo CSV con Excel para editarlo</small>
        </div>

        <div className="categories-section">
          <h4>📁 Categorías disponibles</h4>
          <p>Usa exactamente estos nombres en tu archivo:</p>
          <div className="categories-chips">
            {categories.map(cat => (
              <span key={cat.idCategoria} className="category-chip">
                {cat.nombreCategoria}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Selector de archivo */}
      <div className="file-upload-section">
        <div className="form-group">
          <label htmlFor="csvFile" className="form-label">
            📂 Seleccionar archivo CSV o Excel *
          </label>
          <input
            type="file"
            id="csvFile"
            accept=".csv,.xls,.xlsx"
            onChange={handleFileChange}
            className="form-input-file"
            disabled={loading || isProcessing}
          />
          {file && (
            <div className="file-info">
              <span className="file-name">📄 {file.name}</span>
              <span className="file-size">({Math.round(file.size / 1024)} KB)</span>
              <span className="file-type">Tipo: {file.type || 'Desconocido'}</span>
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
                <Loading size="small" message="" />
                Procesando...
              </>
            ) : (
              '🔍 Procesar Archivo'
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
            <h4>📊 Vista Previa - {parsedData.length} productos encontrados</h4>
            <div className="preview-stats">
              <span className="stat-valid">✅ Válidos: {validCount}</span>
              <span className="stat-invalid">❌ Con errores: {invalidCount}</span>
            </div>
          </div>

          <div className="preview-table-container">
            <table className="preview-table">
              <thead>
                <tr>
                  <th>Estado</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Unidad</th>
                  <th>Categoría</th>
                  <th>Errores</th>
                </tr>
              </thead>
              <tbody>
                {parsedData.map((product, index) => (
                  <tr key={index} className={product.valid ? 'row-valid' : 'row-invalid'}>
                    <td>
                      {product.valid ? '✅' : '❌'}
                    </td>
                    <td>{product.descripcion || '-'}</td>
                    <td>
                      {product.precio > 0 ? 
                        new Intl.NumberFormat('es-CO', {
                          style: 'currency',
                          currency: 'COP'
                        }).format(product.precio) : '-'
                      }
                    </td>
                    <td>{product.cantidad}</td>
                    <td>{product.unidad || '-'}</td>
                    <td>{product.categoria || '-'}</td>
                    <td>
                      {product.errors.length > 0 && (
                        <div className="error-cell">
                          {product.errors.map((error, errIndex) => (
                            <div key={errIndex} className="error-item-small">
                              {error}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              <Loading size="small" message="" />
            ) : (
              `📤 Cargar ${validCount} Productos a la Base de Datos`
            )}
          </button>
        )}
      </div>
    </div>
  );
};