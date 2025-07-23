import HierarchyTree from './HierarchyTree.vue'

// Export the default component
export { default } from './HierarchyTree.vue'

// Export all types that might be needed by consumers
export type {
  FlowData,
  BoxData,
  ConnectionData,
  Position,
  BoxElement,
  HierarchyTreeProps
} from './types/flow'// Also export the component explicitly for named imports if needed
export { HierarchyTree }
