"use client";

import { Badge } from "@/components/ui/badge";
import { CurriculumNode } from "@/lib/types";
import { memo, useState } from "react";
import {
  RESOURCE_TYPE_ICONS,
  RESOURCE_TYPE_LABELS,
} from "../../../../const/resourceType";

interface GraphSidebarProps {
  selectedNode: CurriculumNode | null;
  importantNodes: CurriculumNode[];
}

// 6.3 Hoist Static JSX - 정적 JSX를 컴포넌트 외부로 hoist
const emptyState = (
  <div className='flex flex-col items-center justify-center h-full text-slate-400'>
    <span className='material-symbols-outlined text-5xl mb-4 text-slate-200'>
      ads_click
    </span>
    <p className='text-sm font-medium'>Select a node to view details</p>
  </div>
);

/**
 * 선택된 노드의 상세 정보를 표시하는 사이드바
 * 5.5 Extract to Memoized Components - memo로 불필요한 리렌더 방지
 */
export const GraphSidebar = memo(function GraphSidebar({
  selectedNode,
  importantNodes,
}: GraphSidebarProps) {
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(
    selectedNode?.resources?.[0]?.resource_id ?? null
  );

  if (!selectedNode) {
    return (
      <aside className='w-100 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 h-full shadow-xl shadow-slate-200/50'>
        <div className='flex-1 overflow-y-auto p-6 custom-scrollbar'>
          {emptyState}
        </div>
      </aside>
    );
  }

  const nodeIndex = importantNodes.findIndex(
    n => n.keyword_id === selectedNode.keyword_id
  );

  const selectedResource = selectedNode.resources.find(
    r => r.resource_id === selectedResourceId
  );

  return (
    <aside className='w-100 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 h-full shadow-xl shadow-slate-200/50'>
      <div className='flex-1 overflow-y-auto p-6 custom-scrollbar'>
        <div className='space-y-8 pb-10'>
          {/* 1. Header Section */}
          <div className='space-y-4'>
            <div className='inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100'>
              <span className='text-xs font-bold uppercase tracking-wide'>
                Current Concept
              </span>
            </div>

            <div>
              <h2 className='text-2xl font-black text-slate-900 mb-2 leading-tight'>
                {selectedNode.keyword}
              </h2>
              <div className='bg-accent/10 rounded-2xl inline-flex flex-wrap items-center gap-2 px-2 py-1 my-1'>
                <span className='flex items-center gap-1'>
                  <span
                    className={`
                    material-symbols-outlined text-accent
                  `}
                    style={{ fontSize: "18px" }}
                  >
                    star
                  </span>
                  <span
                    className={`
                    text-xs font-semibold text-accent
                  `}
                  >
                    {selectedNode.keyword_importance}
                  </span>
                </span>
              </div>
              <p className='text-sm text-slate-600 leading-relaxed font-medium'>
                {selectedNode.description}
              </p>
            </div>
          </div>

          <div className='w-full h-px bg-slate-100' />

          {/* 2. Resources Section */}
          <div>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-sm font-bold text-slate-900'>
                Learning Resources
              </h3>
              <Badge
                variant='outline'
                className='text-xs font-normal text-blue-600 bg-blue-200/50 border-blue-600'
              >
                {selectedNode.resources.length} items
              </Badge>
            </div>

            <div className='space-y-4'>
              {selectedNode.resources.map(resource => (
                <div
                  key={resource.resource_id}
                  onClick={() => setSelectedResourceId(resource.resource_id)}
                  className={`rounded-xl border p-4 transition-all group cursor-pointer ${
                    selectedResourceId === resource.resource_id
                      ? "bg-blue-50/50 border-blue-400 shadow-sm"
                      : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  <div className='flex items-start gap-3 mb-3'>
                    <div className='w-10 h-10 rounded-lg bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center shrink-0 transition-colors'>
                      <span className='material-symbols-outlined text-slate-500 group-hover:text-blue-600 text-xl'>
                        {RESOURCE_TYPE_ICONS[resource.type] || "article"}
                      </span>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2 mb-1'>
                        <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider'>
                          {resource.type}
                        </span>
                        {resource.is_necessary && (
                          <span className='text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded'>
                            CORE
                          </span>
                        )}
                      </div>
                      <h4 className='text-sm font-bold text-slate-800 leading-snug'>
                        {resource.resource_name}
                      </h4>
                    </div>
                  </div>

                  {/* Resource Stats */}
                  <div className='grid grid-cols-3 gap-2 mb-3 bg-slate-50 rounded-lg p-2'>
                    <div className='text-center'>
                      <div className='text-xs font-bold text-slate-700'>
                        {resource.importance}/10
                      </div>
                      <div className='text-[9px] text-slate-400 uppercase'>
                        Impact
                      </div>
                    </div>
                    <div className='text-center border-l border-slate-200'>
                      <div className='text-xs font-bold text-slate-700'>
                        {resource.difficulty}/10
                      </div>
                      <div className='text-[9px] text-slate-400 uppercase'>
                        Diff
                      </div>
                    </div>
                    <div className='text-center border-l border-slate-200'>
                      <div className='text-xs font-bold text-slate-700'>
                        {resource.study_load}h
                      </div>
                      <div className='text-[9px] text-slate-400 uppercase'>
                        Time
                      </div>
                    </div>
                  </div>

                  {resource.url && (
                    <a
                      href={resource.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center justify-center w-full py-2 bg-slate-100 hover:bg-slate-800 hover:text-white text-slate-600 rounded-lg text-xs font-bold transition-colors gap-2'
                    >
                      <span>Open Content</span>
                      <span className='material-symbols-outlined text-sm'>
                        open_in_new
                      </span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
          {selectedResource && (
            <div className='my-3 pt-6 border-t border-slate-100'>
              <div className='bg-slate-900 rounded-xl px-5 py-4 text-white'>
                <div className='flex items-center gap-2 mb-3'>
                  <span
                    className='material-symbols-outlined text-amber-400'
                    style={{ fontSize: "20px" }}
                  >
                    lightbulb
                  </span>
                  <span className='font-bold text-sm'>
                    About this {RESOURCE_TYPE_LABELS[selectedResource.type]}
                  </span>
                </div>
                <p className='text-xs text-slate-300 leading-relaxed'>
                  {selectedResource.resource_description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
});
