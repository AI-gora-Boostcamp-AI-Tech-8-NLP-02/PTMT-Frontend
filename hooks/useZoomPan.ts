import { useState, useCallback, useMemo, MouseEvent, WheelEvent } from "react";

interface UseZoomPanReturn {
  zoom: number;
  pan: { x: number; y: number };
  isDragging: boolean;
  viewBox: string;
  handleMouseDown: (e: MouseEvent) => void;
  handleMouseMove: (e: MouseEvent) => void;
  handleMouseUp: () => void;
  handleWheel: (e: WheelEvent<SVGSVGElement>) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  panTo: (x: number, y: number) => void;
}

const INITIAL_ZOOM = 1;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.1;
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 600;

/**
 * 그래프 캔버스의 줌/팬 기능을 관리하는 훅
 */
export function useZoomPan(): UseZoomPanReturn {
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Functional setState로 안정적인 콜백 (5.9 Use Functional setState Updates)
  const handleMouseDown = useCallback((e: MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const dx = (e.clientX - dragStart.x) / zoom;
    const dy = (e.clientY - dragStart.y) / zoom;
    setPan(p => ({ x: p.x + dx, y: p.y + dy }));
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, zoom, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    setZoom(z => Math.min(Math.max(z + delta, MIN_ZOOM), MAX_ZOOM));
  }, []);

  const zoomIn = useCallback(() => {
    setZoom(z => Math.min(z + ZOOM_STEP, MAX_ZOOM));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom(z => Math.max(z - ZOOM_STEP, MIN_ZOOM));
  }, []);

  const resetView = useCallback(() => {
    setZoom(0.8);
    setPan({ x: 0, y: 0 });
  }, []);

  const panTo = useCallback((x: number, y: number) => {
    setPan({
      x: -(x - CANVAS_WIDTH / 2) * zoom,
      y: -(y - CANVAS_HEIGHT / 2) * zoom,
    });
  }, [zoom]);

  // ViewBox 계산
  const viewBox = useMemo(() => {
    const w = CANVAS_WIDTH / zoom;
    const h = CANVAS_HEIGHT / zoom;
    const x = (CANVAS_WIDTH - w) / 2 - pan.x;
    const y = (CANVAS_HEIGHT - h) / 2 - pan.y;
    return `${x} ${y} ${w} ${h}`;
  }, [zoom, pan]);

  return {
    zoom,
    pan,
    isDragging,
    viewBox,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    zoomIn,
    zoomOut,
    resetView,
    panTo,
  };
}
