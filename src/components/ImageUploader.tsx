import React, { useRef } from 'react';
import { buttonStyle } from '../styles';

interface ImageUploaderProps {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearAll: () => void;
  imageCount: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, onClearAll, imageCount }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    onUpload(event);
    // Reset the file input after upload
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearAll = () => {
    onClearAll();
    // Reset the file input after clearing
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{ marginBottom: '20px', textAlign: 'center' }}>
      <label style={buttonStyle}>
        Add PNG Files
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/png" 
          onChange={handleUpload}
          multiple
          style={{ display: 'none' }}
        />
      </label>
      {imageCount > 0 && (
        <>
          <button onClick={handleClearAll} style={buttonStyle}>
            Clear All Images
          </button>
          <div style={{ marginTop: '10px', color: '#666' }}>
            Selected: {imageCount} image(s)
          </div>
        </>
      )}
    </div>
  );
}; 