import { imageContainerStyle, imageWrapperStyle, imageStyle, removeButtonStyle, dimensionsStyle, buttonStyle } from "../styles";
import { processTemplate } from "../utils/fileUtils";
import { ResizeConfig, ImageInfo } from "../utils/types";
import { useState } from 'react';

interface ImageCardProps {
  image: ImageInfo;
  onRemove: () => void;
  onDownload?: (image: ImageInfo) => void;
  onCopy?: (image: ImageInfo) => void;
  filenameTemplate?: string;
  resizeConfig?: ResizeConfig;
  showControls?: boolean;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  onRemove,
  onDownload,
  onCopy,
  filenameTemplate,
  resizeConfig,
  showControls
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={imageContainerStyle}>
      <div 
        style={imageWrapperStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img src={image.url} alt={image.filename} style={imageStyle} />
        <button
          onClick={onRemove}
          style={{
            ...removeButtonStyle,
            ...(isHovered ? { opacity: 1 } : {})
          }}
          title="Remove image"
        >
          ×
        </button>
      </div>
      <div style={dimensionsStyle}>
        <div>
          {filenameTemplate 
            ? processTemplate(filenameTemplate, image, resizeConfig)
            : image.filename}.png
        </div>
        <div>{image.dimensions.width} x {image.dimensions.height}px</div>
      </div>
      {showControls && onDownload && onCopy && (
        <div>
          <button onClick={() => onDownload(image)} style={buttonStyle}>
            Download
          </button>
          <button onClick={() => onCopy(image)} style={buttonStyle}>
            Copy
          </button>
        </div>
      )}
    </div>
  );
}; 