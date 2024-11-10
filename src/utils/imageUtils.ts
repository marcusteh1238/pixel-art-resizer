import { ResizeConfig } from "./types";

// Image Processing Utils
export const handleDimensionsResize = (img: HTMLImageElement, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, resizeConfig: ResizeConfig) => {
  // For scale mode, calculate width and height from scale
  let targetW: number;
  let targetH: number;
  
  if (resizeConfig.mode === 'scale') {
    targetW = img.width * resizeConfig.scale;
    targetH = img.height * resizeConfig.scale;
  } else {
    // For custom dimensions mode
    const width = resizeConfig.targetWidth ? parseInt(resizeConfig.targetWidth) : 0;
    const height = resizeConfig.targetHeight ? parseInt(resizeConfig.targetHeight) : 0;
    
    if (width && !height) {
      targetW = width;
      targetH = Math.round(img.height * (width / img.width));
    } else if (height && !width) {
      targetH = height;
      targetW = Math.round(img.width * (height / img.height));
    } else {
      targetW = width || img.width;
      targetH = height || img.height;
    }
  }

  // Find the power of 2 scale factor needed
  const scaleX = Math.ceil(Math.log2(targetW / img.width));
  const scaleY = Math.ceil(Math.log2(targetH / img.height));
  const powerScale = Math.max(scaleX, scaleY);
  const upscaleFactor = Math.pow(2, powerScale);

  // First upscale to power of 2
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return canvas;

  tempCanvas.width = img.width * upscaleFactor;
  tempCanvas.height = img.height * upscaleFactor;
  tempCtx.imageSmoothingEnabled = false;
  tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);

  // Then downscale to target size
  canvas.width = targetW;
  canvas.height = targetH;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tempCanvas, 0, 0, targetW, targetH);

  return canvas;
};
export const loadImage = (file: File): Promise<{ url: string; filename: string; dimensions: { width: number; height: number } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        resolve({
          url: reader.result as string,
          filename: file.name.replace(/\.[^/.]+$/, ''),
          dimensions: { width: img.width, height: img.height }
        });
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};