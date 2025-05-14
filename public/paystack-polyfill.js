/**
 * Paystack Polyfill
 * 
 * This script provides polyfills for Paystack integration,
 * specifically addressing issues with react-paystack and forwardRef.
 */

(function() {
  console.log('Paystack polyfill loaded');
  
  // Create a global PaystackPop object if it doesn't exist
  if (typeof window.PaystackPop === 'undefined') {
    console.log('Creating PaystackPop polyfill');
    
    window.PaystackPop = {
      setup: function(config) {
        console.log('PaystackPop.setup called with config:', config);
        
        // Return a handler object with an openIframe method
        return {
          openIframe: function() {
            console.log('PaystackPop.openIframe called');
            
            // Create a simple modal to show that Paystack would be opened
            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.zIndex = '9999';
            
            const content = document.createElement('div');
            content.style.backgroundColor = 'white';
            content.style.padding = '20px';
            content.style.borderRadius = '8px';
            content.style.maxWidth = '500px';
            content.style.width = '90%';
            
            content.innerHTML = `
              <h2 style="margin-top: 0;">Paystack Payment</h2>
              <p>This is a polyfill for Paystack. In production, this would open the Paystack payment modal.</p>
              <p><strong>Email:</strong> ${config.email}</p>
              <p><strong>Amount:</strong> ${config.amount / 100} ${config.currency || 'NGN'}</p>
              <p><strong>Reference:</strong> ${config.reference}</p>
              <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
                <button id="paystack-cancel" style="margin-right: 10px; padding: 8px 16px; background-color: #f1f1f1; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
                <button id="paystack-success" style="padding: 8px 16px; background-color: #0ba4db; color: white; border: none; border-radius: 4px; cursor: pointer;">Pay Now</button>
              </div>
            `;
            
            modal.appendChild(content);
            document.body.appendChild(modal);
            
            // Add event listeners
            document.getElementById('paystack-success').addEventListener('click', function() {
              document.body.removeChild(modal);
              if (config.callback) {
                config.callback({ reference: config.reference, status: 'success' });
              }
            });
            
            document.getElementById('paystack-cancel').addEventListener('click', function() {
              document.body.removeChild(modal);
              if (config.onClose) {
                config.onClose();
              }
            });
          }
        };
      }
    };
  }
  
  // Create a polyfill for the react-paystack library
  if (typeof window.ReactPaystack === 'undefined') {
    window.ReactPaystack = {
      usePaystackPayment: function(config) {
        return function(callbacks) {
          if (window.PaystackPop) {
            const handler = window.PaystackPop.setup({
              ...config,
              callback: callbacks.callback,
              onClose: callbacks.onClose
            });
            handler.openIframe();
          } else {
            console.error('PaystackPop is not available');
          }
        };
      }
    };
  }
  
  // Log success
  console.log('Paystack polyfill complete');
})();
