<script setup lang="ts">
import HierarchyTree, { type FlowData } from '@/components/HierarchyTree'

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
  <HierarchyTree
    :initial-data="initialFlowData"
    :show-add-button="true"
    :show-remove-button="true"
    :allow-label-edit="true"
    :box-width="200"
    :box-height="120"
    :enable-shadow="true"
    box-background-color="#2c3e50"
    box-label-color="#ecf0f1"
    edit-field-border-color="#FFFFFF"
    edit-field-background-color="rgba(255, 255, 255, 0.10)"
    add-button-background-color="#27ae60"
    add-button-border-color="#ffffff"
    add-button-content="+"
    :add-button-size="31"
    add-button-shape="circle"
    remove-button-background-color="#e74c3c"
    remove-button-border-color="#ffffff"
    remove-button-content="✕"
    :remove-button-size="32"
    remove-button-shape="square"
  />
</template>
