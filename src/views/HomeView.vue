<script setup lang="ts">
import { ref } from 'vue'
import HierarchyTree, { type FlowData } from '@/components/HierarchyTree'

// Template ref for HierarchyTree component
const hierarchyTreeRef = ref<InstanceType<typeof HierarchyTree>>()

// JSON representation of the flow
const initialFlowData: FlowData = {
  boxes: [
    { id: 'parent', label: 'Parent', position: { x: 200, y: 100 } }
  ],
  connections: [
    { start: 'parent', end: 'child1' }
  ]
}

// Function to print current FlowData to console
const printFlowData = () => {
  if (hierarchyTreeRef.value) {
    const currentFlowData = hierarchyTreeRef.value.flowData
    console.log('Current FlowData:', JSON.stringify(currentFlowData, null, 2))
  } else {
    console.log('HierarchyTree component not available')
  }
}
</script>

<template>
  <div style="padding: 20px;">
    <!-- Button to print FlowData -->
    <button
      @click="printFlowData"
      style="
        margin-bottom: 20px;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
      "
    >
      Print FlowData to Console
    </button>

    <HierarchyTree
      ref="hierarchyTreeRef"
      :initial-data="initialFlowData"
      :show-add-button="true"
      :show-remove-button="true"
      :allow-label-edit="true"
      :box-width="200"
      :box-height="120"
      :enable-shadow="true"
      :enable-collision-avoidance="true"
      :enable-console-log="false"
      :highlight-selected-box="true"
      :show-buttons-only-on-selected="true"
      selected-box-border-color="#ff6b6b"
      :selected-box-border-width="4"
      box-background-color="#2c3e50"
      box-label-color="#ecf0f1"
      edit-field-border-color="#FFFFFF"
      edit-field-background-color="rgba(255, 255, 255, 0.10)"
      edit-field-text-color="#ffffff"
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
  </div>
</template>
