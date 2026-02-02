"use client";

import { CurriculumNode } from "@/lib/types";
import { memo, MouseEvent, useRef, WheelEvent } from "react";
import { RESOURCE_TYPE_ICONS } from "../../../../const/resourceType";

interface NodePosition {
  x: number;
  y: number;
}

interface GraphCanvasProps {
  nodes: CurriculumNode[];
  edges: { from_keyword_id: string; to_keyword_id: string }[];
  nodePositions: Record<string, NodePosition>;
  selectedNodeId: string | null;
  viewBox: string;
  isDragging: boolean;
  onNodeSelect: (node: CurriculumNode) => void;
  onMouseDown: (e: MouseEvent) => void;
  onMouseMove: (e: MouseEvent) => void;
  onMouseUp: () => void;
  onWheel: (e: WheelEvent<SVGSVGElement>) => void;
}

/**
 * 그래프 SVG 캔버스 컴포넌트
 * 5.5 Extract to Memoized Components - 복잡한 SVG 렌더링을 memo로 최적화
 */
export const GraphCanvas = memo(function GraphCanvas({
  nodes,
  edges,
  nodePositions,
  selectedNodeId,
  viewBox,
  isDragging,
  onNodeSelect,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onWheel,
}: GraphCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  return (
    <div
      className={`w-full flex-1 relative overflow-hidden ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <svg
        ref={svgRef}
        viewBox={viewBox}
        className='w-full h-full'
        onWheel={onWheel}
      >
        <defs>
          <pattern
            id='grid'
            width='40'
            height='40'
            patternUnits='userSpaceOnUse'
          >
            <path
              d='M 40 0 L 0 0 0 40'
              fill='none'
              stroke='#e2e8f0'
              strokeWidth='0.5'
            />
          </pattern>
          <filter id='soft-shadow' x='-50%' y='-50%' width='200%' height='200%'>
            <feDropShadow
              dx='0'
              dy='4'
              stdDeviation='8'
              floodColor='#64748b'
              floodOpacity='0.1'
            />
          </filter>
          <marker
            id='arrowhead'
            markerWidth='10'
            markerHeight='7'
            refX='9'
            refY='3.5'
            orient='auto'
          >
            <path
              d='M0,0 L10,3.5 L0,7'
              fill='none'
              stroke='#94a3b8'
              strokeWidth='1.5'
            />
          </marker>
        </defs>

        <rect width='100%' height='100%' fill='#f8fafc' />
        <rect width='100%' height='100%' fill='url(#grid)' />

        {/* Edges */}
        <g>
          {edges.map((edge, idx) => {
            const start = nodePositions[edge.from_keyword_id];
            const end = nodePositions[edge.to_keyword_id];
            if (!start || !end) return null;

            const midX = (start.x + end.x) / 2;
            const cpX = midX;

            return (
              <path
                key={idx}
                d={`M ${start.x + 36} ${start.y} C ${cpX} ${start.y}, ${cpX} ${end.y}, ${end.x - 36} ${end.y}`}
                fill='none'
                stroke='#cbd5e1'
                strokeWidth='2'
                strokeLinecap='round'
                markerEnd='url(#arrowhead)'
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g>
          {nodes.map(node => {
            const pos = nodePositions[node.keyword_id];
            if (!pos) return null;
            const isSelected = selectedNodeId === node.keyword_id;
            const isImportant = node.keyword_importance >= 7;

            return (
              <g
                key={node.keyword_id}
                className='cursor-pointer transition-opacity duration-200'
                onClick={e => {
                  e.stopPropagation();
                  onNodeSelect(node);
                }}
              >
                {/* Selection Glow */}
                {isSelected && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={44}
                    fill='none'
                    stroke='#60a5fa'
                    strokeWidth='2'
                    strokeDasharray='6 6'
                    opacity='0.5'
                  >
                    <animateTransform
                      attributeName='transform'
                      type='rotate'
                      from={`0 ${pos.x} ${pos.y}`}
                      to={`360 ${pos.x} ${pos.y}`}
                      dur='10s'
                      repeatCount='indefinite'
                    />
                  </circle>
                )}

                {/* Node Body */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={36}
                  fill='#fff'
                  stroke={
                    isSelected ? "#2563eb" : isImportant ? "#f59e0b" : "#cbd5e1"
                  }
                  strokeWidth={isSelected ? 3 : isImportant ? 2 : 1.5}
                  filter='url(#soft-shadow)'
                />

                {/* Icon */}
                <foreignObject
                  x={pos.x - 15}
                  y={pos.y - 15}
                  width='30'
                  height='30'
                >
                  <div className='flex items-center justify-center w-full h-full text-slate-500'>
                    <span
                      className={`material-symbols-outlined text-[28px] ${isSelected ? "text-blue-600" : isImportant ? "text-amber-500" : "text-slate-400"}`}
                    >
                      {RESOURCE_TYPE_ICONS[node.resources[0]?.type] ||
                        "psychology"}
                    </span>
                  </div>
                </foreignObject>

                {/* Label */}
                <foreignObject
                  x={pos.x - 80}
                  y={pos.y + 45}
                  width='160'
                  height='40'
                >
                  <div
                    className={`text-center text-[12px] font-bold leading-tight line-clamp-2 ${isSelected ? "text-blue-700" : "text-slate-600"}`}
                  >
                    {node.keyword}
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
});
