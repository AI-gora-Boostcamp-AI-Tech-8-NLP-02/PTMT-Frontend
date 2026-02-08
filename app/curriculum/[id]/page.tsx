"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AuthLoading } from "@/components/auth/AuthLoading";
import { Logo } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useAuthGuard, useGraphLayout } from "@/hooks";
import { curriculumApi } from "@/lib/api";
import { CurriculumGraph, CurriculumNode } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import GraphCanvas from "./_components/GraphCanvas";
import { GraphSidebar } from "./_components/GraphSidebar";
import { MilestoneBar } from "./_components/MilestoneBar";

/**
 * 커리큘럼 그래프 페이지
 *
 * 컴포넌트 구조:
 * - GraphSidebar: 선택된 노드 상세 정보
 * - GraphCanvas: 그래프 SVG 시각화
 * - MilestoneBar: 하단 학습 마일스톤
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

        const paperNode: CurriculumNode = {
          keyword_id: response.meta.paper_id,
          keyword: response.meta.paper_title,
          description: response.meta.summarize,
          importance: 10,
          is_keyword_necessary: true,
          resources: [],
        };

        const nodeMap = new Map(response.nodes.map(n => [n.keyword_id, n]));
        nodeMap.set(paperNode.keyword_id, paperNode);

        const updatedEdges = response.edges.map(edge => {
          const startNode = nodeMap.get(edge.start_keyword_id);
          const endNode = nodeMap.get(edge.end_keyword_id);
          const isNecessary =
            !!startNode?.is_keyword_necessary &&
            !!endNode?.is_keyword_necessary;
          return { ...edge, is_necessary: isNecessary };
        });

        setGraph({
          ...response,
          nodes: [...response.nodes, paperNode],
          edges: updatedEdges,
        });
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
  const [isTutorialOpen, setIsTutorialOpen] = useState(true);

  // 그래프 레이아웃 계산 (커스텀 훅)
  const { positions: nodePositions } = useGraphLayout(
    graph?.nodes ?? [],
    graph?.edges ?? [],
    graph?.meta.paper_id ?? ""
  );

  const firstNodes = useMemo(() => {
    if (!graph?.first_node_order || !graph?.nodes) return [];

    return graph.first_node_order
      .map(id => graph.nodes.find(n => n.keyword_id === id))
      .filter((n): n is CurriculumNode => n !== undefined);
  }, [graph?.nodes, graph?.first_node_order]);

  const coreStudyTimeHours = useMemo(() => {
    if (!graph?.nodes) return 0;
    const totalTime = graph.nodes.reduce((acc, node) => {
      const nodeTotal = node.resources.reduce((resAcc, res) => {
        return res.is_core ? resAcc + (res.study_load_minutes || 0) : resAcc;
      }, 0);
      return acc + nodeTotal;
    }, 0);
    return Math.round(totalTime * 100) / 100;
  }, [graph?.nodes]);

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
              {graph.nodes.length} Key Concepts • 전체 학습 시간:{" "}
              {graph.meta.total_study_time_hours} Hours • 필수 학습 시간:{" "}
              {coreStudyTimeHours} Hours
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
          paper_id={graph.meta.paper_id}
          paper_authors={graph.meta.paper_authors}
        />

        {/* Graph Area */}
        <section className='flex-1 flex flex-col bg-[#f8fafc] min-w-0 relative'>
          {isTutorialOpen && (
            <div className='absolute top-4 left-4 z-20 pointer-events-none'>
              <div className='pointer-events-auto w-70 sm:w-85 rounded-2xl border border-rose-200/70 bg-white/90 shadow-xl shadow-rose-200/40 backdrop-blur px-4 py-3 animate-in fade-in slide-in-from-top-2'>
                <div className='flex items-start justify-between gap-3'>
                  <div className='inline-flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-rose-600 bg-rose-50 border border-rose-100 px-2 py-1 rounded-full'>
                    <span className='material-symbols-outlined text-sm'>
                      tips_and_updates
                    </span>
                    튜토리얼
                  </div>
                  <button
                    type='button'
                    aria-label='튜토리얼 닫기'
                    onClick={() => setIsTutorialOpen(false)}
                    className='text-slate-400 hover:text-slate-700 transition-colors'
                  >
                    <span className='material-symbols-outlined text-base'>
                      close
                    </span>
                  </button>
                </div>
                <p className='mt-3 text-xs text-slate-700 leading-relaxed'>
                  <span className='font-semibold text-rose-600'>빨간색</span>
                  으로 표시된 학습 개념의 경우 해당 논문을 이해를 위해 추천하는
                  학습 개념입니다. 해당 학습 개념을 중점적으로 학습하시길
                  권장드립니다.
                </p>
                <div className='mt-3 flex items-center gap-2 text-[10px] text-slate-400'>
                  <span className='w-2 h-2 rounded-full bg-rose-500' />
                  추천 학습 개념
                </div>
              </div>
            </div>
          )}
          {/* SVG Graph Canvas */}
          <GraphCanvas
            nodes={graph.nodes}
            edges={graph.edges}
            paperId={graph.meta.paper_id}
            nodePositions={nodePositions}
            selectedNodeId={selectedNode?.keyword_id ?? null}
            onNodeSelect={handleNodeSelect}
          />

          {/* Bottom Milestone Bar */}
          <MilestoneBar
            nodes={firstNodes ?? []}
            nodePositions={nodePositions}
            selectedNodeId={selectedNode?.keyword_id ?? null}
            onNodeSelect={handleNodeSelect}
          />
        </section>
      </div>
    </div>
  );
}
