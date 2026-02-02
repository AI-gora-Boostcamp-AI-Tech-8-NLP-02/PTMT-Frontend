"use client";

import type { Edge, Node } from "@xyflow/react";
import {
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";

import { MouseEvent, useEffect, WheelEvent } from "react";
import { CurriculumEdge, CurriculumNode } from "../../../../lib/types";
import CurriculumNodeView from "./GraphNodeView";

interface NodePosition {
  x: number;
  y: number;
}

interface GraphCanvasProps {
  nodes: CurriculumNode[];
  edges: CurriculumEdge[];
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

const nodeTypes = {
  curriculum: CurriculumNodeView,
};

export default function GraphCanvas(props: GraphCanvasProps) {
  const [rfnodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [rfedges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    console.log(props.nodePositions);

    const mappedNodes = props.nodes.map((node, index) => ({
      id: node.keyword_id, // React Flow는 string id 필수
      type: "curriculum", // or "input", "output", custom node
      position: props.nodePositions[node.keyword_id],
      //   position: { x: 0, y: 0 },
      data: {
        label: node.keyword,
        curriculum: node, // 👈 CurriculumNode 통째로 넣기
      },
    }));

    const mappedEdges = props.edges.map((edge, index) => ({
      id: `e-${edge.start}-${edge.end}`, // 🔑 유니크
      source: edge.start,
      target: edge.end,
      type: "default", // or "default", "step", "bezier"
      animated: false,
    }));

    setNodes(mappedNodes);
    setEdges(mappedEdges);
  }, [props.nodes, props.edges, props.nodePositions, setNodes, setEdges]);

  return (
    <div className={`w-full h-full`}>
      <ReactFlow
        className='w-full h-full'
        defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
        nodes={rfnodes}
        edges={rfedges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        attributionPosition='bottom-left'
      >
        <Controls />
        <FitViewOnLoad nodes={rfnodes} />
      </ReactFlow>
    </div>
  );
}

function FitViewOnLoad({ nodes }: { nodes: Node[] }) {
  const reactFlow = useReactFlow();

  useEffect(() => {
    if (nodes.length === 0) return;

    requestAnimationFrame(() => {
      reactFlow.fitView({ padding: 0.2 });
    });
  }, [nodes.length, reactFlow]);

  return null;
}
