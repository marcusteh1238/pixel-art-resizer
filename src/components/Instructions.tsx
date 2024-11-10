import { listStyle, sectionContainerStyle, sectionHeaderStyle } from "../styles";

export const Instructions: React.FC = () => {
  return (
    <div style={sectionContainerStyle}>
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
    
  );
};
