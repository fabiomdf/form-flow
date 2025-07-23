<script setup lang="ts">
import HierarchyTree, { type FlowData } from '@/components/HierarchyTree'

// JSON representation of the flow
const initialFlowData: FlowData = {
  boxes: [
    { id: 'parent', label: 'Parent', position: { x: 200, y: 100 } }
  ],
  connections: [
    { start: 'parent', end: 'child1' }
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
    :enable-collision-avoidance="true"
    :enable-console-log="false"
    box-background-color="#2c3e50"
    box-label-color="#ecf0f1"
    edit-field-border-color="#FFFFFF"
    edit-field-background-color="rgba(255, 255, 255, 0.10)"
    add-button-background-color="#27ae60"
    add-button-border-color="#ffffff"
    add-button-content="+"
    :add-button-size="32"
    add-button-shape="circle"
    remove-button-background-color="#e74c3c"
    remove-button-border-color="#ffffff"
    remove-button-content="✕"
    :remove-button-size="32"
    remove-button-shape="square"
  />
</template>
