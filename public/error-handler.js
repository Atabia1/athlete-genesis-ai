/**
 * Global Error Handler
 * 
 * This script provides comprehensive error handling for the application.
 * It catches unhandled errors and displays them in a user-friendly way.
 */

(function() {
  console.log('Global Error Handler loaded');
  
  // Store original console methods
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  
  // Create an error log
  window.APP_ERROR_LOG = [];
  
  // Maximum number of errors to store
  const MAX_ERROR_LOG_SIZE = 50;
  
  // Create a function to log errors
  function logError(error, source = 'unknown', metadata = {}) {
    // Create error entry
    const errorEntry = {
      timestamp: new Date().toISOString(),
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : null,
      source,
      metadata,
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    // Add to error log
    window.APP_ERROR_LOG.unshift(errorEntry);
    
    // Trim error log if it's too large
    if (window.APP_ERROR_LOG.length > MAX_ERROR_LOG_SIZE) {
      window.APP_ERROR_LOG.pop();
    }
    
    // Log to console
    originalConsoleError('[APP ERROR]', errorEntry);
    
    return errorEntry;
  }
  
  // Override console.error
  console.error = function(...args) {
    // Call original console.error
    originalConsoleError.apply(console, args);
    
    // Log error
    const errorMessage = args.map(arg => 
      arg instanceof Error ? arg.message : String(arg)
    ).join(' ');
    
    logError(errorMessage, 'console.error');
  };
  
  // Override console.warn
  console.warn = function(...args) {
    // Call original console.warn
    originalConsoleWarn.apply(console, args);
    
    // Log warning
    const warningMessage = args.map(arg => String(arg)).join(' ');
    
    // Add to error log with warning level
    const warningEntry = {
      timestamp: new Date().toISOString(),
      message: warningMessage,
      level: 'warning',
      source: 'console.warn',
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    window.APP_ERROR_LOG.unshift(warningEntry);
    
    // Trim error log if it's too large
    if (window.APP_ERROR_LOG.length > MAX_ERROR_LOG_SIZE) {
      window.APP_ERROR_LOG.pop();
    }
  };
  
  // Global error handler
  window.onerror = function(message, source, lineno, colno, error) {
    const errorEntry = logError(
      error || message,
      'window.onerror',
      { source, lineno, colno }
    );
    
    // Display error UI
    displayErrorUI(errorEntry);
    
    // Return true to prevent default browser error handling
    return true;
  };
  
  // Unhandled promise rejection handler
  window.onunhandledrejection = function(event) {
    const errorEntry = logError(
      event.reason,
      'unhandledrejection',
      { promise: event.promise }
    );
    
    // Display error UI
    displayErrorUI(errorEntry);
  };
  
  // Function to display error UI
  function displayErrorUI(errorEntry) {
    // Check if error UI already exists
    if (document.getElementById('app-error-container')) {
      return;
    }
    
    // Create error container
    const errorContainer = document.createElement('div');
    errorContainer.id = 'app-error-container';
    errorContainer.style.position = 'fixed';
    errorContainer.style.top = '0';
    errorContainer.style.left = '0';
    errorContainer.style.width = '100%';
    errorContainer.style.backgroundColor = '#f44336';
    errorContainer.style.color = 'white';
    errorContainer.style.padding = '10px';
    errorContainer.style.textAlign = 'center';
    errorContainer.style.zIndex = '9999';
    errorContainer.style.fontFamily = 'Arial, sans-serif';
    
    // Create error message
    const errorMessage = document.createElement('div');
    errorMessage.textContent = errorEntry.message || 'An error occurred';
    errorMessage.style.marginBottom = '10px';
    errorMessage.style.fontWeight = 'bold';
    
    // Create error details
    const errorDetails = document.createElement('div');
    errorDetails.textContent = `Source: ${errorEntry.source} | Time: ${new Date(errorEntry.timestamp).toLocaleTimeString()}`;
    errorDetails.style.fontSize = '12px';
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Dismiss';
    closeButton.style.backgroundColor = 'white';
    closeButton.style.color = '#f44336';
    closeButton.style.border = 'none';
    closeButton.style.padding = '5px 10px';
    closeButton.style.marginLeft = '10px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.borderRadius = '3px';
    closeButton.onclick = function() {
      document.body.removeChild(errorContainer);
    };
    
    // Create reload button
    const reloadButton = document.createElement('button');
    reloadButton.textContent = 'Reload Page';
    reloadButton.style.backgroundColor = 'white';
    reloadButton.style.color = '#f44336';
    reloadButton.style.border = 'none';
    reloadButton.style.padding = '5px 10px';
    reloadButton.style.marginLeft = '10px';
    reloadButton.style.cursor = 'pointer';
    reloadButton.style.borderRadius = '3px';
    reloadButton.onclick = function() {
      window.location.reload();
    };
    
    // Add elements to container
    errorContainer.appendChild(errorMessage);
    errorContainer.appendChild(errorDetails);
    errorContainer.appendChild(closeButton);
    errorContainer.appendChild(reloadButton);
    
    // Add container to body
    document.body.appendChild(errorContainer);
  }
  
  // Add error handler to window
  window.APP_ERROR_HANDLER = {
    logError,
    getErrorLog: function() {
      return [...window.APP_ERROR_LOG];
    },
    clearErrorLog: function() {
      window.APP_ERROR_LOG = [];
    },
    displayErrorUI
  };
  
  // Log success
  console.log('Global Error Handler initialized');
})();
