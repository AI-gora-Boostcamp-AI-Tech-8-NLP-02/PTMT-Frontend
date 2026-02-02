"use client";

import type { Edge, Node } from "@xyflow/react";
import {
  Controls,
  MarkerType,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";

import { MouseEvent, useEffect, WheelEvent } from "react";
import { CurriculumEdge, CurriculumNode } from "../../../../lib/types";
import CurriculumNodeView from "./GraphNodeView";
import { PaperNodeView } from "./PaperNodeView";

interface NodePosition {
  x: number;
  y: number;
}

interface GraphCanvasProps {
  nodes: CurriculumNode[];
  edges: CurriculumEdge[];
  paperId: string;
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
  paper: PaperNodeView,
};

export default function GraphCanvas(props: GraphCanvasProps) {
  const [rfnodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [rfedges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    console.log(props.nodePositions);

    const mappedNodes = props.nodes.map((node, index) => ({
      id: node.keyword_id,
      type: node.keyword_id === props.paperId ? "paper" : "curriculum", // or "input", "output", custom node
      position: props.nodePositions[node.keyword_id],
      data: {
        label: node.keyword,
        curriculum: node,
      },
      selected: node.keyword_id === props.selectedNodeId,
    }));

    const mappedEdges = props.edges.map((edge, index) => ({
      id: `e-${edge.start}-${edge.end}`,
      source: edge.start,
      target: edge.end,
      type: "default", // or "default", "step", "bezier"
      animated: false,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 16,
        height: 16,
        color: "oklch(70.4% 0.04 256.788)",
      },
    }));

    setNodes(mappedNodes);
    setEdges(mappedEdges);
  }, [
    props.nodes,
    props.edges,
    props.nodePositions,
    props.selectedNodeId,
    setNodes,
    setEdges,
  ]);

  return (
    <div className={`w-full h-full`}>
      <ReactFlow
        className='w-full h-full'
        defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
        nodes={rfnodes}
        edges={rfedges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) =>
          props.onNodeSelect(node.data.curriculum as CurriculumNode)
        }
        nodeTypes={nodeTypes}
        attributionPosition='bottom-left'
      >
        <Controls />
        <FitViewOnLoad nodes={rfnodes} />
        <FocusOnNode selectedNodeId={props.selectedNodeId} />
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

function FocusOnNode({ selectedNodeId }: { selectedNodeId: string | null }) {
  const { setCenter, getZoom, getNode } = useReactFlow();

  useEffect(() => {
    if (!selectedNodeId) return;

    const node = getNode(selectedNodeId);
    if (!node) return;

    const width = node.measured?.width ?? 0;
    const height = node.measured?.height ?? 0;

    const x = node.position.x + width / 2;
    const y = node.position.y + height / 2;

    const zoom = getZoom();

    setCenter(x, y, { zoom, duration: 1000 });
  }, [selectedNodeId, getNode, setCenter, getZoom]);

  return null;
}
