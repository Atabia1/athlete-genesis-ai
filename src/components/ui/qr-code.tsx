/**
 * QR Code Component
 * 
 * This component renders a QR code using the qrcode.react library.
 * It's used for generating QR codes for connecting to health apps.
 */

import { useEffect, useRef } from 'react';

interface QRCodeProps {
  /** The value to encode in the QR code */
  value: string;
  
  /** Size of the QR code in pixels */
  size?: number;
  
  /** Background color of the QR code */
  bgColor?: string;
  
  /** Foreground color of the QR code */
  fgColor?: string;
  
  /** Level of error correction */
  level?: 'L' | 'M' | 'Q' | 'H';
  
  /** CSS class name */
  className?: string;
}

/**
 * QR Code Component
 * 
 * This component renders a QR code using the HTML5 Canvas API.
 * It's a lightweight alternative to using a full QR code library.
 */
export const QRCode = ({
  value,
  size = 200,
  bgColor = '#ffffff',
  fgColor = '#000000',
  level = 'M',
  className = '',
}: QRCodeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    // We'll use a dynamic import to load the QR code library only when needed
    const loadQRCode = async () => {
      try {
        // Import the QR code library
        const QRCodeLib = await import('qrcode');
        
        // Get the canvas element
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        // Generate the QR code
        await QRCodeLib.toCanvas(canvas, value, {
          width: size,
          margin: 2,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          errorCorrectionLevel: level,
        });
      } catch (error) {
        console.error('Failed to generate QR code:', error);
        
        // Fallback to a simple text display if QR code generation fails
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Clear the canvas
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);
        
        // Draw error message
        ctx.fillStyle = fgColor;
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('QR Code', size / 2, size / 2 - 20);
        ctx.fillText('Generation Failed', size / 2, size / 2);
        ctx.fillText('Please try again', size / 2, size / 2 + 20);
      }
    };
    
    loadQRCode();
  }, [value, size, bgColor, fgColor, level]);
  
  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
};

export default QRCode;
