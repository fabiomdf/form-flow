<script setup lang="ts">
import { ref, defineExpose } from 'vue'
import AddNewDraggableBox from './AddNewDraggableBox.vue'

interface Position {
    x: number
    y: number
}

const props = defineProps<{
    initialPosition?: Position
    id: string
    label: string
}>()

const emit = defineEmits<{
  addChild: [parentId: string]
  updateLabel: [id: string, newLabel: string]
  updatePosition: [id: string, position: Position]
}>()

const position = ref<Position>(props.initialPosition || { x: 100, y: 100 })
const dragging = ref(false)
const offset = ref<Position>({ x: 0, y: 0 })
const boxRef = ref<HTMLElement | null>(null)
const isEditing = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const tempLabel = ref(props.label)

const startDrag = (event: MouseEvent) => {
    // Don't start dragging if we're editing
    if (isEditing.value) return

    dragging.value = true
    offset.value = {
        x: event.clientX - position.value.x,
        y: event.clientY - position.value.y,
    }

    window.addEventListener('mousemove', onDrag)
    window.addEventListener('mouseup', stopDrag)
}

const onDrag = (event: MouseEvent) => {
    if (!dragging.value) return
    position.value = {
        x: event.clientX - offset.value.x,
        y: event.clientY - offset.value.y,
    }
}

const stopDrag = () => {
    dragging.value = false
    window.removeEventListener('mousemove', onDrag)
    window.removeEventListener('mouseup', stopDrag)
    
    // Emit position update when dragging stops
    emit('updatePosition', props.id, position.value)
}

const handleAddChild = (parentId: string) => {
  emit('addChild', parentId)
}

const startEditing = (event: MouseEvent) => {
  // Prevent drag when double-clicking to edit
  event.stopPropagation()
  isEditing.value = true
  tempLabel.value = props.label

  // Focus the input after Vue updates the DOM
  setTimeout(() => {
    if (inputRef.value) {
      inputRef.value.focus()
      inputRef.value.select()
    }
  }, 0)
}

const saveLabel = () => {
  if (tempLabel.value.trim() !== props.label) {
    emit('updateLabel', props.id, tempLabel.value.trim())
  }
  isEditing.value = false
}

const cancelEditing = () => {
  tempLabel.value = props.label
  isEditing.value = false
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    saveLabel()
  } else if (event.key === 'Escape') {
    cancelEditing()
  }
}

const handleInputClick = (event: MouseEvent) => {
  // Prevent the box from being dragged when clicking on the input
  event.stopPropagation()
}

defineExpose({ boxRef })
</script>

<template>
    <div class="draggable-box" :style="{ top: position.y + 'px', left: position.x + 'px' }" @mousedown="startDrag"
        ref="boxRef" @dblclick="startEditing">
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
          :parent-id="id"
          @add-child="handleAddChild"
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
