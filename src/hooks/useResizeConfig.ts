import { useState, useEffect } from 'react';
import { ResizeConfig, ResizeMode } from '../utils/types';

interface FilenameConfig {
  zipFilename: string;
  template: string;
}

export const useResizeConfig = () => {
  const [resizeConfig, setResizeConfig] = useState<ResizeConfig>({
    mode: 'scale' as ResizeMode,
    scale: 2,
    customScale: '',
    targetWidth: '',
    targetHeight: ''
  });

  const [filenameConfig, setFilenameConfig] = useState<FilenameConfig>({
    zipFilename: `resized-images-{date}`,
    template: '{filename}_x{scale}'
  });

  useEffect(() => {
    setFilenameConfig(prev => ({
      ...prev,
      template: resizeConfig.mode === 'scale' 
        ? '{filename}_x{scale}' 
        : '{filename}_{width}x{height}'
    }));
  }, [resizeConfig.mode]);

  return {
    resizeConfig,
    setResizeConfig,
    filenameConfig,
    setFilenameConfig
  };
}; 