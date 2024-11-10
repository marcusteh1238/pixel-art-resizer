export const Footer: React.FC = () => {
  return (
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
  );
}; 