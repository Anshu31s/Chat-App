"use client"
import { useState } from 'react';
import axios from 'axios';

export const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
 

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl('');
      }
    
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert('No file selected!');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('/api/upload', formData);
      if (response.status === 200) {
        alert('File uploaded successfully!');
      } else {
        alert('Failed to upload file');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading file');
    } finally {
      setSelectedFile(null);
      setPreviewUrl('');
    }
    
  };

  return {
    selectedFile,
    previewUrl,
    handleFileChange,
    handleCancel,
    handleUpload,
  };
};
