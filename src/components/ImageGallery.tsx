import { scrollableContainerStyle } from "../styles";
import { ResizeConfig, ImageInfo } from "../utils/types";
import { ImageCard } from "./ImageCard";

interface ImageGalleryProps {
  images: ImageInfo[];
  onRemove: (index: number) => void;
  onDownload?: (image: ImageInfo) => void;
  onCopy?: (image: ImageInfo) => void;
  filenameTemplate?: string;
  resizeConfig?: ResizeConfig;
  showControls?: boolean;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  onRemove, 
  onDownload, 
  onCopy,
  filenameTemplate,
  resizeConfig,
  showControls = true
}) => {
  return (
    <div style={{ maxWidth: '100vw', margin: '0 auto' }}>
      <div style={scrollableContainerStyle}>
        {images.map((img, index) => (
          <ImageCard
            key={index}
            image={img}
            onRemove={() => onRemove(index)}
            onDownload={onDownload}
            onCopy={onCopy}
            filenameTemplate={filenameTemplate}
            resizeConfig={resizeConfig}
            showControls={showControls}
          />
        ))}
      </div>
    </div>
  );
}; 