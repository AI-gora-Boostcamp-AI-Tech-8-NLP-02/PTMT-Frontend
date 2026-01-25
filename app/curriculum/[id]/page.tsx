"use client";

import { Logo } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dummyCurriculumGraph } from "@/lib/dummy-curriculum";
import { CurriculumNode } from "@/lib/types";
import Link from "next/link";
import { MouseEvent, WheelEvent, useMemo, useRef, useState } from "react";

// ===============================================
// Layout Algorithm (Standard Left-to-Right + Topological Order)
// ===============================================

interface NodePosition {
  x: number;
  y: number;
}

function calculateGraphLayout(
  nodes: CurriculumNode[],
  edges: { from_keyword_id: string; to_keyword_id: string }[]
): { positions: Record<string, NodePosition>; sortedNodeIds: string[] } {
  const outgoing: Record<string, string[]> = {};
  const incoming: Record<string, string[]> = {};

  nodes.forEach(node => {
    outgoing[node.keyword_id] = [];
    incoming[node.keyword_id] = [];
  });

  edges.forEach(edge => {
    if (outgoing[edge.from_keyword_id] && incoming[edge.to_keyword_id]) {
      outgoing[edge.from_keyword_id].push(edge.to_keyword_id);
      incoming[edge.to_keyword_id].push(edge.from_keyword_id);
    }
  });

  // Topological layers
  const layers: string[][] = [];
  const assigned = new Set<string>();
  const remaining = new Set(nodes.map(n => n.keyword_id));

  while (remaining.size > 0) {
    const currentLayer: string[] = [];
    remaining.forEach(nodeId => {
      const hasUnassignedIncoming = incoming[nodeId].some(
        p => !assigned.has(p)
      );
      if (!hasUnassignedIncoming) currentLayer.push(nodeId);
    });

    if (currentLayer.length === 0) {
      currentLayer.push([...remaining][0]);
    }

    layers.push(currentLayer);
    currentLayer.forEach(nodeId => {
      assigned.add(nodeId);
      remaining.delete(nodeId);
    });
  }

  // Flatten logic for topological order
  const sortedNodeIds = layers.flat();

  // Dimensions
  const width = 1200;
  const height = 600;
  const paddingX = 120;
  const paddingY = 100;

  const positions: Record<string, NodePosition> = {};

  layers.forEach((layer, layerIdx) => {
    const x =
      paddingX +
      ((width - paddingX * 2) * layerIdx) / Math.max(layers.length - 1, 1);

    layer.forEach((nodeId, nodeIdx) => {
      const y =
        layer.length === 1
          ? height / 2
          : paddingY +
            ((height - paddingY * 2) * nodeIdx) / Math.max(layer.length - 1, 1);

      positions[nodeId] = { x, y };
    });
  });

  return { positions, sortedNodeIds };
}

// Resource type icons
const resourceTypeIcons: Record<string, string> = {
  paper: "description",
  article: "language",
  video: "play_circle",
  code: "code",
};

// ===============================================
// Main Component
// ===============================================

