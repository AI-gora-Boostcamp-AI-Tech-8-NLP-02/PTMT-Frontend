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
  paperId: string // 무조건 마지막 레이어에 위치할 노드 ID
): GraphLayoutResult {
  return useMemo(() => {
    if (nodes.length === 0) {
      return { positions: {}, sortedNodeIds: [] };
    }

    // 1️⃣ 방향성 그래프 생성 (Adjacency List & In-Degree)
    const adj: Record<string, string[]> = {};
    const inDegree: Record<string, number> = {};
    const nodeIds = nodes.map(n => n.keyword_id);

    nodeIds.forEach(id => {
      adj[id] = [];
      inDegree[id] = 0;
    });

    edges.forEach(edge => {
      if (adj[edge.start_keyword_id] && adj[edge.end_keyword_id]) {
        adj[edge.start_keyword_id].push(edge.end_keyword_id);
        inDegree[edge.end_keyword_id]++;
      }
    });

    // 2️⃣ 위상 정렬(Topological Sort)을 이용한 레이어링
    const layers: string[][] = [];
    const queue: string[] = [];
    const localInDegree = { ...inDegree };

    // 진입 차수가 0인 노드(선수과목이 없는 노드)를 큐에 추가 (paperId 제외)
    nodeIds.forEach(id => {
      if (localInDegree[id] === 0 && id !== paperId) {
        queue.push(id);
      }
    });

    let currentLayer = 0;
    while (queue.length > 0) {
      layers[currentLayer] = [];
      const levelSize = queue.length;

      for (let i = 0; i < levelSize; i++) {
        const u = queue.shift()!;
        layers[currentLayer].push(u);

        (adj[u] || []).forEach(v => {
          if (v !== paperId) {
            localInDegree[v]--;
            if (localInDegree[v] === 0) {
              queue.push(v);
            }
          }
        });
      }
      currentLayer++;
    }

    // 순환 구조가 있거나 연결되지 않은 노드들 처리
    const remainingNodes = nodeIds.filter(
      id => localInDegree[id] > 0 && id !== paperId
    );
    if (remainingNodes.length > 0) {
      layers.push(remainingNodes);
    }

    // paperId를 항상 마지막 레이어에 위치시키기
    if (nodes.some(n => n.keyword_id === paperId)) {
      // 다른 레이어에 포함되었을 경우 제거
      for (let i = 0; i < layers.length; i++) {
        layers[i] = layers[i].filter(id => id !== paperId);
      }
      layers.push([paperId]);
    }

    // 빈 레이어 제거
    const finalLayers = layers.filter(layer => layer.length > 0);

    // paperId를 기반으로 고정된 시드를 생성하여 랜덤성을 제어
    const createSeedFromString = (str: string): number => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // 32비트 정수로 변환
      }
      return hash;
    };

    const createSeededRandom = (seed: number) => {
      return () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280.0;
      };
    };

    const random = createSeededRandom(createSeedFromString(paperId));

    // 3️⃣ 충돌 방지를 포함한 랜덤 위치 계산
    const positions: Record<string, NodePosition> = {};

    // 노드 크기 설정 (260px + 여유 공간)
    const NODE_WIDTH = 500;
    const NODE_HEIGHT = 320;

    // 레이어 간 간격 및 랜덤 범위
    const LAYER_X_GAP = 800;
    const LAYER_X_JITTER = 600; // 레이어 중심 기준 좌우 랜덤 범위

    const CANVAS_CENTER_Y = 400;

    // 충돌 감지 함수
    const checkCollision = (
      x: number,
      y: number,
      existingPositions: Record<string, NodePosition>
    ) => {
      for (const id in existingPositions) {
        const pos = existingPositions[id];
        const dx = Math.abs(x - pos.x);
        const dy = Math.abs(y - pos.y);
        // 중심 간 거리가 노드 크기보다 작으면 충돌로 간주
        if (dx < NODE_WIDTH && dy < NODE_HEIGHT) {
          return true;
        }
      }
      return false;
    };

    finalLayers.forEach((layer, layerIdx) => {
      // 레이어 내 노드 수에 따라 Y축 분산 범위 동적 계산
      const nodeCount = layer.length;
      const ySpread = Math.max(1000, nodeCount * NODE_HEIGHT * 1.25);

      const layerBaseX = layerIdx * LAYER_X_GAP + 100;

      layer.forEach(nodeId => {
        let bestX = layerBaseX;
        let bestY = CANVAS_CENTER_Y;
        let placed = false;

        // 1. 랜덤 위치 시도 (최대 100회)
        for (let attempt = 0; attempt < 100; attempt++) {
          const xOffset = (random() - 0.5) * LAYER_X_JITTER * 2;
          const yOffset = (random() - 0.5) * ySpread;

          const x = layerBaseX + xOffset;
          const y = CANVAS_CENTER_Y + yOffset;

          if (!checkCollision(x, y, positions)) {
            bestX = x;
            bestY = y;
            placed = true;
            break;
          }
        }

        // 2. 실패 시 그리드 탐색 (Fallback)
        if (!placed) {
          // 중앙에서부터 상하로 벌려가며 빈 공간 탐색
          let found = false;
          const searchLimit = Math.max(20, nodeCount * 2);

          // 레이어 X축 범위 내에서 약간의 변동을 주며 Y축 탐색
          for (let i = 1; i <= searchLimit; i++) {
            // 위아래 번갈아가며 탐색: 0, 1, -1, 2, -2 ...
            const sign = i % 2 === 0 ? 1 : -1;
            const step = Math.ceil(i / 2);

            const y = CANVAS_CENTER_Y + sign * step * (NODE_HEIGHT * 0.8);
            // X축은 레이어 중심에서 약간 랜덤하게
            const x = layerBaseX + (random() - 0.5) * LAYER_X_JITTER;

            if (!checkCollision(x, y, positions)) {
              bestX = x;
              bestY = y;
              found = true;
              break;
            }
          }

          // 그래도 못 찾으면 그냥 겹치더라도 배치 (무한 루프 방지)
          if (!found) {
            bestX = layerBaseX + (random() - 0.5) * 50;
            bestY = CANVAS_CENTER_Y + Object.keys(positions).length * 10; // 살짝 아래로
          }
        }

        positions[nodeId] = { x: bestX, y: bestY };
      });
    });

    // 4️⃣ Flatten for sorted IDs
    const sortedNodeIds = finalLayers.flat();

    return { positions, sortedNodeIds };
  }, [nodes, edges, paperId]);
}
