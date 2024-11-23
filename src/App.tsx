import React from 'react';
import { buttonStyle } from './styles';
import { ImageInfo } from './utils/types';
import { processTemplate } from './utils/fileUtils';
import { downloadSingleImage } from './utils/downloadUtils';
import { ImageUploader } from './components/ImageUploader';
import { ResizeControls } from './components/ResizeControls';
import { ImageGallery } from './components/ImageGallery';
import { FilenameConfigInput } from './components/FilenameConfig';
import { Instructions } from './components/Instructions';
import { Footer } from './components/Footer';
import { useImages } from './hooks/useImages';
import { useResizeConfig } from './hooks/useResizeConfig';
import { useImageProcessing } from './hooks/useImageProcessing';
import { DownloadAllButton } from './components/DownloadAllButton';

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

  const handleDownload = (image: ImageInfo) => {
    downloadSingleImage(image.url, processTemplate(filenameConfig.template, image, resizeConfig));
  };

  const handleCopy = async (image: ImageInfo) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      
      if (navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]);
        alert('Image copied to clipboard!');
      } else {
        const img = document.createElement('img');
        img.src = image.url;
        
        const canvas = document.createElement('canvas');
        canvas.width = image.dimensions.width;
        canvas.height = image.dimensions.height;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              const item = new ClipboardItem({ 'image/png': blob });
              navigator.clipboard.write([item])
                .then(() => alert('Image copied to clipboard!'))
                .catch((err) => {
                  console.error('Clipboard write failed:', err);
                  alert('Unable to copy image. Your browser may not support this feature.');
                });
            }
          }, 'image/png');
        }
      }
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Unable to copy image. This feature requires a secure (HTTPS) connection or localhost.');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <img 
        src={process.env.PUBLIC_URL + '/logo.png'}
        alt="Pixel Art Resizer Logo"
        style={{
          width: '128px',
          height: '128px'
        }}
      />
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
          <FilenameConfigInput 
            config={filenameConfig}
            onChange={setFilenameConfig}
          />
          <DownloadAllButton 
            images={images.resized}
            filenameConfig={filenameConfig}
            resizeConfig={resizeConfig}
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