export default function CurriculumGraphPage() {
  const graph = dummyCurriculumGraph;
  const [selectedNode, setSelectedNode] = useState<CurriculumNode | null>(
    graph.nodes.find(n => n.keyword_id === "node-attention") ||
      graph.nodes[0] ||
      null
  );

  // Zoom & Pan State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement>(null);

  const { positions: nodePositions, sortedNodeIds } = useMemo(
    () => calculateGraphLayout(graph.nodes, graph.edges),
    [graph.nodes, graph.edges]
  );

  // Important nodes for bottom bar (Sorted by Topological Order)
  const importantNodes = useMemo(() => {
    // Create a map for topological order index
    const orderMap = new Map(sortedNodeIds.map((id, index) => [id, index]));

    return graph.nodes
      .filter(n => n.importance >= 7)
      .sort((a, b) => {
        // Sort by topological order (learning sequence)
        const orderA = orderMap.get(a.keyword_id) ?? 999;
        const orderB = orderMap.get(b.keyword_id) ?? 999;
        return orderA - orderB;
      });
  }, [graph.nodes, sortedNodeIds]);

  // Pan Handlers
  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const dx = (e.clientX - dragStart.x) / zoom;
    const dy = (e.clientY - dragStart.y) / zoom;
    setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(z => Math.min(Math.max(z + delta, 0.5), 2));
  };

  // ViewBox Calculation
  const viewBox = useMemo(() => {
    const w = 1200 / zoom;
    const h = 600 / zoom;
    const x = (1200 - w) / 2 - pan.x;
    const y = (600 - h) / 2 - pan.y;
    return `${x} ${y} ${w} ${h}`;
  }, [zoom, pan]);

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
          <Link href='/curriculum/history'>
            <Button
              variant='outline'
              size='sm'
              className='rounded-lg text-xs gap-1.5 h-8'
            >
              <span className='material-symbols-outlined text-base'>
                dashboard
              </span>
              Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className='flex flex-1 overflow-hidden relative'>
        {/* Sidebar - Independent Scroll */}
        <aside className='w-[400px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 h-full shadow-xl shadow-slate-200/50'>
          <div className='flex-1 overflow-y-auto p-6 custom-scrollbar'>
            {selectedNode ? (
              <div className='space-y-8 pb-10'>
                {/* 1. Header Section */}
                <div className='space-y-4'>
                  <div className='inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100'>
                    <span className='w-6 h-6 rounded-md bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm'>
                      {importantNodes.findIndex(
                        n => n.keyword_id === selectedNode.keyword_id
                      ) + 1 || "•"}
                    </span>
                    <span className='text-xs font-bold uppercase tracking-wide'>
                      Current Concept
                    </span>
                  </div>

                  <div>
                    <h2 className='text-2xl font-black text-slate-900 mb-2 leading-tight'>
                      {selectedNode.keyword}
                    </h2>
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
                      className='text-xs font-normal text-slate-500'
                    >
                      {selectedNode.resources.length} items
                    </Badge>
                  </div>

                  <div className='space-y-4'>
                    {selectedNode.resources.map(resource => (
                      <div
                        key={resource.resource_id}
                        className='bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-md transition-all group'
                      >
                        <div className='flex items-start gap-3 mb-3'>
                          <div className='w-10 h-10 rounded-lg bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center shrink-0 transition-colors'>
                            <span className='material-symbols-outlined text-slate-500 group-hover:text-blue-600 text-xl'>
                              {resourceTypeIcons[resource.type] || "article"}
                            </span>
                          </div>
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-center gap-2 mb-1'>
                              <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider'>
                                {resource.type}
                              </span>
                              {resource.is_core && (
                                <span className='text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded'>
                                  CORE
                                </span>
                              )}
                            </div>
                            <h4 className='text-sm font-bold text-slate-800 leading-snug'>
                              {resource.name}
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
                              {resource.study_load_minutes}m
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

                {/* 3. Foundational Context (Bottom) */}
                {selectedNode.resources[0]?.is_core && (
                  <div className='mt-8 pt-6 border-t border-slate-100'>
                    <div className='bg-slate-900 rounded-xl p-5 text-white'>
                      <div className='flex items-center gap-2 mb-3'>
                        <span className='material-symbols-outlined text-amber-400'>
                          lightbulb
                        </span>
                        <span className='font-bold text-sm'>
                          Foundational Origin
                        </span>
                      </div>
                      <p className='text-xs text-slate-300 leading-relaxed mb-4'>
                        This concept serves as a critical building block.
                        Understanding &quot;{selectedNode.keyword}&quot; is essential
                        before proceeding to advanced topics.
                      </p>

                      {selectedNode.resources[0]?.url && (
                        <a
                          href={selectedNode.resources[0].url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center gap-2 text-xs font-medium text-blue-300 hover:text-white transition-colors'
                        >
                          <span className='material-symbols-outlined text-sm'>
                            link
                          </span>
                          <span>Source Material</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center h-full text-slate-400'>
                <span className='material-symbols-outlined text-5xl mb-4 text-slate-200'>
                  ads_click
                </span>
                <p className='text-sm font-medium'>
                  Select a node to view details
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* Graph Area */}
        <section className='flex-1 flex flex-col relative bg-[#f8fafc] overflow-hidden'>
          {/* Zoom Controls */}
          <div className='absolute top-4 right-4 z-10 flex flex-col gap-1 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-100 p-1.5'>
            <button
              onClick={() => setZoom(z => Math.min(z + 0.1, 3))}
              className='w-9 h-9 flex items-center justify-center hover:bg-slate-50 text-slate-600 rounded-lg transition-colors'
            >
              <span className='material-symbols-outlined'>add</span>
            </button>
            <div className='w-full h-px bg-slate-100 my-0.5' />
            <button
              onClick={() => setZoom(z => Math.max(z - 0.1, 0.2))}
              className='w-9 h-9 flex items-center justify-center hover:bg-slate-50 text-slate-600 rounded-lg transition-colors'
            >
              <span className='material-symbols-outlined'>remove</span>
            </button>
            <div className='w-full h-px bg-slate-100 my-0.5' />
            <button
              onClick={() => {
                setZoom(0.8);
                setPan({ x: 0, y: 0 });
              }}
              className='w-9 h-9 flex items-center justify-center hover:bg-slate-50 text-slate-600 rounded-lg transition-colors'
            >
              <span className='material-symbols-outlined text-xl'>
                crop_free
              </span>
            </button>
          </div>

          {/* SVG Graph */}
          <div
            className={`w-full flex-1 relative overflow-hidden ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <svg
              ref={svgRef}
              viewBox={viewBox}
              className='w-full h-full'
              onWheel={handleWheel}
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
                <filter
                  id='soft-shadow'
                  x='-50%'
                  y='-50%'
                  width='200%'
                  height='200%'
                >
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
                {graph.edges.map((edge, idx) => {
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
                {graph.nodes.map(node => {
                  const pos = nodePositions[node.keyword_id];
                  if (!pos) return null;
                  const isSelected =
                    selectedNode?.keyword_id === node.keyword_id;
                  const isImportant = node.importance >= 7;

                  return (
                    <g
                      key={node.keyword_id}
                      className='cursor-pointer transition-opacity duration-200'
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedNode(node);
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
                        fill={isImportant ? "#fff" : "#fff"}
                        stroke={
                          isSelected
                            ? "#2563eb"
                            : isImportant
                              ? "#f59e0b"
                              : "#cbd5e1"
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
                            {resourceTypeIcons[node.resources[0]?.type] ||
                              "psychology"}
                          </span>
                        </div>
                      </foreignObject>

                      {/* Label - Properly Spaced */}
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

          {/* Bottom Bar - Enlarged */}
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
              {importantNodes.map((node, idx) => {
                const isSelected = selectedNode?.keyword_id === node.keyword_id;

                return (
                  <button
                    key={node.keyword_id}
                    onClick={() => {
                      setSelectedNode(node);
                      const pos = nodePositions[node.keyword_id];
                      if (pos) {
                        setPan({
                          x: -(pos.x - 600) * zoom,
                          y: -(pos.y - 300) * zoom,
                        });
                      }
                    }}
                    className={`
                      group flex flex-col items-center gap-3 min-w-[100px] transition-all duration-300
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
                        {resourceTypeIcons[node.resources[0]?.type] ||
                          "psychology"}
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
        </section>
      </div>
    </div>
  );
}
