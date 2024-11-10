import { ResizeConfig, ResizeMode } from "../utils/types";
import { DimensionsControls } from "./DimensionsControls";
import { ScaleControls } from "./ScaleControls";

interface ResizeControlsProps {
  resizeConfig: ResizeConfig;
  onConfigChange: (config: ResizeConfig) => void;
}

export const ResizeControls: React.FC<ResizeControlsProps> = ({ resizeConfig, onConfigChange }) => {
  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <label>
          <input
            type="radio"
            value="scale"
            checked={resizeConfig.mode === 'scale'}
            onChange={(e) => onConfigChange({ ...resizeConfig, mode: e.target.value as ResizeMode })}
          /> Scale
        </label>
        <label style={{ marginLeft: '20px' }}>
          <input
            type="radio"
            value="dimensions"
            checked={resizeConfig.mode === 'dimensions'}
            onChange={(e) => onConfigChange({ ...resizeConfig, mode: e.target.value as ResizeMode })}
          /> Custom Dimensions
        </label>
      </div>

      {resizeConfig.mode === 'scale' ? (
        <ScaleControls 
          scale={resizeConfig.scale}
          customScale={resizeConfig.customScale}
          onChange={onConfigChange}
          config={resizeConfig}
        />
      ) : (
        <DimensionsControls 
          width={resizeConfig.targetWidth}
          height={resizeConfig.targetHeight}
          onChange={onConfigChange}
          config={resizeConfig}
        />
      )}
    </>
  );
}; 