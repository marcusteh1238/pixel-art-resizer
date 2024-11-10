import { ResizeConfig, ImageData } from "./types";

export const getFormattedDate = () => {
  const date = new Date().toISOString();
  const splitted = date.split('.');
  return splitted.slice(0, -1).join('.');
};

export const processTemplate = (
  template: string,
  image?: ImageData,
  resizeConfig?: ResizeConfig
) => {
  let text = template;
  
  if (image) {
    text = text
      .replace(/{filename}/g, image.filename)
      .replace(/{width}/g, image.dimensions.width.toString())
      .replace(/{height}/g, image.dimensions.height.toString());
  }

  if (resizeConfig) {
    text = text
      .replace(/{scale}/g, resizeConfig.mode === 'scale' ? resizeConfig.scale.toString() : '')
      .replace(/{mode}/g, resizeConfig.mode)
      .replace(/{width}/g, resizeConfig.targetWidth)
      .replace(/{height}/g, resizeConfig.targetHeight);
  }

  return text.replace(/{date}/g, getFormattedDate());
};