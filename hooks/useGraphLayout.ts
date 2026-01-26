import { useMemo } from "react";
import { CurriculumNode } from "@/lib/types";

interface NodePosition {
  x: number;
  y: number;
}

interface GraphLayoutResult {
  positions: Record<string, NodePosition>;
  sortedNodeIds: string[];
}

/**
 * 그래프 노드들의 레이아웃 위치를 계산하는 훅
 * Topological Order를 기반으로 왼쪽에서 오른쪽으로 배치
 */
export function useGraphLayout(
  nodes: CurriculumNode[],
  edges: { from_keyword_id: string; to_keyword_id: string }[]
): GraphLayoutResult {
  return useMemo(() => {
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
  }, [nodes, edges]);
}
