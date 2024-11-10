// src/App.tsx
import React, { useState } from 'react';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resizedImageURL, setResizedImageURL] = useState<string>('');
  const [scale, setScale] = useState<number>(2);
  const [customScale, setCustomScale] = useState<string>('');
  const [resizeMode, setResizeMode] = useState<'scale' | 'dimensions'>('scale');
  const [targetWidth, setTargetWidth] = useState<string>('');
  const [targetHeight, setTargetHeight] = useState<string>('');
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [finalDimensions, setFinalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [outputFilename, setOutputFilename] = useState<string>('resized_image');
  const [originalFilename, setOriginalFilename] = useState<string>('');

  const imageStyle = {
    border: '1px solid black',
    maxWidth: '100vw',
    maxHeight: '300px',
    width: 'auto',
    height: 'auto'
  } as const;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const filename = file.name.replace(/\.[^/.]+$/, '');
      setOriginalFilename(filename);
      
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height });
        };
        img.src = reader.result as string;
        setOriginalImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resizeImage = () => {
    if (!originalImage) return;

    const img = new Image();
    img.src = originalImage;
    const handleScaleResize = (img: HTMLImageElement, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      return canvas;
    };

    const handleDimensionsResize = (img: HTMLImageElement, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const width = targetWidth ? parseInt(targetWidth) : 0;
      const height = targetHeight ? parseInt(targetHeight) : 0;
      
      // Calculate target dimensions
      let targetW = width;
      let targetH = height;
      if (width && !height) {
        targetH = Math.round(img.height * (width / img.width));
      } else if (height && !width) {
        targetW = Math.round(img.width * (height / img.height));
      }

      // Find the power of 2 scale factor needed
      const scaleX = Math.ceil(Math.log2(targetW / img.width));
      const scaleY = Math.ceil(Math.log2(targetH / img.height));
      const scale = Math.max(scaleX, scaleY);
      const upscaleFactor = Math.pow(2, scale);

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

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      const resizedCanvas = resizeMode === 'scale' 
        ? handleScaleResize(img, ctx, canvas)
        : handleDimensionsResize(img, ctx, canvas);

      setFinalDimensions({ width: resizedCanvas.width, height: resizedCanvas.height });

      const newDimensions = resizeMode === 'scale' 
        ? `_x${scale}`
        : `_${resizedCanvas.width}x${resizedCanvas.height}`;
      setOutputFilename(`${originalFilename}${newDimensions}`);
      setResizedImageURL(resizedCanvas.toDataURL('image/png'));
    };
  };

  const handleCustomScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomScale(value);
    const numValue = parseInt(value);
    if (numValue && numValue > 1 && Number.isInteger(Math.log2(numValue))) {
      setScale(numValue);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Pixel Art Resizer</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>
          <input
            type="radio"
            value="scale"
            checked={resizeMode === 'scale'}
            onChange={(e) => setResizeMode(e.target.value as 'scale' | 'dimensions')}
          /> Scale
        </label>
        <label style={{ marginLeft: '20px' }}>
          <input
            type="radio"
            value="dimensions"
            checked={resizeMode === 'dimensions'}
            onChange={(e) => setResizeMode(e.target.value as 'scale' | 'dimensions')}
          /> Custom Dimensions
        </label>
      </div>

      {resizeMode === 'scale' ? (
        <div style={{ marginBottom: '20px' }}>
          <label>Select Scale: </label>
          <select 
            value={scale} 
            onChange={(e) => setScale(Number(e.target.value))}
            style={{ marginRight: '10px' }}
          >
            <option value={2}>2x</option>
            <option value={4}>4x</option>
            <option value={8}>8x</option>
            <option value={16}>16x</option>
            <option value={32}>32x</option>
          </select>
          <label>
            Custom (power of 2):
            <input
              type="number"
              value={customScale}
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
              value={targetWidth}
              onChange={(e) => setTargetWidth(e.target.value)}
              style={{ marginLeft: '5px', width: '70px', marginRight: '20px' }}
            />
          </label>
          <label>
            Height:
            <input
              type="number"
              value={targetHeight}
              onChange={(e) => setTargetHeight(e.target.value)}
              style={{ marginLeft: '5px', width: '70px' }}
            />
          </label>
        </div>
      )}

      <input type="file" accept="image/png" onChange={handleImageUpload} />

      {originalImage && (
        <div style={{ marginTop: '20px' }}>
          <h3>Original Image {originalDimensions && `(${originalDimensions.width}x${originalDimensions.height})`}</h3>
          <img
            src={originalImage}
            alt="Original"
            style={imageStyle}
          />
          <br />
          <button onClick={resizeImage} style={{ marginTop: '10px' }}>
            {resizeMode === 'scale' ? `Resize by ${scale}x` : 'Resize to dimensions'}
          </button>
        </div>
      )}

      {resizedImageURL && (
        <div style={{ marginTop: '20px' }}>
          <h3>Resized Image {finalDimensions && `(${finalDimensions.width}x${finalDimensions.height})`}</h3>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ marginRight: '10px' }}>
              Filename: 
              <input
                type="text"
                value={outputFilename}
                onChange={(e) => setOutputFilename(e.target.value)}
                style={{ marginLeft: '5px' }}
              />
              .png
            </label>
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = resizedImageURL;
                link.download = `${outputFilename}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              style={{ marginRight: '10px' }}
            >
              Download Resized Image
            </button>
            <button
              onClick={async () => {
                try {
                  const response = await fetch(resizedImageURL);
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
            >
              Copy to Clipboard
            </button>
          </div>
          <img 
            src={resizedImageURL} 
            alt="Resized" 
            style={imageStyle}
          />
        </div>
      )}
    </div>
  );
};

export default App;
