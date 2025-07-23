<script setup lang="ts">
import DraggableBox from './components/DraggableBox.vue'
import ConnectionLine from './components/ConnectionLine.vue'
import { useFlowData } from '@/components/HierarchyTree/composables/useFlowData'
import type { FlowData } from '@/components/HierarchyTree/types/flow'

const props = defineProps<{
  initialData: FlowData
}>()

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
