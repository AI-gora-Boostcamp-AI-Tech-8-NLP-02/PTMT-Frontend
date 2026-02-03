"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AuthLoading } from "@/components/auth/AuthLoading";
import { Logo } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useAuthGuard, useGraphLayout, useZoomPan } from "@/hooks";
import { curriculumApi } from "@/lib/api";
import { CurriculumGraph, CurriculumNode } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import GraphCanvasNew from "./_components/GraphCanvasNew";
import { GraphSidebar } from "./_components/GraphSidebar";
import { MilestoneBar } from "./_components/MilestoneBar";

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
  const { isAuthenticated, isLoading: authLoading } = useAuthGuard();
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [graph, setGraph] = useState<CurriculumGraph | null>(null);
  const [isGraphLoading, setIsGraphLoading] = useState(true);
  const [graphError, setGraphError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    const curriculumId = params?.id;
    if (!curriculumId) return;

    const fetchGraph = async () => {
      setIsGraphLoading(true);
      setGraphError(null);
      try {
        const response = await curriculumApi.getGraph(curriculumId);
        setGraph(response);
      } catch (err) {
        setGraphError(
          err instanceof Error ? err.message : "그래프를 불러오지 못했습니다."
        );
      } finally {
        setIsGraphLoading(false);
      }
    };

    fetchGraph();
  }, [isAuthenticated, params]);

  // 선택된 노드 상태
  const [selectedNode, setSelectedNode] = useState<CurriculumNode | null>(null);

  useEffect(() => {
    if (!graph) return;
    const initial =
      graph.nodes.find(n => n.keyword_id === "node-attention") ||
      graph.nodes[0] ||
      null;
    setSelectedNode(initial);
  }, [graph]);

  // 그래프 레이아웃 계산 (커스텀 훅)
  const { positions: nodePositions, sortedNodeIds } = useGraphLayout(
    graph?.nodes ?? [],
    graph?.edges ?? [],
    graph?.meta.paper_id ?? ""
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
    return (graph?.nodes ?? []).filter(n => n.keyword_importance >= 7);
  }, [graph?.nodes, sortedNodeIds]);

  const firstNodes = useMemo(() => {
    if (!graph?.first_node_order || !graph?.nodes) return [];

    return graph.first_node_order
      .map(id => graph.nodes.find(n => n.keyword_id === id))
      .filter((n): n is CurriculumNode => n !== undefined);
  }, [graph?.nodes, graph?.first_node_order]);

  // 노드 선택 핸들러 (5.9 Use Functional setState - useCallback으로 안정적인 참조)
  const handleNodeSelect = useCallback((node: CurriculumNode) => {
    setSelectedNode(node);
  }, []);

  if (authLoading || !isAuthenticated) {
    return <AuthLoading />;
  }

  if (isGraphLoading) {
    return <AuthLoading />;
  }

  if (graphError) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background px-6 text-center'>
        <div className='max-w-lg'>
          <h2 className='text-xl font-bold mb-2'>그래프 불러오기 실패</h2>
          <p className='text-sm text-muted-foreground'>{graphError}</p>
        </div>
      </div>
    );
  }

  if (!graph) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background px-6 text-center'>
        <div className='max-w-lg'>
          <h2 className='text-xl font-bold mb-2'>그래프 정보가 없습니다</h2>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-screen bg-slate-50 overflow-hidden'>
      {/* Header */}
      <header className='h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-30 relative'>
        <div className='flex items-center gap-4'>
          <Logo size='sm' />
          <div className='w-px h-6 bg-slate-200' />
          <div>
            <h1 className='text-sm font-bold text-slate-900'>
              {graph.meta.paper_title}
            </h1>
            <p className='text-xs text-slate-500'>
              {graph.nodes.length} Key Concepts •{" "}
              {graph.meta.total_study_time_hours} Hours
            </p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-2 text-green-600 text-xs font-medium bg-green-50 px-3 py-1 rounded-full'>
            <span className='w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse' />
            AI Learning Path Active
          </div>
          {isAuthenticated ? (
            <>
              <Button
                variant='outline'
                size='sm'
                className='rounded-lg text-xs gap-1.5 h-8 hover:bg-primary'
                onClick={() => router.push("/user/history")}
              >
                <span className='material-symbols-outlined text-base'>
                  dashboard
                </span>
                Dashboard
              </Button>
            </>
          ) : (
            <>
              <Button
                variant='ghost'
                className={`rounded-xl font-semibold`}
                onClick={() => router.push("/auth/login")}
              >
                로그인
              </Button>
            </>
          )}
        </div>
      </header>

      <div className='flex flex-1 overflow-hidden relative'>
        {/* Sidebar - 선택된 노드 상세 정보 */}
        <GraphSidebar
          selectedNode={selectedNode}
          importantNodes={importantNodes}
        />

        {/* Graph Area */}
        <section className='flex-1 flex flex-col bg-[#f8fafc]'>
          {/* SVG Graph Canvas */}
          <GraphCanvasNew
            nodes={graph.nodes}
            edges={graph.edges}
            paperId={graph.meta.paper_id}
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
            nodes={firstNodes ?? []}
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
