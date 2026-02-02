import { CurriculumEdge, CurriculumNode } from "@/lib/types";
import { useMemo } from "react";

interface NodePosition {
  x: number;
  y: number;
}

interface GraphLayoutResult {
  positions: Record<string, NodePosition>;
  sortedNodeIds: string[];
}

/**
 * edge 정보 기반으로 노드 레이어를 계산하고
 * 좌표를 배치하는 훅
 */
export function useGraphLayout(
  nodes: CurriculumNode[],
  edges: CurriculumEdge[],
  startNodeIds: string[], // layer1 기준 노드
  paperId: string // 무조건 마지막 레이어에 위치할 노드 ID
): GraphLayoutResult {
  return useMemo(() => {
    // 1️⃣ Adjacency List (Undirected for BFS from startNodeId)
    // startNodeId를 기준으로 퍼져나가는 형태를 만들기 위해 무방향 그래프로 간주하고 탐색합니다.
    const adjacency: Record<string, string[]> = {};
    nodes.forEach(n => {
      adjacency[n.keyword_id] = [];
    });

    edges.forEach(e => {
      if (adjacency[e.start] && adjacency[e.end]) {
        adjacency[e.start].push(e.end);
        adjacency[e.end].push(e.start);
      }
    });

    // 2️⃣ BFS Layering
    const layers: string[][] = [];
    const visited = new Set<string>();
    const queue: { id: string; depth: number }[] = [];

    // Start node handling
    const startNodes = nodes.filter(
      n => startNodeIds.includes(n.keyword_id) && n.keyword_id !== paperId
    );

    if (startNodes.length > 0) {
      startNodes.forEach(n => {
        queue.push({ id: n.keyword_id, depth: 0 });
        visited.add(n.keyword_id);
      });
    } else if (nodes.length > 0) {
      const startNode = nodes.find(n => n.keyword_id !== paperId) || nodes[0];
      queue.push({ id: startNode.keyword_id, depth: 0 });
      visited.add(startNode.keyword_id);
    }

    while (queue.length > 0) {
      const { id, depth } = queue.shift()!;

      if (!layers[depth]) layers[depth] = [];
      layers[depth].push(id);

      const neighbors = adjacency[id] || [];
      neighbors.forEach(nextId => {
        if (nextId === paperId) return; // paperId는 탐색 경로에서 제외
        if (!visited.has(nextId)) {
          visited.add(nextId);
          queue.push({ id: nextId, depth: depth + 1 });
        }
      });
    }

    // Handle disconnected nodes (if any)
    const unvisited = nodes.filter(
      n => !visited.has(n.keyword_id) && n.keyword_id !== paperId
    );
    if (unvisited.length > 0) {
      const nextLayer = layers.length;
      layers[nextLayer] = unvisited.map(n => n.keyword_id);
    }

    // Force paperId to be the last layer
    const paperNode = nodes.find(n => n.keyword_id === paperId);
    if (paperNode) {
      layers.push([paperId]);
    }

    // 3️⃣ Position Calculation (Gap based)
    const height = 600;
    const paddingX = 50;
    const paddingY = 50;
    const xGap = 600; // 가로 간격
    const yGap = 300; // 세로 간격

    const positions: Record<string, NodePosition> = {};

    // 전체 그래프의 높이를 계산하여 수직 중앙 정렬
    const maxNodesInLayer = Math.max(...layers.map(l => l.length));
    const totalHeight = maxNodesInLayer * yGap;

    layers.forEach((layer, layerIdx) => {
      const x = paddingX + layerIdx * xGap;
      const layerHeight = layer.length * yGap;
      // 해당 레이어를 전체 높이 기준 중앙에 배치
      const startY = paddingY + (totalHeight - layerHeight) / 2;

      layer.forEach((nodeId, nodeIdx) => {
        // const y =
        //   layer.length === 1
        //     ? height / 2
        //     : paddingY +
        //       ((height - paddingY * 2) * nodeIdx) /
        //         Math.max(layer.length - 1, 1);
        const y = startY + nodeIdx * yGap;

        positions[nodeId] = { x, y };
      });
    });

    // 4️⃣ Flatten for sorted IDs
    const sortedNodeIds = layers.flat();

    return { positions, sortedNodeIds };
  }, [nodes, edges, startNodeIds, paperId]);
}
