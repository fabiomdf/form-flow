<script setup lang="ts">
import HierarchyTree from '@/components/HierarchyTree/HierarchyTree.vue'
import type { FlowData } from '@/components/HierarchyTree/types/flow'

// JSON representation of the flow
const initialFlowData: FlowData = {
  boxes: [
    { id: 'parent', label: 'Parent', position: { x: 200, y: 100 } },
    { id: 'child1', label: 'Child 1', position: { x: 100, y: 250 } },
    { id: 'child2', label: 'Child 2', position: { x: 300, y: 250 } },
    { id: 'child11', label: 'Child 1.1', position: { x: 50, y: 400 } },
    { id: 'child12', label: 'Child 1.2', position: { x: 250, y: 400 } }
  ],
  connections: [
    { start: 'parent', end: 'child1' },
    { start: 'parent', end: 'child2' },
    { start: 'child1', end: 'child11' },
    { start: 'child1', end: 'child12' }
  ]
}
</script>

<template>
  <HierarchyTree :initial-data="initialFlowData" />
</template>
