import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './BottomSheet.module.css';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const sheetRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);
  const isInteractive = useRef(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;

    isDragging.current = false;
    isInteractive.current = false;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const isHandleArea = target.closest(`.${styles.handleArea}`) !== null;
      isInteractive.current = !isHandleArea && target.closest('input[type="range"], input[type="number"], [class*="presetChip"], button, [role="button"]') !== null;
      if (isInteractive.current) return;

      isDragging.current = true;
      startX.current = e.clientX;
      startY.current = e.clientY;
      currentX.current = startX.current;
      currentY.current = startY.current;
      sheet.style.transition = 'none';
      sheet.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      currentX.current = e.clientX;
      currentY.current = e.clientY;
      const deltaX = Math.abs(currentX.current - startX.current);
      const deltaY = currentY.current - startY.current;
      if (deltaY > 0 && deltaY > deltaX) {
        e.preventDefault(); // passive: false ensures this works
        sheet.style.transform = `translateY(${deltaY}px)`;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      isInteractive.current = false;
      if (!isDragging.current) return;
      isDragging.current = false;
      sheet.style.transition = '';
      sheet.style.transform = '';
      sheet.releasePointerCapture(e.pointerId);
      const deltaX = Math.abs(currentX.current - startX.current);
      const deltaY = currentY.current - startY.current;
      if (deltaY > 100 && deltaY > deltaX) {
        onClose();
      }
    };

    sheet.addEventListener('pointerdown', onPointerDown, { passive: false });
    sheet.addEventListener('pointermove', onPointerMove, { passive: false });
    sheet.addEventListener('pointerup', onPointerUp);
    sheet.addEventListener('pointercancel', onPointerUp);

    return () => {
      sheet.removeEventListener('pointerdown', onPointerDown);
      sheet.removeEventListener('pointermove', onPointerMove);
      sheet.removeEventListener('pointerup', onPointerUp);
      sheet.removeEventListener('pointercancel', onPointerUp);
    };
  }, [isOpen, onClose, shouldRender]);

  if (!shouldRender) return null;

  return createPortal(
    <div 
      className={`${styles.overlay} ${isOpen ? styles.open : ''}`} 
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      <div 
        className={`${styles.sheet} ${isOpen ? styles.open : ''}`}
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button 
          className={styles.handleArea} 
          ref={handleRef}
          onClick={onClose}
          aria-label="閉じる"
        >
          <div className={styles.handle} />
        </button>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
