import { handleDimensionsResize } from '../utils/imageUtils';
import { ImageData, ResizeConfig } from '../utils/types';

export const useImageProcessing = () => {
  const resizeImages = (
    originalImages: ImageData[], 
    resizeConfig: ResizeConfig,
    onComplete: (resizedImages: ImageData[]) => void
  ) => {
    const resizedImages: ImageData[] = [];

    originalImages.forEach(originalImage => {
      const img = new Image();
      img.src = originalImage.url;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizedCanvas = handleDimensionsResize(img, ctx, canvas, resizeConfig);
        const newDimensions = { 
          width: resizedCanvas.width, 
          height: resizedCanvas.height 
        };

        resizedImages.push({
          url: resizedCanvas.toDataURL('image/png'),
          filename: originalImage.filename,
          dimensions: newDimensions
        });

        if (resizedImages.length === originalImages.length) {
          onComplete(resizedImages);
        }
      };
    });
  };

  return { resizeImages };
}; 