/**
 * React Polyfill
 * 
 * This script provides polyfills for React features that might be missing
 * in certain environments or bundling configurations.
 */

(function() {
  console.log('React polyfill loaded');
  
  // Check if React is defined globally
  if (typeof window.React === 'undefined') {
    console.warn('React is not defined globally, creating placeholder');
    window.React = {};
  }
  
  // Ensure forwardRef is available
  if (typeof window.React.forwardRef !== 'function') {
    console.warn('React.forwardRef is not available, adding polyfill');
    
    // Simple polyfill for forwardRef
    window.React.forwardRef = function forwardRef(render) {
      // This is a simplified version that just calls the render function
      // It doesn't handle refs properly but prevents errors
      function ForwardRefPolyfill(props) {
        return render(props, null);
      }
      
      ForwardRefPolyfill.displayName = render.name 
        ? `ForwardRef(${render.name})` 
        : 'ForwardRef';
        
      return ForwardRefPolyfill;
    };
  }
  
  // Ensure createElement is available
  if (typeof window.React.createElement !== 'function') {
    console.warn('React.createElement is not available, adding placeholder');
    
    // This is just a placeholder to prevent errors
    window.React.createElement = function createElement() {
      console.error('React.createElement polyfill called - this is just a placeholder');
      return null;
    };
  }
  
  // Log success
  console.log('React polyfill complete');
})();
