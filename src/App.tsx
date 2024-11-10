import React from 'react';
import { buttonStyle } from './styles';
import { ImageData } from './utils/types';
import { processTemplate } from './utils/fileUtils';
import { downloadSingleImage } from './utils/downloadUtils';
import { ImageUploader } from './components/ImageUploader';
import { ResizeControls } from './components/ResizeControls';
import { ImageGallery } from './components/ImageGallery';
import { FilenameConfig } from './components/FilenameConfig';
import { Instructions } from './components/Instructions';
import { Footer } from './components/Footer';
import { useImages } from './hooks/useImages';
import { useResizeConfig } from './hooks/useResizeConfig';
import { useImageProcessing } from './hooks/useImageProcessing';

const App: React.FC = () => {
  const { 
    images, 
    handleImageUpload, 
    clearAllImages, 
    removeImage, 
    setResizedImages 
  } = useImages();

  const {
    resizeConfig,
    setResizeConfig,
    filenameConfig,
    setFilenameConfig
  } = useResizeConfig();

  const { resizeImages } = useImageProcessing();

  const handleResizeClick = () => {
    resizeImages(images.original, resizeConfig, setResizedImages);
  };

  const handleDownload = (image: ImageData) => {
    downloadSingleImage(image.url, processTemplate(filenameConfig.template, image, resizeConfig));
  };

  const handleCopy = async (image: ImageData) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      alert('Image copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy image to clipboard');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Pixel Art Resizer</h1>
      
      <ResizeControls 
        resizeConfig={resizeConfig}
        onConfigChange={setResizeConfig}
      />

      <ImageUploader 
        onUpload={handleImageUpload}
        onClearAll={clearAllImages}
        imageCount={images.original.length}
      />

      {images.original.length > 0 && (
        <>
          <button onClick={handleResizeClick} style={buttonStyle}>
            {resizeConfig.mode === 'scale' 
              ? `Resize All by ${resizeConfig.scale}x` 
              : 'Resize All to dimensions'}
          </button>
          
          <h3>Original Images</h3>
          <ImageGallery 
            images={images.original}
            onRemove={removeImage}
            showControls={false}
          />
        </>
      )}

      {images.resized.length > 0 && (
        <>
          <h3>Resized Images</h3>
          <FilenameConfig 
            config={filenameConfig}
            onChange={setFilenameConfig}
          />
          <ImageGallery 
            images={images.resized}
            onRemove={removeImage}
            onDownload={handleDownload}
            onCopy={handleCopy}
            filenameTemplate={filenameConfig.template}
            resizeConfig={resizeConfig}
          />
        </>
      )}

      <Instructions />
      <Footer />
    </div>
  );
};

export default App;
