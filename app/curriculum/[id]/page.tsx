"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";

import { Logo } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  GraphSidebar,
  GraphCanvas,
  MilestoneBar,
  ZoomControls,
} from "@/components/curriculum";
import { useGraphLayout, useZoomPan } from "@/hooks";
import { dummyCurriculumGraph } from "@/lib/dummy-curriculum";
import { CurriculumNode } from "@/lib/types";

/**
 * 커리큘럼 그래프 페이지
 * 
 * 컴포넌트 구조:
 * - GraphSidebar: 선택된 노드 상세 정보
 * - GraphCanvas: 그래프 SVG 시각화
 * - MilestoneBar: 하단 학습 마일스톤
 * - ZoomControls: 줌 컨트롤
 * 
 * 커스텀 훅:
 * - useGraphLayout: 노드 레이아웃 계산
 * - useZoomPan: 줌/팬 상태 관리
 */
export default function CurriculumGraphPage() {
  const graph = dummyCurriculumGraph;

  // 선택된 노드 상태
  const [selectedNode, setSelectedNode] = useState<CurriculumNode | null>(
    graph.nodes.find(n => n.keyword_id === "node-attention") ||
      graph.nodes[0] ||
      null
  );

  // 그래프 레이아웃 계산 (커스텀 훅)
  const { positions: nodePositions, sortedNodeIds } = useGraphLayout(
    graph.nodes,
    graph.edges
  );

  // 줌/팬 상태 (커스텀 훅)
  const {
    zoom,
    viewBox,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    zoomIn,
    zoomOut,
    resetView,
    panTo,
  } = useZoomPan();

  // 중요 노드 목록 (topological order로 정렬)
  const importantNodes = useMemo(() => {
    const orderMap = new Map(sortedNodeIds.map((id, index) => [id, index]));
    return graph.nodes
      .filter(n => n.importance >= 7)
      .sort((a, b) => {
        const orderA = orderMap.get(a.keyword_id) ?? 999;
        const orderB = orderMap.get(b.keyword_id) ?? 999;
        return orderA - orderB;
      });
  }, [graph.nodes, sortedNodeIds]);

  // 노드 선택 핸들러 (5.9 Use Functional setState - useCallback으로 안정적인 참조)
  const handleNodeSelect = useCallback((node: CurriculumNode) => {
    setSelectedNode(node);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-30 relative">
        <div className="flex items-center gap-4">
          <Logo size="sm" />
          <div className="w-px h-6 bg-slate-200" />
          <div>
            <h1 className="text-sm font-bold text-slate-900">
              {graph.meta.paper_title}
            </h1>
            <p className="text-xs text-slate-500">
              {graph.nodes.length} Key Concepts •{" "}
              {graph.meta.total_study_time_hours} Hours
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-green-600 text-xs font-medium bg-green-50 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            AI Learning Path Active
          </div>
          <Link href="/curriculum/history">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg text-xs gap-1.5 h-8"
            >
              <span className="material-symbols-outlined text-base">
                dashboard
              </span>
              Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar - 선택된 노드 상세 정보 */}
        <GraphSidebar
          selectedNode={selectedNode}
          importantNodes={importantNodes}
        />

        {/* Graph Area */}
        <section className="flex-1 flex flex-col relative bg-[#f8fafc] overflow-hidden">
          {/* Zoom Controls */}
          <ZoomControls
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onReset={resetView}
          />

          {/* SVG Graph Canvas */}
          <GraphCanvas
            nodes={graph.nodes}
            edges={graph.edges}
            nodePositions={nodePositions}
            selectedNodeId={selectedNode?.keyword_id ?? null}
            viewBox={viewBox}
            isDragging={isDragging}
            onNodeSelect={handleNodeSelect}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
          />

          {/* Bottom Milestone Bar */}
          <MilestoneBar
            nodes={importantNodes}
            nodePositions={nodePositions}
            selectedNodeId={selectedNode?.keyword_id ?? null}
            zoom={zoom}
            onNodeSelect={handleNodeSelect}
            onPanTo={panTo}
          />
        </section>
      </div>
    </div>
  );
}
