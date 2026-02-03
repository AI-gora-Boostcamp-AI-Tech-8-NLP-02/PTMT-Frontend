// src/lib/types/flow.ts
import type { Node } from "@xyflow/react";
import { CurriculumNode } from "../lib/types";

export type CurriculumRFNode = Node<
  { curriculum: CurriculumNode },
  "curriculum"
>;
