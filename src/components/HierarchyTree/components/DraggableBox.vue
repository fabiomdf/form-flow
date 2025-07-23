<script setup lang="ts">
import { ref, defineExpose } from 'vue'
import AddNewDraggableBox from './AddNewDraggableBox.vue'
import RemoveDraggableBox from '../components/RemoveDraggableBox.vue'
import { useDrag } from '@/components/HierarchyTree/composables/useDrag'
import { useLabelEdit } from '@/components/HierarchyTree/composables/useLabelEdit'
import type { Position } from '@/components/HierarchyTree/types/flow'

const props = defineProps<{
  initialPosition?: Position
  id: string
  label: string
  showAddButton?: boolean
  showRemoveButton?: boolean
}>()

const emit = defineEmits<{
  addChild: [parentId: string]
  updateLabel: [id: string, newLabel: string]
  updatePosition: [id: string, position: Position]
  removeBox: [boxId: string]
}>()

const boxRef = ref<HTMLElement | null>(null)

// Drag functionality
const { position, startDrag } = useDrag(
  props.initialPosition || { x: 100, y: 100 },
  (newPosition) => emit('updatePosition', props.id, newPosition)
)

// Label editing functionality
const { isEditing, tempLabel, inputRef, startEditing, saveLabel, handleKeydown } = useLabelEdit(
  props.label,
  (newLabel) => emit('updateLabel', props.id, newLabel)
)

// Event handlers
const handleDragStart = (event: MouseEvent) => {
  if (!isEditing.value) {
    startDrag(event)
  }
}

const handleDoubleClick = (event: MouseEvent) => {
  event.stopPropagation()
  startEditing()
}

const handleInputClick = (event: MouseEvent) => {
  event.stopPropagation()
}

const handleAddChild = (parentId: string) => {
  emit('addChild', parentId)
}

const handleRemoveBox = (boxId: string) => {
  emit('removeBox', boxId)
}

defineExpose({ boxRef })
</script>

<template>
  <div
    class="draggable-box"
    :style="{ top: position.y + 'px', left: position.x + 'px' }"
    @mousedown="handleDragStart"
    @dblclick="handleDoubleClick"
    ref="boxRef"
  >
    <div v-if="!isEditing" class="box-content">
      {{ props.label }}
    </div>
    <input
      v-else
      ref="inputRef"
      v-model="tempLabel"
      class="label-input"
      @keydown="handleKeydown"
      @blur="saveLabel"
      @click="handleInputClick"
    />
    <AddNewDraggableBox
      v-if="props.showAddButton"
      :parent-id="id"
      @add-child="handleAddChild"
    />
    <RemoveDraggableBox
      v-if="props.showRemoveButton"
      :box-id="id"
      @remove-box="handleRemoveBox"
    />
  </div>
</template>

<style scoped>
.draggable-box {
    position: absolute;
    width: 150px;
    height: 100px;
    background-color: #42b983;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: grab;
    border-radius: 8px;
    user-select: none;
    z-index: 10;
}

.box-content {
    text-align: center;
    word-wrap: break-word;
    max-width: 130px;
}

.label-input {
    background: rgba(255, 255, 255, 0.9);
    color: #333;
    border: 2px solid #4CAF50;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 14px;
    text-align: center;
    width: 120px;
    outline: none;
}

.label-input:focus {
    border-color: #45a049;
    box-shadow: 0 0 5px rgba(69, 160, 73, 0.5);
}
</style>
