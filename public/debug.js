// Debug script to help identify issues with the application
console.log('Debug script loaded');

// Check if window.APP_CONFIG is defined
if (window.APP_CONFIG) {
  console.log('APP_CONFIG is defined:', window.APP_CONFIG);
} else {
  console.error('APP_CONFIG is not defined');
}

// Check if React is defined
if (window.React) {
  console.log('React is defined globally:', window.React.version);
} else {
  console.warn('React is not defined globally - this is expected with modern bundlers but may cause issues with certain libraries');
}

// Add a global error handler
window.addEventListener('error', function(event) {
  console.error('Global error caught:', event.error);

  // Create an error message element
  const errorElement = document.createElement('div');
  errorElement.style.position = 'fixed';
  errorElement.style.top = '0';
  errorElement.style.left = '0';
  errorElement.style.right = '0';
  errorElement.style.padding = '20px';
  errorElement.style.backgroundColor = '#f44336';
  errorElement.style.color = 'white';
  errorElement.style.zIndex = '9999';
  errorElement.style.textAlign = 'center';
  errorElement.style.fontFamily = 'Arial, sans-serif';

  errorElement.innerHTML = `
    <h2>Application Error</h2>
    <p>${event.error ? event.error.message : 'Unknown error'}</p>
    <pre>${event.error ? event.error.stack : ''}</pre>
  `;

  document.body.appendChild(errorElement);
});

// Add a handler for unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled promise rejection:', event.reason);

  // Create an error message element
  const errorElement = document.createElement('div');
  errorElement.style.position = 'fixed';
  errorElement.style.top = '0';
  errorElement.style.left = '0';
  errorElement.style.right = '0';
  errorElement.style.padding = '20px';
  errorElement.style.backgroundColor = '#ff9800';
  errorElement.style.color = 'white';
  errorElement.style.zIndex = '9999';
  errorElement.style.textAlign = 'center';
  errorElement.style.fontFamily = 'Arial, sans-serif';

  errorElement.innerHTML = `
    <h2>Promise Rejection</h2>
    <p>${event.reason ? event.reason.message : 'Unknown error'}</p>
    <pre>${event.reason ? event.reason.stack : ''}</pre>
  `;

  document.body.appendChild(errorElement);
});

// Check DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM content loaded');

  // Check if the root element exists
  const rootElement = document.getElementById('root');
  if (rootElement) {
    console.log('Root element found');
  } else {
    console.error('Root element not found');
  }
});

// Add React debugging helper
window.debugReact = function() {
  if (!window.React) {
    console.error('React is not available globally');
    return {
      available: false,
      version: null,
      components: []
    };
  }

  // Get React version
  const version = window.React.version;

  // Try to find React components
  const components = [];
  const rootElement = document.getElementById('root');

  if (rootElement && rootElement._reactRootContainer) {
    console.log('React root container found');
    components.push('Root container available');
  }

  return {
    available: true,
    version: version,
    components: components
  };
};

// Add forwardRef debugging helper
window.checkForwardRef = function() {
  if (!window.React) {
    console.error('React is not available globally');
    return false;
  }

  if (window.React.forwardRef) {
    console.log('forwardRef is available globally');
    return true;
  } else {
    console.error('forwardRef is not available globally');
    return false;
  }
};
