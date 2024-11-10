import { ResizeConfig } from "../utils/types";

interface ScaleControlsProps {
  scale: number;
  customScale: string;
  onChange: (config: ResizeConfig) => void;
  config: ResizeConfig;
}

export const ScaleControls: React.FC<ScaleControlsProps> = ({ 
  scale, 
  customScale, 
  onChange, 
  config 
}) => {
  const handleCustomScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseInt(value);
    if (numValue && numValue > 0) {
      onChange({ 
        ...config, 
        scale: numValue,
        customScale: value 
      });
    } else {
      onChange({ 
        ...config, 
        customScale: value 
      });
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label>Select Scale: </label>
      <select 
        value={scale} 
        onChange={(e) => onChange({ ...config, scale: Number(e.target.value) })}
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
          value={customScale}
          onChange={handleCustomScaleChange}
          style={{ marginLeft: '5px', width: '70px' }}
        />
      </label>
    </div>
  );
}; 