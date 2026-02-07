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
  paper_id: string;
  paper_authors?: string[];
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
  paper_id,
  paper_authors,
}: GraphSidebarProps) {
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(
    selectedNode?.resources?.[0]?.resource_id ?? null
  );

  // useEffect(() => {
  //   if (selectedNode?.resources?.length) {
  //     setSelectedResourceId(selectedNode.resources[0].resource_id);
  //   } else {
  //     setSelectedResourceId(null);
  //   }
  // }, [selectedNode]);

  if (!selectedNode) {
    return (
      <aside className='w-100 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 h-full shadow-xl shadow-slate-200/50'>
        <div className='flex-1 overflow-y-auto p-6 custom-scrollbar'>
          {emptyState}
        </div>
      </aside>
    );
  }

  const resources = selectedNode.resources || [];
  const currentIndex = resources.findIndex(
    r => r.resource_id === selectedResourceId
  );
  const activeIndex =
    currentIndex === -1 && resources.length > 0 ? 0 : currentIndex;
  const selectedResource = resources[activeIndex];

  const handlePrev = () => {
    if (activeIndex > 0) {
      setSelectedResourceId(resources[activeIndex - 1].resource_id);
    }
  };

  const handleNext = () => {
    if (activeIndex < resources.length - 1) {
      setSelectedResourceId(resources[activeIndex + 1].resource_id);
    }
  };

  return (
    <aside className='w-100 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 h-full shadow-xl shadow-slate-200/50'>
      <div className='shrink-0 p-6 border-b border-slate-200 overflow-hidden'>
        <div className='space-y-6'>
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
              {selectedNode.keyword_id === paper_id && (
                <p
                  className='text-sm text-slate-500 font-medium truncate mb-4'
                  title={paper_authors?.join(", ")}
                >
                  {paper_authors?.join(", ")}
                </p>
              )}
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
                    {selectedNode.importance}
                  </span>
                </span>
              </div>
              <p className='text-sm text-slate-600 leading-relaxed font-medium'>
                {selectedNode.description}
              </p>
            </div>
          </div>

          {/* 2. Resources Section */}
          {selectedNode.keyword_id !== paper_id && resources.length > 0 && (
            <div>
              <div className='w-full h-px bg-slate-100 mb-6' />
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-sm font-bold text-slate-900'>
                  Learning Resources
                </h3>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={handlePrev}
                    disabled={activeIndex === 0}
                    className='p-1 rounded-full hover:bg-slate-100 disabled:opacity-30 transition-colors'
                  >
                    <span className='material-symbols-outlined text-lg text-slate-600'>
                      chevron_left
                    </span>
                  </button>
                  <Badge
                    variant='outline'
                    className='text-xs font-normal text-blue-600 bg-blue-200/50 border-blue-600 px-2 min-w-20 justify-center'
                  >
                    {activeIndex + 1} / {resources.length} items
                  </Badge>
                  <button
                    onClick={handleNext}
                    disabled={activeIndex === resources.length - 1}
                    className='p-1 rounded-full hover:bg-slate-100 disabled:opacity-30 transition-colors'
                  >
                    <span className='material-symbols-outlined text-lg text-slate-600'>
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>

              {selectedResource && (
                <div className='rounded-xl border p-4 transition-all group bg-blue-50/50 border-blue-400 shadow-sm'>
                  <div className='flex items-start gap-3 mb-3'>
                    <div className='w-10 h-10 rounded-lg bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center shrink-0 transition-colors'>
                      <span className='material-symbols-outlined text-slate-500 group-hover:text-blue-600 text-xl'>
                        {RESOURCE_TYPE_ICONS[selectedResource.type] ||
                          "article"}
                      </span>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2 mb-1'>
                        <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider'>
                          {selectedResource.type}
                        </span>
                        {selectedResource.is_core && (
                          <span className='text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded'>
                            CORE
                          </span>
                        )}
                      </div>
                      <h4 className='text-sm font-bold text-slate-800 leading-snug line-clamp-2 min-h-10'>
                        {selectedResource.name}
                      </h4>
                    </div>
                  </div>

                  {/* Resource Stats */}
                  <div className='grid grid-cols-3 gap-2 mb-3 bg-slate-50 rounded-lg p-2'>
                    <div className='text-center'>
                      <div className='text-xs font-bold text-slate-700'>
                        {selectedResource.importance}/10
                      </div>
                      <div className='text-[9px] text-slate-400 uppercase'>
                        Importance
                      </div>
                    </div>
                    <div className='text-center border-l border-slate-200'>
                      <div className='text-xs font-bold text-slate-700'>
                        {selectedResource.difficulty}/10
                      </div>
                      <div className='text-[9px] text-slate-400 uppercase'>
                        Diff
                      </div>
                    </div>
                    <div className='text-center border-l border-slate-200'>
                      <div className='text-xs font-bold text-slate-700'>
                        {selectedResource.study_load_minutes}h
                      </div>
                      <div className='text-[9px] text-slate-400 uppercase'>
                        Time
                      </div>
                    </div>
                  </div>

                  {selectedResource.url && (
                    <a
                      href={selectedResource.url}
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
              )}
            </div>
          )}
        </div>
      </div>

      {selectedResource && (
        <div className='flex-1 overflow-y-auto p-6 custom-scrollbar'>
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
              {selectedResource.description}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
});
