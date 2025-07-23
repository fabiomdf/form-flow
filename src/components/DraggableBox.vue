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
}>()

const emit = defineEmits<{
  addChild: [parentId: string]
}>()

const position = ref<Position>(props.initialPosition || { x: 100, y: 100 })
const dragging = ref(false)
const offset = ref<Position>({ x: 0, y: 0 })
const boxRef = ref<HTMLElement | null>(null)

const startDrag = (event: MouseEvent) => {
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
}

const handleAddChild = (parentId: string) => {
  emit('addChild', parentId)
}

defineExpose({ boxRef })
</script>

<template>
    <div class="draggable-box" :style="{ top: position.y + 'px', left: position.x + 'px' }" @mousedown="startDrag"
        ref="boxRef">
        <slot />
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
</style>
