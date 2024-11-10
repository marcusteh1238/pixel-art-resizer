import React, { useState, useRef, useEffect, useCallback } from 'react';
import JSZip from 'jszip';
import { buttonStyle, scrollableContainerStyle, imageContainerStyle, imageWrapperStyle, imageStyle, removeButtonStyle, dimensionsStyle, sectionContainerStyle, sectionHeaderStyle, listStyle } from './styles';

// Add proper type for resize mode
type ResizeMode = 'scale' | 'dimensions';

// Add proper type for the event handlers
type RadioChangeEvent = React.ChangeEvent<HTMLInputElement>;

// Consider extracting this interface to a separate types file
interface ImageData {
  url: string;
  filename: string;
  dimensions: { width: number; height: number; };
}

const App: React.FC = () => {
  const [images, setImages] = useState<{
    original: ImageData[];
    resized: ImageData[];
  }>({ original: [], resized: [] });
  const [resizeConfig, setResizeConfig] = useState({
    mode: 'scale' as ResizeMode,
    scale: 2,
    customScale: '',
    targetWidth: '',
    targetHeight: ''
  });
  const [filenameConfig, setFilenameConfig] = useState({
    zipFilename: `resized-images-{date}`,
    template: '{filename}_x{scale}'
  });

  useEffect(() => {
    setFilenameConfig(prev => ({
      ...prev,
      template: resizeConfig.mode === 'scale' ? '{filename}_x{scale}' : '{filename}_{width}x{height}'
    }));
  }, [resizeConfig.mode]);

  

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((event: RadioChangeEvent) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            const isDuplicate = images.original.some(
              existingImg => existingImg.filename === file.name.replace(/\.[^/.]+$/, '')
            );

            if (!isDuplicate) {
              setImages(prev => ({
                ...prev,
                original: [...prev.original, {
                  url: reader.result as string,
                  filename: file.name.replace(/\.[^/.]+$/, ''),
                  dimensions: { width: img.width, height: img.height }
                }]
              }));
            } else {
              alert(`Skipped duplicate image: ${file.name}`);
            }
          };
          img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [images.original]);

  const resizeImages = () => {
    setImages(prev => ({ ...prev, resized: [] }));

    images.original.forEach(originalImage => {
      const img = new Image();
      img.src = originalImage.url;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizedCanvas = handleDimensionsResize(img, ctx, canvas);
        const newDimensions = { 
          width: resizedCanvas.width, 
          height: resizedCanvas.height 
        };

        setImages(prev => ({
          ...prev,
          resized: [...prev.resized, {
            url: resizedCanvas.toDataURL('image/png'),
            filename: originalImage.filename,
            dimensions: newDimensions
          }]
        }));
      };
    });
  };

  const handleCustomScaleChange = (e: RadioChangeEvent) => {
    const value = e.target.value;
    setResizeConfig(prev => ({ ...prev, customScale: value }));
    const numValue = parseInt(value);
    if (numValue && numValue > 0) {
      setResizeConfig(prev => ({ ...prev, scale: numValue }));
    }
  };

  const handleDimensionsResize = (img: HTMLImageElement, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
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

  const clearAllImages = () => {
    setImages(prev => ({ ...prev, original: [], resized: [] }));
  };

  const getFormattedDate = () => {
    const date = new Date().toISOString();
    // remove milliseconds part
    const splitted = date.split('.');
    return splitted.slice(0, -1).join('.');
  };


  const processTemplate = (template: string, image?: { filename: string, dimensions: { width: number, height: number } }) => {
    let text = template;
    if (image) {
      text = text
      .replace(/{filename}/g, image.filename)
      .replace(/{width}/g, image.dimensions.width.toString())
      .replace(/{height}/g, image.dimensions.height.toString())
    }
    return text
      .replace(/{scale}/g, resizeConfig.scale.toString())
      .replace(/{date}/g, getFormattedDate());
  };

  const removeImage = (index: number) => {
    setImages(prev => ({
      ...prev,
      original: prev.original.filter((_, i) => i !== index),
      resized: prev.resized.filter((_, i) => i !== index)
    }));
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Pixel Art Resizer</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>
          <input
            type="radio"
            value="scale"
            checked={resizeConfig.mode === 'scale'}
            onChange={(e) => setResizeConfig(prev => ({ ...prev, mode: e.target.value as ResizeMode }))}
          /> Scale
        </label>
        <label style={{ marginLeft: '20px' }}>
          <input
            type="radio"
            value="dimensions"
            checked={resizeConfig.mode === 'dimensions'}
            onChange={(e) => setResizeConfig(prev => ({ ...prev, mode: e.target.value as ResizeMode }))}
          /> Custom Dimensions
        </label>
      </div>

      {resizeConfig.mode === 'scale' ? (
        <div style={{ marginBottom: '20px' }}>
          <label>Select Scale: </label>
          <select 
            value={resizeConfig.scale} 
            onChange={(e) => setResizeConfig(prev => ({ ...prev, scale: Number(e.target.value) }))}
            style={{ marginRight: '10px' }}
          >
            <option value={2}>2x</option>
            <option value={4}>4x</option>
            <option value={8}>8x</option>
            <option value={16}>16x</option>
            <option value={32}>32x</option>
          </select>
          <label>
            Custom Scale (any positive integer):
            <input
              type="number"
              value={resizeConfig.customScale}
              onChange={handleCustomScaleChange}
              style={{ marginLeft: '5px', width: '70px' }}
            />
          </label>
        </div>
      ) : (
        <div style={{ marginBottom: '20px' }}>
          <label>
            Width:
            <input
              type="number"
              value={resizeConfig.targetWidth}
              onChange={(e) => setResizeConfig(prev => ({ ...prev, targetWidth: e.target.value }))}
              style={{ marginLeft: '5px', width: '70px', marginRight: '20px' }}
            />
          </label>
          <label>
            Height:
            <input
              type="number"
              value={resizeConfig.targetHeight}
              onChange={(e) => setResizeConfig(prev => ({ ...prev, targetHeight: e.target.value }))}
              style={{ marginLeft: '5px', width: '70px' }}
            />
          </label>
        </div>
      )}

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label style={buttonStyle}>
          Add PNG Files
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/png" 
            onChange={handleImageUpload}
            multiple
            style={{
              display: 'none'
            }}
          />
        </label>
        {images.original.length > 0 && (
          <>
            <button 
              onClick={clearAllImages}
              style={buttonStyle}
            >
              Clear All Images
            </button>
            <div style={{ 
              marginTop: '10px',
              color: '#666'
            }}>
              Selected: {images.original.length} image(s)
            </div>
          </>
        )}
      </div>

      {images.original.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={resizeImages} 
            style={{ ...buttonStyle, marginTop: '10px' }}
          >
            {resizeConfig.mode === 'scale' ? `Resize All by ${resizeConfig.scale}x` : 'Resize All to dimensions'}
          </button>
          
          <h3>Original Images</h3>
          <div style={{ maxWidth: '100vw', margin: '0 auto' }}>
            <div style={scrollableContainerStyle}>
              {images.original.map((img, index) => (
                <div key={index} style={imageContainerStyle}>
                  <div 
                    style={imageWrapperStyle}
                    onMouseEnter={(e) => {
                      const button = e.currentTarget.querySelector('button');
                      if (button) button.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      const button = e.currentTarget.querySelector('button');
                      if (button) button.style.opacity = '0';
                    }}
                  >
                    <img src={img.url} alt={img.filename} style={imageStyle} />
                    <button
                      onClick={() => removeImage(index)}
                      style={removeButtonStyle}
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                  <div style={dimensionsStyle}>
                    <div>{img.filename}.png</div>
                    <div>{img.dimensions.width} x {img.dimensions.height}px</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {images.resized.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Resized Images</h3>
          <div style={{ 
            marginBottom: '25px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '10px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ width: '180px', whiteSpace: 'nowrap' }}>ZIP filename:</span>
              <input
                type="text"
                value={filenameConfig.zipFilename}
                onChange={(e) => setFilenameConfig(prev => ({ ...prev, zipFilename: e.target.value }))}
                placeholder="resized-images"
                style={{ marginLeft: '10px', width: '380px' }}
              />
            </label>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center',
              paddingBottom: '10px'
            }}>
              <span style={{ width: '180px', whiteSpace: 'nowrap' }}>New Filename:</span>
              <input
                type="text"
                value={filenameConfig.template}
                onChange={(e) => setFilenameConfig(prev => ({ ...prev, template: e.target.value }))}
                placeholder="e.g. {filename}_{width}x{height}"
                style={{ marginLeft: '10px', width: '380px' }}
              />
            </label>
          </div>
          <button 
            onClick={async () => {
              const zip = new JSZip();
              images.resized.forEach((img) => {
                const imageData = img.url.split(',')[1];
                zip.file(
                  `${processTemplate(filenameConfig.template, img)}.png`, 
                  imageData, 
                  {base64: true}
                );
              });
              
              const content = await zip.generateAsync({type: 'blob'});
              const link = document.createElement('a');
              link.href = URL.createObjectURL(content);
              link.download = `${processTemplate(filenameConfig.zipFilename)}.zip`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(link.href);
            }}
            style={{...buttonStyle, marginBottom: '15px'}}
          >
            Download All as ZIP
          </button>
          <div style={{ maxWidth: '100vw', margin: '0 auto' }}>
            <div style={scrollableContainerStyle}>
              {images.resized.map((img, index) => (
                <div key={index} style={imageContainerStyle}>
                  <div 
                    style={imageWrapperStyle}
                    onMouseEnter={(e) => {
                      const button = e.currentTarget.querySelector('button');
                      if (button) button.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      const button = e.currentTarget.querySelector('button');
                      if (button) button.style.opacity = '0';
                    }}
                  >
                    <img src={img.url} alt={img.filename} style={imageStyle} />
                    <button
                      onClick={() => removeImage(index)}
                      style={removeButtonStyle}
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                  <div style={dimensionsStyle}>
                    <div>{processTemplate(filenameConfig.template, img)}.png</div>
                    <div>{img.dimensions.width} x {img.dimensions.height}px</div>
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = img.url;
                        link.download = `${processTemplate(filenameConfig.template, img)}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      style={buttonStyle}
                    >
                      Download
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch(img.url);
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
                      }}
                      style={buttonStyle}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{...sectionContainerStyle, marginTop: '20px'}}>
        <h3 style={sectionHeaderStyle}>How to Use This Pixel Art Resizer?</h3>
        <ol style={listStyle}>
        <li>Drop your pixel art image files into the upload area or click to select files</li>
    <li>Choose a resize mode:
      <ul>
        <li><strong>Scale:</strong> Multiply the image size by a factor (e.g., 2x makes each pixel into 2x2)</li>
        <li><strong>Custom Dimensions:</strong> Set specific width and/or height (maintains aspect ratio if only one is set)</li>
      </ul>
    </li>
    <li>Customize the output filenames using these parameters:
      <ul>
        <li><code>{'{filename}'}</code> - Original filename</li>
        <li><code>{'{width}'}</code> - Output width</li>
        <li><code>{'{height}'}</code> - Output height</li>
        <li><code>{'{scale}'}</code> - Scale factor (when using Scale mode)</li>
        <li><code>{'{date}'}</code> - Timestamp of when the ZIP was created</li>
      </ul>
      Example: <code>{'{filename}'}_{'{width}'}x{'{height}'}</code> → "image_800x600.png"
    </li>
    <li>Click "Resize" to process your images</li>
    <li>Preview the results and click "Download All as ZIP" to save your resized images</li>
        </ol>
        <p style={{ marginTop: '15px', fontStyle: 'italic', color: '#444' }}>
          💡 Tip: For best results with pixel art, use the Scale option with power-of-2 values (2x, 4x, 8x, etc.)
        </p>
      </div>

      <div style={{
        ...sectionContainerStyle,
        marginTop: '20px'
      }}>
        <h3 style={sectionHeaderStyle}>Why Use This Pixel Art Resizer?</h3>
        <ul style={{ 
          ...listStyle,
          listStyle: 'none',
          padding: 0
        }}>
          <li style={{ marginBottom: '10px' }}>🎯 <strong>Pixel-Perfect Scaling:</strong> Uses nearest-neighbor interpolation to maintain sharp edges and prevent blurring</li>
          <li style={{ marginBottom: '10px' }}>⚡ <strong>Power-of-2 Scaling:</strong> Ensures the highest quality upscaling for pixel art by using mathematically optimal scale factors</li>
          <li style={{ marginBottom: '10px' }}>🖼️ <strong>Flexible Options:</strong> Choose between simple scaling (2x, 4x, etc.) or custom dimensions while maintaining pixel art quality</li>
          <li style={{ marginBottom: '10px' }}>💻 <strong>Browser-Based:</strong> No need to install any software - works right in your browser</li>
          <li style={{ marginBottom: '10px' }}>🔒 <strong>Privacy-Focused:</strong> All processing happens locally in your browser - your images never leave your device</li>
        </ul>
      </div>

      <footer style={{
        marginBottom: '25px',
        color: '#666',
        fontSize: '0.9rem'
      }}>
        <p>
          Created by <a 
            href="https://github.com/marcusteh1238" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#666' }}
          >
            Markers Duh
          </a> | <a 
            href="https://github.com/marcusteh1238/pixel-art-resizer" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#666' }}
          >
            Source Code
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
