import type { App } from 'vue'
import HierarchyTreeComponent from './components/HierarchyTree/HierarchyTree.vue'

// Export the component (named export)
export { default as HierarchyTree } from './components/HierarchyTree/HierarchyTree.vue'

// Export all types
export type {
  FlowData,
  BoxData,
  ConnectionData,
  Position,
  BoxSize,
  BoxElement,
  HierarchyTreeProps
} from './components/HierarchyTree/types/flow'

// Export composables
export { useLabelEdit } from './components/HierarchyTree/composables/useLabelEdit'
export { useDrag } from './components/HierarchyTree/composables/useDrag'
export { useFlowData } from './components/HierarchyTree/composables/useFlowData'

// Plugin install function
export function install(app: App) {
  app.component('HierarchyTree', HierarchyTreeComponent)
}

// Default export for plugin (também exporta o componente)
const plugin = {
  install,
  HierarchyTree: HierarchyTreeComponent
}

export default plugin
