    let fontSize = 16;
    let highContrast = false;
    
    function aumentarFonte() {
      if (fontSize < 24) {
        fontSize += 2;
        document.body.style.fontSize = fontSize + 'px';
      }
    }
    
    function diminuirFonte() {
      if (fontSize > 12) {
        fontSize -= 2;
        document.body.style.fontSize = fontSize + 'px';
      }
    }
    
    function altoContraste() {
      highContrast = !highContrast;
      if (highContrast) {
        document.documentElement.style.setProperty('--bg-page', '#000000');
        document.documentElement.style.setProperty('--card', '#1a1a1a');
        document.documentElement.style.setProperty('--text', '#ffffff');
        document.documentElement.style.setProperty('--border', '#ffffff');
      } else {
        document.documentElement.style.setProperty('--bg-page', '#d7dccf');
        document.documentElement.style.setProperty('--card', '#f6f0e9');
        document.documentElement.style.setProperty('--text', '#2b2b2b');
        document.documentElement.style.setProperty('--border', '#cfc6ba');
      }
    }
    
    function resetar() {
      fontSize = 16;
      highContrast = false;
      document.body.style.fontSize = fontSize + 'px';
      document.documentElement.style.setProperty('--bg-page', '#d7dccf');
      document.documentElement.style.setProperty('--card', '#f6f0e9');
      document.documentElement.style.setProperty('--text', '#2b2b2b');
      document.documentElement.style.setProperty('--border', '#cfc6ba');
    }
