interface FilenameConfigProps {
  config: FilenameConfig;
  onChange: (config: FilenameConfig) => void;
}

export type FilenameConfig = {
  zipFilename: string;
  template: string;
}

export const FilenameConfigInput: React.FC<FilenameConfigProps> = ({ config, onChange }) => {
  return (
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
          value={config.zipFilename}
          onChange={(e) => onChange({ ...config, zipFilename: e.target.value })}
          placeholder="resized-images"
          style={{ marginLeft: '10px', width: '380px' }}
        />
      </label>
      <label style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ width: '180px', whiteSpace: 'nowrap' }}>New Filename:</span>
        <input
          type="text"
          value={config.template}
          onChange={(e) => onChange({ ...config, template: e.target.value })}
          placeholder="e.g. {filename}_{width}x{height}"
          style={{ marginLeft: '10px', width: '380px' }}
        />
      </label>
    </div>
  );
}; 