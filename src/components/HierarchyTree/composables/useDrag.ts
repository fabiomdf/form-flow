import { ref } from 'vue'
import type { Position } from '@/components/HierarchyTree/types/flow'

export function useDrag(
  initialPosition: Position,
  onDragEnd: (position: Position) => void
) {
  const position = ref<Position>(initialPosition)
  const dragging = ref(false)
  const offset = ref<Position>({ x: 0, y: 0 })

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
    onDragEnd(position.value)
  }

  return {
    position,
    dragging,
    startDrag
  }
}
