<script setup lang="ts">
import DraggableBox from './components/DraggableBox.vue'
import ConnectionLine from './components/ConnectionLine.vue'
import { useFlowData } from '@/components/HierarchyTree/composables/useFlowData'
import type { FlowData } from '@/components/HierarchyTree/types/flow'

const props = withDefaults(defineProps<{
  initialData: FlowData
  showAddButton?: boolean
  showRemoveButton?: boolean
  allowLabelEdit?: boolean
  boxWidth?: number
  boxHeight?: number
  enableShadow?: boolean
  boxBackgroundColor?: string
  boxLabelColor?: string
  editFieldBorderColor?: string
  editFieldBackgroundColor?: string
  addButtonBackgroundColor?: string
  addButtonBorderColor?: string
  addButtonContent?: string
  addButtonSize?: number
  addButtonShape?: 'circle' | 'square' | 'rounded'
  removeButtonBackgroundColor?: string
  removeButtonBorderColor?: string
  removeButtonContent?: string
  removeButtonSize?: number
  removeButtonShape?: 'circle' | 'square' | 'rounded'
  enableCollisionAvoidance?: boolean
  enableConsoleLog?: boolean
  highlightSelectedBox?: boolean
  selectedBoxBorderColor?: string
  selectedBoxBorderWidth?: number
}>(), {
  showAddButton: true,
  showRemoveButton: true,
  allowLabelEdit: true,
  boxWidth: 150,
  boxHeight: 100,
  enableShadow: true,
  boxBackgroundColor: '#42b983',
  boxLabelColor: 'white',
  editFieldBorderColor: '#4CAF50',
  editFieldBackgroundColor: 'rgba(255, 255, 255, 0.9)',
  addButtonBackgroundColor: '#4CAF50',
  addButtonBorderColor: 'white',
  addButtonContent: '+',
  addButtonSize: 30,
  addButtonShape: 'circle',
  removeButtonBackgroundColor: '#f44336',
  removeButtonBorderColor: 'white',
  removeButtonContent: '×',
  removeButtonSize: 30,
  removeButtonShape: 'circle',
  enableCollisionAvoidance: true,
  enableConsoleLog: false,
  highlightSelectedBox: true,
  selectedBoxBorderColor: '#ffd700',
  selectedBoxBorderWidth: 3
})

import type { BoxData } from '@/components/HierarchyTree/types/flow'

// Function to get final box size (individual size or default from props)
const getBoxSize = (box: BoxData) => ({
  width: box.size?.width ?? props.boxWidth,
  height: box.size?.height ?? props.boxHeight
})

const {
  flowData,
  boxRefs,
  selectedBoxId,
  setBoxRef,
  addChildBox,
  updateBoxLabel,
  updateBoxPosition,
  removeBox,
  selectBox,
  validConnections
} = useFlowData(props.initialData, {
  boxWidth: props.boxWidth,
  boxHeight: props.boxHeight,
  enableCollisionAvoidance: props.enableCollisionAvoidance,
  enableConsoleLog: props.enableConsoleLog,
  highlightSelectedBox: props.highlightSelectedBox
})
</script>

<template>
  <!-- Render boxes dynamically -->
  <DraggableBox
    v-for="box in flowData.boxes"
    :key="box.id"
    :ref="(el) => setBoxRef(box.id, el)"
    :id="box.id"
    :label="box.label"
    :initialPosition="box.position"
    :size="getBoxSize(box)"
    :show-add-button="props.showAddButton"
    :show-remove-button="props.showRemoveButton"
    :allow-label-edit="props.allowLabelEdit"
    :enable-shadow="props.enableShadow"
    :box-background-color="props.boxBackgroundColor"
    :box-label-color="props.boxLabelColor"
    :edit-field-border-color="props.editFieldBorderColor"
    :edit-field-background-color="props.editFieldBackgroundColor"
    :add-button-background-color="props.addButtonBackgroundColor"
    :add-button-border-color="props.addButtonBorderColor"
    :add-button-content="props.addButtonContent"
    :add-button-size="props.addButtonSize"
    :add-button-shape="props.addButtonShape"
    :remove-button-background-color="props.removeButtonBackgroundColor"
    :remove-button-border-color="props.removeButtonBorderColor"
    :remove-button-content="props.removeButtonContent"
    :remove-button-size="props.removeButtonSize"
    :remove-button-shape="props.removeButtonShape"
    :is-selected="selectedBoxId === box.id"
    :highlight-selected="props.highlightSelectedBox"
    :selected-border-color="props.selectedBoxBorderColor"
    :selected-border-width="props.selectedBoxBorderWidth"
    @add-child="addChildBox"
    @update-label="updateBoxLabel"
    @update-position="updateBoxPosition"
    @remove-box="removeBox"
    @select-box="selectBox"
  >
  </DraggableBox>

  <!-- Render connections dynamically -->
  <ConnectionLine
    v-for="connection in validConnections"
    :key="`${connection.start}-${connection.end}`"
    :start="boxRefs[connection.start]"
    :end="boxRefs[connection.end]"
  />
</template>

<style scoped>
/* Component-specific styles can be added here if needed */
</style>
