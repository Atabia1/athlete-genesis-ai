/**
 * React Core Polyfill
 * 
 * This script provides comprehensive polyfills for React features that might be missing
 * in certain environments or bundling configurations. It ensures that critical React
 * features are available globally to prevent runtime errors.
 */

(function() {
  console.log('React Core Polyfill loaded');
  
  // Create a global React object if it doesn't exist
  if (typeof window.React === 'undefined') {
    console.warn('React is not defined globally, creating a polyfill');
    window.React = {};
  }
  
  // Ensure core React features are available
  const reactFeatures = [
    'createElement',
    'createContext',
    'forwardRef',
    'memo',
    'Fragment',
    'useEffect',
    'useState',
    'useContext',
    'useRef',
    'useCallback',
    'useMemo',
    'useReducer',
    'useLayoutEffect',
    'useImperativeHandle',
    'Children',
    'cloneElement',
    'isValidElement'
  ];
  
  // Add missing features
  reactFeatures.forEach(feature => {
    if (typeof window.React[feature] !== 'function') {
      console.warn(`React.${feature} is not available, adding polyfill`);
      
      // Create a basic implementation for each feature
      switch (feature) {
        case 'createElement':
          window.React.createElement = function createElement(type, props, ...children) {
            // This is a simplified version that just returns an object
            return { type, props: props || {}, children };
          };
          break;
          
        case 'createContext':
          window.React.createContext = function createContext(defaultValue) {
            const context = {
              Provider: function Provider({ value, children }) {
                return children;
              },
              Consumer: function Consumer({ children }) {
                return children(defaultValue);
              },
              displayName: '',
              _currentValue: defaultValue
            };
            return context;
          };
          break;
          
        case 'forwardRef':
          window.React.forwardRef = function forwardRef(render) {
            function ForwardRefPolyfill(props) {
              // Extract ref from props if it exists
              const { ref, ...restProps } = props || {};
              // Call the render function with props and ref
              return render(restProps, ref);
            }
            
            ForwardRefPolyfill.displayName = render.name 
              ? `ForwardRef(${render.name})` 
              : 'ForwardRef';
              
            return ForwardRefPolyfill;
          };
          break;
          
        case 'memo':
          window.React.memo = function memo(Component, compare) {
            // This is a simplified version that just returns the component
            Component.displayName = `Memo(${Component.displayName || Component.name || 'Component'})`;
            return Component;
          };
          break;
          
        case 'Fragment':
          window.React.Fragment = function Fragment({ children }) {
            return children;
          };
          break;
          
        // Hooks (simplified implementations)
        case 'useState':
          window.React.useState = function useState(initialState) {
            // This is a simplified version that just returns the initial state
            return [
              typeof initialState === 'function' ? initialState() : initialState,
              function setState() { console.warn('setState polyfill called'); }
            ];
          };
          break;
          
        case 'useEffect':
        case 'useLayoutEffect':
          window.React[feature] = function useEffect(effect, deps) {
            // This is a simplified version that just calls the effect
            try {
              const cleanup = effect();
              if (typeof cleanup === 'function') {
                // Store cleanup function for potential future use
                window._reactEffectCleanups = window._reactEffectCleanups || [];
                window._reactEffectCleanups.push(cleanup);
              }
            } catch (error) {
              console.error(`Error in ${feature} polyfill:`, error);
            }
          };
          break;
          
        case 'useContext':
          window.React.useContext = function useContext(context) {
            // This is a simplified version that just returns the current value
            return context._currentValue;
          };
          break;
          
        case 'useRef':
          window.React.useRef = function useRef(initialValue) {
            // This is a simplified version that just returns an object with a current property
            return { current: initialValue };
          };
          break;
          
        case 'useCallback':
        case 'useMemo':
          window.React[feature] = function useCallback(callback, deps) {
            // This is a simplified version that just returns the callback
            return callback;
          };
          break;
          
        case 'useReducer':
          window.React.useReducer = function useReducer(reducer, initialState, init) {
            // This is a simplified version that just returns the initial state
            const state = init ? init(initialState) : initialState;
            return [
              state,
              function dispatch() { console.warn('dispatch polyfill called'); }
            ];
          };
          break;
          
        case 'useImperativeHandle':
          window.React.useImperativeHandle = function useImperativeHandle(ref, createHandle, deps) {
            // This is a simplified version that just calls createHandle
            if (ref) {
              const handle = createHandle();
              if (typeof ref === 'function') {
                ref(handle);
              } else {
                ref.current = handle;
              }
            }
          };
          break;
          
        case 'Children':
          window.React.Children = {
            map: function map(children, fn) {
              // This is a simplified version that just maps over the children
              return Array.isArray(children) ? children.map(fn) : children ? [fn(children)] : [];
            },
            forEach: function forEach(children, fn) {
              // This is a simplified version that just iterates over the children
              if (Array.isArray(children)) {
                children.forEach(fn);
              } else if (children) {
                fn(children);
              }
            },
            count: function count(children) {
              // This is a simplified version that just counts the children
              return Array.isArray(children) ? children.length : children ? 1 : 0;
            },
            only: function only(children) {
              // This is a simplified version that just returns the only child
              if (!children) {
                throw new Error('React.Children.only expected to receive a single React element child.');
              }
              return Array.isArray(children) ? children[0] : children;
            },
            toArray: function toArray(children) {
              // This is a simplified version that just converts children to an array
              return Array.isArray(children) ? children : children ? [children] : [];
            }
          };
          break;
          
        case 'cloneElement':
          window.React.cloneElement = function cloneElement(element, props, ...children) {
            // This is a simplified version that just returns a new object
            return {
              ...element,
              props: { ...element.props, ...props },
              children: children.length > 0 ? children : element.children
            };
          };
          break;
          
        case 'isValidElement':
          window.React.isValidElement = function isValidElement(object) {
            // This is a simplified version that just checks if the object has a type property
            return object && typeof object === 'object' && 'type' in object;
          };
          break;
          
        default:
          // For any other features, create a dummy function
          window.React[feature] = function() {
            console.warn(`${feature} polyfill called`);
            return null;
          };
      }
    }
  });
  
  // Log success
  console.log('React Core Polyfill complete');
})();
