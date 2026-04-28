import React, { useState, useRef } from 'react';
import { imagesApi } from '../services/api';
import './ImageUploadComponent.css';

const ImageUploadComponent = ({ 
  productId, 
  currentImageUrl, 
  onImageUploaded, 
  onError,
  label = "Upload Product Image"
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImageUrl);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      const error = 'File size exceeds 5MB limit';
      setError(error);
      if (onError) onError(error);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      const error = 'Please select a valid image file (JPG, PNG, GIF, WebP)';
      setError(error);
      if (onError) onError(error);
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload file
    await uploadImage(file);
  };

  const uploadImage = async (file) => {
    try {
      setUploading(true);
      setError('');
      setMessage('');

      const response = await imagesApi.uploadProductImage(productId, file);
      
      setMessage('Image uploaded successfully!');
      if (onImageUploaded) {
        onImageUploaded(response.data.imageUrl);
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to upload image';
      setError(errorMsg);
      if (onError) onError(errorMsg);
      setPreview(currentImageUrl); // Revert preview on error
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      setUploading(true);
      setError('');
      await imagesApi.deleteProductImage(productId);
      
      setPreview(null);
      setMessage('Image deleted successfully');
      if (onImageUploaded) {
        onImageUploaded(null);
      }

      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete image';
      setError(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload-component">
      <div className="upload-section">
        <label className="upload-label">{label}</label>

        <div className="image-preview-area">
          {preview ? (
            <img 
              src={preview} 
              alt="Product preview" 
              className="image-preview"
            />
          ) : (
            <div className="no-image-placeholder">
              <span>📷 No image</span>
            </div>
          )}
        </div>

        <div className="upload-controls">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            style={{ display: 'none' }}
            id={`image-input-${productId}`}
          />

          <label 
            htmlFor={`image-input-${productId}`}
            className="upload-button"
            style={{ 
              pointerEvents: uploading ? 'none' : 'auto',
              opacity: uploading ? 0.6 : 1
            }}
          >
            {uploading ? 'Uploading...' : '📁 Choose Image'}
          </label>

          {preview && preview !== currentImageUrl && (
            <button
              className="delete-button"
              onClick={handleDeleteImage}
              disabled={uploading}
              title="Delete image"
            >
              🗑️ Delete
            </button>
          )}
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        <small className="upload-hint">
          Max file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
        </small>
      </div>
    </div>
  );
};

export default ImageUploadComponent;
