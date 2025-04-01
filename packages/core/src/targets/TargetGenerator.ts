import { NodeTree } from '../process/testableNodeTree'
import { EstridiGeneratorOptions } from '../index'

export type TargetGenerator = (
  nodeTree: NodeTree,
  options?: EstridiGeneratorOptions,
) => Promise<string>
