<script setup lang="ts">
import { ref, defineExpose, computed, toRef } from 'vue'
import AddNewDraggableBox from './AddNewDraggableBox.vue'
import RemoveDraggableBox from '../components/RemoveDraggableBox.vue'
import { useDrag } from '@/components/HierarchyTree/composables/useDrag'
import { useLabelEdit } from '@/components/HierarchyTree/composables/useLabelEdit'
import type { Position, BoxSize } from '@/components/HierarchyTree/types/flow'

const props = defineProps<{
  initialPosition?: Position
  size?: BoxSize
  id: string
  label: string
  showAddButton?: boolean
  showRemoveButton?: boolean
  allowLabelEdit?: boolean
  enableShadow?: boolean
  boxBackgroundColor?: string
  boxLabelColor?: string
  editFieldBorderColor?: string
  editFieldBackgroundColor?: string
  editFieldTextColor?: string
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
  isSelected?: boolean
  highlightSelected?: boolean
  selectedBorderColor?: string
  selectedBorderWidth?: number
}>()

const emit = defineEmits<{
  addChild: [parentId: string]
  updateLabel: [id: string, newLabel: string]
  updatePosition: [id: string, position: Position]
  removeBox: [boxId: string]
  selectBox: [boxId: string]
}>()

const boxRef = ref<HTMLElement | null>(null)

// Default box dimensions
const DEFAULT_BOX_SIZE = { width: 150, height: 100 }

// Use the size from props or defaults
const boxSize = computed(() => ({
  width: props.size?.width ?? DEFAULT_BOX_SIZE.width,
  height: props.size?.height ?? DEFAULT_BOX_SIZE.height
}))

// Drag functionality
const { position, startDrag } = useDrag(
  props.initialPosition || { x: 100, y: 100 },
  (newPosition) => emit('updatePosition', props.id, newPosition)
)

// Label editing functionality
const { isEditing, tempLabel, inputRef, startEditing, saveLabel, handleKeydown } = useLabelEdit(
  toRef(props, 'label'),
  (newLabel) => emit('updateLabel', props.id, newLabel)
)

// Event handlers
const handleBoxClick = (event: MouseEvent) => {
  // Prevent selection if the target is a button or inside a button
  const target = event.target as HTMLElement
  if (target && (target.tagName === 'BUTTON' || target.closest('button'))) {
    return
  }

  // Always emit selection event, regardless of highlight setting
  emit('selectBox', props.id)
}

const handleDragStart = (event: MouseEvent) => {
  if (!isEditing.value) {
    handleBoxClick(event)
    startDrag(event)
  }
}

const handleDoubleClick = (event: MouseEvent) => {
  event.stopPropagation()

  // Prevent double-click editing if the target is a button or inside a button
  const target = event.target as HTMLElement
  if (target && (target.tagName === 'BUTTON' || target.closest('button'))) {
    return
  }

  if (props.allowLabelEdit) {
    startEditing()
  }
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
    :class="{
      'with-shadow': props.enableShadow,
      'selected': props.isSelected && props.highlightSelected
    }"
    :style="{
      top: position.y + 'px',
      left: position.x + 'px',
      width: boxSize.width + 'px',
      height: boxSize.height + 'px',
      backgroundColor: props.boxBackgroundColor || '#42b983',
      color: props.boxLabelColor || 'white',
      border: props.isSelected && props.highlightSelected
        ? `${props.selectedBorderWidth || 3}px solid ${props.selectedBorderColor || '#ffd700'}`
        : 'none'
    }"
    @mousedown="handleDragStart"
    @dblclick="handleDoubleClick"
    @click="handleBoxClick"
    ref="boxRef"
  >
    <div
      v-if="!isEditing || !props.allowLabelEdit"
      class="box-content"
      :class="{ 'non-editable': !props.allowLabelEdit }"
    >
      {{ props.label }}
    </div>
    <input
      v-else-if="props.allowLabelEdit"
      ref="inputRef"
      v-model="tempLabel"
      class="label-input"
      :style="{
        backgroundColor: props.editFieldBackgroundColor || 'rgba(255, 255, 255, 0.9)',
        borderColor: props.editFieldBorderColor || '#4CAF50',
        color: props.editFieldTextColor || '#333'
      }"
      @keydown="handleKeydown"
      @blur="saveLabel"
      @click="handleInputClick"
    />
    <AddNewDraggableBox
      v-if="props.showAddButton"
      :parent-id="id"
      :background-color="props.addButtonBackgroundColor"
      :border-color="props.addButtonBorderColor"
      :content="props.addButtonContent"
      :size="props.addButtonSize"
      :shape="props.addButtonShape"
      @add-child="handleAddChild"
    />
    <RemoveDraggableBox
      v-if="props.showRemoveButton"
      :box-id="id"
      :background-color="props.removeButtonBackgroundColor"
      :border-color="props.removeButtonBorderColor"
      :content="props.removeButtonContent"
      :size="props.removeButtonSize"
      :shape="props.removeButtonShape"
      @remove-box="handleRemoveBox"
    />
  </div>
</template>

<style scoped>
.draggable-box {
    position: absolute;
    width: 150px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: grab;
    border-radius: 8px;
    user-select: none;
    z-index: 10;
}

.draggable-box.with-shadow {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2),
                0 6px 20px rgba(0, 0, 0, 0.15);
}

.draggable-box.selected {
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.3);
    transform: scale(1.02);
    transition: all 0.2s ease;
}

.draggable-box.selected.with-shadow {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2),
                0 6px 20px rgba(0, 0, 0, 0.15),
                0 0 0 3px rgba(255, 215, 0, 0.3);
}

.box-content {
    text-align: center;
    word-wrap: break-word;
    max-width: 130px;
}

.box-content.non-editable {
    cursor: default;
    opacity: 0.9;
}

.label-input {
    border: 2px solid;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 14px;
    text-align: center;
    width: 120px;
    outline: none;
}

.label-input:focus {
    opacity: 0.9;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}
</style>
