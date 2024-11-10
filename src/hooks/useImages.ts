import { useState, useCallback } from 'react';
import { ImageInfo } from '../utils/types';
import { loadImage } from '../utils/imageUtils';

interface ImagesState {
  original: ImageInfo[];
  resized: ImageInfo[];
}

export const useImages = () => {
  const [images, setImages] = useState<ImagesState>({ 
    original: [], 
    resized: [] 
  });

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        try {
          const imageData = await loadImage(file);
          const isDuplicate = images.original.some(
            existingImg => existingImg.filename === imageData.filename
          );

          if (!isDuplicate) {
            setImages(prev => ({
              ...prev,
              original: [...prev.original, imageData]
            }));
          } else {
            alert(`Skipped duplicate image: ${file.name}`);
          }
        } catch (error) {
          console.error('Failed to load image:', error);
        }
      }
    }
  }, [images.original]);

  const clearAllImages = () => {
    setImages({ original: [], resized: [] });
  };

  const removeImage = (index: number) => {
    setImages(prev => ({
      ...prev,
      original: prev.original.filter((_, i) => i !== index),
      resized: prev.resized.filter((_, i) => i !== index)
    }));
  };

  const setResizedImages = (resizedImages: ImageInfo[]) => {
    setImages(prev => ({ ...prev, resized: resizedImages }));
  };

  return {
    images,
    handleImageUpload,
    clearAllImages,
    removeImage,
    setResizedImages
  };
}; 