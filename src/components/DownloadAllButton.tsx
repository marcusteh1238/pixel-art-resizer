import React from 'react';
import { buttonStyle } from '../styles';
import { FilenameConfig } from '../components/FilenameConfig';
import { ImageInfo, ResizeConfig } from '../utils/types';
import { downloadZip } from '../utils/downloadUtils';
import { processTemplate } from '../utils/fileUtils';

interface DownloadAllButtonProps {
  images: ImageInfo[];
  filenameConfig: FilenameConfig;
  resizeConfig: ResizeConfig;
}

export const DownloadAllButton: React.FC<DownloadAllButtonProps> = ({
  images,
  filenameConfig,
  resizeConfig
}) => {
  const handleDownloadAll = () => {
    const processedZipFilename = processTemplate(filenameConfig.zipFilename, undefined, resizeConfig);
    downloadZip(
      images,
      processedZipFilename,
      filenameConfig.template,
      resizeConfig
    );
  };

  return (
    <button onClick={handleDownloadAll} style={buttonStyle}>
      Download All as ZIP
    </button>
  );
}; 