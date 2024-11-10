export interface ImageData {
  url: string;
  filename: string;
  dimensions: { width: number; height: number; };
}

export type ResizeMode = 'scale' | 'dimensions';

export type ResizeConfig = {
  mode: ResizeMode;
  scale: number;
  customScale: string;
  targetWidth: string;
  targetHeight: string;
}