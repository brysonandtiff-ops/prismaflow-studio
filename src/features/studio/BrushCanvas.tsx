import React, { useRef, useState, useEffect } from 'react';

interface BrushCanvasProps {
  active: boolean;
  color: string;
  size: number;
  opacity: number;
  isEraser: boolean;
  softBrush: boolean;
  onUpdate: (dataUrl: string) => void;
  initialData?: string;
}

export const BrushCanvas = React.forwardRef<HTMLCanvasElement, BrushCanvasProps>(({
  active,
  color,
  size,
  opacity,
  isEraser,
  softBrush,
  onUpdate,
  initialData
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(canvasRef.current);
      } else {
        ref.current = canvasRef.current;
      }
    }
  }, [ref]);

  const [isDrawing, setIsDrawing] = useState(false);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineCap = softBrush ? 'round' : 'square';
    ctx.lineJoin = softBrush ? 'round' : 'miter';
    ctxRef.current = ctx;

    if (initialData) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = initialData;
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [initialData, softBrush]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!active) return;
    setIsDrawing(true);
    const pos = getPos(e);
    const ctx = ctxRef.current;
    if (!ctx) return;

    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !active) return;
    const pos = getPos(e);
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.lineWidth = size;
    if (!isEraser) {
      ctx.strokeStyle = color;
      ctx.globalAlpha = opacity;
    }
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const ctx = ctxRef.current;
    if (ctx) ctx.globalCompositeOperation = 'source-over';
    onUpdate(canvasRef.current?.toDataURL() || '');
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  return (
    <canvas
      ref={canvasRef}
      width={1000}
      height={1000}
      className={`absolute inset-0 w-full h-full ${active ? 'cursor-crosshair' : 'pointer-events-none'}`}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
    />
  );
});
BrushCanvas.displayName = 'BrushCanvas';
