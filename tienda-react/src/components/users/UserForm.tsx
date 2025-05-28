import React, { useState, useEffect } from 'react';
import type  { User, UserFormData } from '../../types';
import { Loading } from '../common/Loading';
import { apiService } from '../../services/api';

interface UserFormProps {
  initialData?: User;
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    nombre: '',
    apellido: '',
    documento: '',
    contrasena: '',
    imagen: undefined
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [imagePreview, setImagePreview] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre,
        apellido: initialData.apellido,
        documento: initialData.documento,
        contrasena: initialData.contrasena,
        imagen: undefined
      });
      
      if (initialData.urlImagen) {
        setImagePreview(apiService.getImageUrl(initialData.urlImagen));
      }
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    } else if (formData.apellido.trim().length < 2) {
      newErrors.apellido = 'El apellido debe tener al menos 2 caracteres';
    }

    if (!formData.documento.trim()) {
      newErrors.documento = 'El documento es requerido';
    } else if (formData.documento.trim().length < 6) {
      newErrors.documento = 'El documento debe tener al menos 6 caracteres';
    }

    if (!formData.contrasena.trim()) {
      newErrors.contrasena = 'La contraseña es requerida';
    } else if (formData.contrasena.trim().length < 6) {
      newErrors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 handleSubmit iniciado');
    console.log('📊 Estado actual del formulario:', {
      nombre: formData.nombre,
      apellido: formData.apellido,
      documento: formData.documento,
      contrasena: formData.contrasena ? '***' : 'vacío',
      imagen: formData.imagen ? `File(${formData.imagen.name})` : 'sin imagen'
    });
    
    if (!validateForm()) {
      console.log('❌ Validación del formulario falló');
      return;
    }

    console.log('✅ Validación exitosa, enviando datos...');

    try {
      await onSubmit({
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        documento: formData.documento.trim(),
        contrasena: formData.contrasena.trim(),
        imagen: formData.imagen
      });
      console.log('🎉 Formulario enviado exitosamente');
    } catch (error) {
      console.error('💥 Error en handleSubmit:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    console.log('🖼️ handleImageChange disparado:', {
      files: e.target.files,
      fileCount: e.target.files?.length,
      selectedFile: file
    });
    
    if (file) {
      console.log('📁 Archivo seleccionado:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });

      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        console.error('❌ Tipo de archivo no válido:', file.type);
        setErrors(prev => ({
          ...prev,
          imagen: 'Solo se permiten archivos de imagen (JPG, PNG, GIF, WEBP)'
        }));
        return;
      }

      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        console.error('❌ Archivo muy grande:', file.size);
        setErrors(prev => ({
          ...prev,
          imagen: 'La imagen no puede superar los 5MB'
        }));
        return;
      }

      console.log('✅ Archivo válido, agregando al estado');
      setFormData(prev => ({
        ...prev,
        imagen: file
      }));

      // Crear preview
      const reader = new FileReader();
      reader.onload = () => {
        console.log('📷 Preview creado exitosamente');
        setImagePreview(reader.result as string);
      };
      reader.onerror = () => {
        console.error('❌ Error al crear preview');
      };
      reader.readAsDataURL(file);

      // Limpiar error de imagen
      if (errors.imagen) {
        setErrors(prev => ({
          ...prev,
          imagen: ''
        }));
      }
    } else {
      console.log('❌ No se seleccionó ningún archivo');
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      imagen: undefined
    }));
    setImagePreview('');
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="nombre" className="form-label">
            Nombre *
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={`form-input ${errors.nombre ? 'error' : ''}`}
            placeholder="Ej: Juan"
            disabled={loading}
          />
          {errors.nombre && (
            <span className="error-text">{errors.nombre}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="apellido" className="form-label">
            Apellido *
          </label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            className={`form-input ${errors.apellido ? 'error' : ''}`}
            placeholder="Ej: Pérez"
            disabled={loading}
          />
          {errors.apellido && (
            <span className="error-text">{errors.apellido}</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="documento" className="form-label">
            Documento *
          </label>
          <input
            type="text"
            id="documento"
            name="documento"
            value={formData.documento}
            onChange={handleChange}
            className={`form-input ${errors.documento ? 'error' : ''}`}
            placeholder="Ej: 12345678"
            disabled={loading}
          />
          {errors.documento && (
            <span className="error-text">{errors.documento}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="contrasena" className="form-label">
            Contraseña *
          </label>
          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              id="contrasena"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              className={`form-input ${errors.contrasena ? 'error' : ''}`}
              placeholder="Mínimo 6 caracteres"
              disabled={loading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? '👁️‍🗨️' : '👁️'}
            </button>
          </div>
          {errors.contrasena && (
            <span className="error-text">{errors.contrasena}</span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="imagen" className="form-label">
          Imagen de perfil
        </label>
        <div className="image-upload-container">
          <input
            type="file"
            id="imagen"
            accept="image/*"
            onChange={handleImageChange}
            className="form-input-file"
            disabled={loading}
          />
          
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" className="preview-image user-preview" />
              <button
                type="button"
                onClick={removeImage}
                className="btn btn-danger btn-small remove-image"
                disabled={loading}
              >
                ✕ Quitar imagen
              </button>
            </div>
          )}
        </div>
        {errors.imagen && (
          <span className="error-text">{errors.imagen}</span>
        )}
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <Loading size="small" message="" />
          ) : (
            initialData ? 'Actualizar' : 'Crear'
          )}
        </button>
      </div>
    </form>
  );
};