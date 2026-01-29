"use client";

import { CurriculumNode } from "@/lib/types";
import { memo, useCallback } from "react";
import { RESOURCE_TYPE_ICONS } from "../../../../const/resourceType";

interface NodePosition {
  x: number;
  y: number;
}

interface MilestoneBarProps {
  nodes: CurriculumNode[];
  nodePositions: Record<string, NodePosition>;
  selectedNodeId: string | null;
  zoom: number;
  onNodeSelect: (node: CurriculumNode) => void;
  onPanTo: (x: number, y: number) => void;
}

/**
 * 하단 학습 마일스톤 바
 * 5.5 Extract to Memoized Components - memo로 불필요한 리렌더 방지
 */
export const MilestoneBar = memo(function MilestoneBar({
  nodes,
  nodePositions,
  selectedNodeId,
  onNodeSelect,
  onPanTo,
}: MilestoneBarProps) {
  // 5.9 Use Functional setState - 안정적인 콜백
  const handleNodeClick = useCallback(
    (node: CurriculumNode) => {
      onNodeSelect(node);
      const pos = nodePositions[node.keyword_id];
      if (pos) {
        onPanTo(pos.x, pos.y);
      }
    },
    [nodePositions, onNodeSelect, onPanTo]
  );

  return (
    <div className='h-60 bg-white border-t border-slate-200 shrink-0 z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] flex flex-col'>
      <div className='px-8 py-4 border-b border-slate-100 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='material-symbols-outlined text-amber-500'>
            stars
          </span>
          <h3 className='font-bold text-slate-800 text-lg'>
            Learning Milestones
          </h3>
        </div>
        <span className='text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full'>
          The Recommended Sequence
        </span>
      </div>

      <div className='flex-1 flex items-center gap-6 overflow-x-auto px-8 py-2 custom-scrollbar'>
        {nodes.map((node, idx) => {
          const isSelected = selectedNodeId === node.keyword_id;

          return (
            <button
              key={node.keyword_id}
              onClick={() => handleNodeClick(node)}
              className={`
                group flex flex-col items-center gap-3 min-w-25 transition-all duration-300
                ${isSelected ? "scale-110 opacity-100" : "opacity-70 hover:opacity-100 hover:scale-105"}
              `}
            >
              {/* Large Circle */}
              <div
                className={`
                  size-16 rounded-2xl flex items-center justify-center relative shadow-md transition-all
                  ${isSelected ? "bg-blue-600 shadow-blue-200" : "bg-white border-2 border-slate-100 group-hover:border-blue-200"}
                `}
              >
                <span
                  className={`material-symbols-outlined text-3xl ${isSelected ? "text-white" : "text-slate-400 group-hover:text-blue-500"}`}
                >
                  {RESOURCE_TYPE_ICONS[node.resources[0]?.type] || "psychology"}
                </span>

                {/* Sequence Number */}
                <div
                  className={`
                    absolute -top-2 -right-2 size-6 rounded-lg flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm
                    ${isSelected ? "bg-amber-400 text-amber-950" : "bg-slate-100 text-slate-500"}
                  `}
                >
                  {idx + 1}
                </div>
              </div>

              {/* Label */}
              <div className='text-center'>
                <span
                  className={`text-xs font-bold block whitespace-nowrap ${isSelected ? "text-blue-700" : "text-slate-600"}`}
                >
                  {node.keyword}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
});
