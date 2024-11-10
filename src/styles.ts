export const imageStyle = {
  border: '1px solid black',
  maxWidth: '100vw',
  maxHeight: '300px',
  width: 'auto',
  height: 'auto'
} as const;

export const buttonStyle = {
  padding: '8px 12px',
  backgroundColor: '#f0f0f0',
  border: '1px solid #ddd',
  borderRadius: '4px',
  cursor: 'pointer',
  margin: '0 5px',
  fontSize: '14px',
  lineHeight: '1.5',
  display: 'inline-block',
  fontFamily: 'inherit'
} as const;

export const sectionContainerStyle = {
  padding: '20px',
  maxWidth: '800px',
  margin: '50px auto 0',
  borderTop: '1px solid #eee',
  color: '#333',
  lineHeight: '1.6'
} as const;

export const sectionHeaderStyle = {
  color: '#222',
  marginBottom: '15px'
} as const;

export const listStyle = {
  textAlign: 'left' as const,
  paddingLeft: '20px'
};

export const scrollableContainerStyle = {
  display: 'flex',
  gap: '20px',
  overflowX: 'auto',
  padding: '20px 0',
  WebkitOverflowScrolling: 'touch',
  maxWidth: '100vw',
  margin: '0 auto',
  justifyContent: 'center'
} as const;

export const imageContainerStyle = {
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center'
} as const;

export const dimensionsStyle: React.CSSProperties = {
  textAlign: 'center',
  fontSize: '14px',
  color: '#666',
  marginTop: '8px'
};

export const imageWrapperStyle: React.CSSProperties = {
  position: 'relative',
};

export const removeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '5px',
  right: '5px',
  background: 'rgba(255, 0, 0, 0.7)',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  width: '24px',
  height: '24px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  padding: '0',
  lineHeight: '1',
  opacity: 0,
  transition: 'opacity 0.2s ease',
};