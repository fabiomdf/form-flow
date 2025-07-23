<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import DraggableBox from './DraggableBox.vue'
import ConnectionLine from './ConnectionLine.vue'

interface BoxData {
  id: string
  label: string
  position: { x: number; y: number }
}

interface ConnectionData {
  start: string
  end: string
}

interface FlowData {
  boxes: BoxData[]
  connections: ConnectionData[]
}

interface BoxElement {
  boxRef: HTMLElement
}

const props = defineProps<{
  initialData: FlowData
}>()

// Make flowData reactive by copying the initial data
const flowData: FlowData = reactive({
  boxes: [...props.initialData.boxes],
  connections: [...props.initialData.connections]
})

// Store references to box components
const boxRefs = reactive<Record<string, BoxElement>>({})
const nextId = ref(1)

// Function to set box reference
const setBoxRef = (id: string, el: unknown) => {
  if (el && typeof el === 'object' && 'boxRef' in el) {
    boxRefs[id] = el as BoxElement
  }
}

// Function to generate unique ID
const generateId = (): string => {
  return `box_${Date.now()}_${nextId.value++}`
}

// Function to calculate position for new child box
const calculateChildPosition = (parentId: string): { x: number; y: number } => {
  const parent = flowData.boxes.find(box => box.id === parentId)
  if (!parent) return { x: 100, y: 100 }

  // Count existing children of this parent
  const childrenCount = flowData.connections.filter(conn => conn.start === parentId).length

  // Calculate position based on parent position and children count
  const baseX = parent.position.x + (childrenCount * 180) - 90
  const baseY = parent.position.y + 150

  return { x: baseX, y: baseY }
}

// Function to add new child box
const addChildBox = (parentId: string) => {
  const newId = generateId()
  const position = calculateChildPosition(parentId)

  // Add new box
  const newBox: BoxData = {
    id: newId,
    label: `Child ${newId}`,
    position: position
  }

  flowData.boxes.push(newBox)

  // Add connection from parent to new child
  const newConnection: ConnectionData = {
    start: parentId,
    end: newId
  }

  flowData.connections.push(newConnection)
}

// Computed property for valid connections (both refs exist)
const validConnections = computed(() => {
  return flowData.connections.filter(connection =>
    boxRefs[connection.start] && boxRefs[connection.end]
  )
})
</script>

<template>
  <!-- Render boxes dynamically -->
  <DraggableBox
    v-for="box in flowData.boxes"
    :key="box.id"
    :ref="(el) => setBoxRef(box.id, el)"
    :id="box.id"
    :initialPosition="box.position"
    @add-child="addChildBox"
  >
    {{ box.label }}
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
