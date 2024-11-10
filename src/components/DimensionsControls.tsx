import { ResizeConfig } from "../utils/types";

interface DimensionsControlsProps {
  width: string;
  height: string;
  onChange: (config: ResizeConfig) => void;
  config: ResizeConfig;
}

export const DimensionsControls: React.FC<DimensionsControlsProps> = ({ 
  width, 
  height, 
  onChange, 
  config 
}) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label>
        Width:
        <input
          type="number"
          value={width}
          onChange={(e) => onChange({ ...config, targetWidth: e.target.value })}
          style={{ marginLeft: '5px', width: '70px', marginRight: '20px' }}
        />
      </label>
      <label>
        Height:
        <input
          type="number"
          value={height}
          onChange={(e) => onChange({ ...config, targetHeight: e.target.value })}
          style={{ marginLeft: '5px', width: '70px' }}
        />
      </label>
    </div>
  );
}; 