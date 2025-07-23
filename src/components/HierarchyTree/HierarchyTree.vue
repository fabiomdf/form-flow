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
}>(), {
  showAddButton: true,
  showRemoveButton: true,
  allowLabelEdit: true,
  boxWidth: 150,
  boxHeight: 100,
  enableShadow: true
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
  setBoxRef,
  addChildBox,
  updateBoxLabel,
  updateBoxPosition,
  removeBox,
  validConnections
} = useFlowData(props.initialData)
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
    @add-child="addChildBox"
    @update-label="updateBoxLabel"
    @update-position="updateBoxPosition"
    @remove-box="removeBox"
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
