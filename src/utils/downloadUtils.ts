import JSZip from "jszip";
import { processTemplate } from "./fileUtils";
import { ResizeConfig, ImageData } from "./types";

// Download Utils
export const downloadSingleImage = (
  imageUrl: string, 
  filename: string
) => {
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadZip = async (
  images: ImageData[],
  zipFilename: string,
  filenameTemplate: string,
  resizeConfig: ResizeConfig
) => {
  const zip = new JSZip();
  
  images.forEach((img) => {
    const imageData = img.url.split(',')[1];
    // Process the filename template for each image
    const filename = `${processTemplate(filenameTemplate, img, resizeConfig)}.png`;
    zip.file(filename, imageData, { base64: true });
  });
  
  const content = await zip.generateAsync({ type: 'blob' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(content);
  link.download = `${zipFilename}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};