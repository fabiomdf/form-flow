<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import DraggableBox from '@/components/HierarchyTree/HierarchyTreeParts/DraggableBox.vue'
import ConnectionLine from '@/components/HierarchyTree/HierarchyTreeParts/ConnectionLine.vue'

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

// Function to update box label
const updateBoxLabel = (boxId: string, newLabel: string) => {
  const box = flowData.boxes.find(box => box.id === boxId)
  if (box) {
    box.label = newLabel
    // Print the updated flow data to console
    console.log('Updated FlowData:', JSON.stringify(flowData, null, 2))
  }
}

// Function to update box position
const updateBoxPosition = (boxId: string, newPosition: { x: number; y: number }) => {
  const box = flowData.boxes.find(box => box.id === boxId)
  if (box) {
    box.position = newPosition
    // Print the updated flow data to console
    console.log('Updated FlowData:', JSON.stringify(flowData, null, 2))
  }
}

// Function to get all descendant box IDs recursively
const getAllDescendants = (boxId: string): string[] => {
  const descendants: string[] = []
  const directChildren = flowData.connections
    .filter(conn => conn.start === boxId)
    .map(conn => conn.end)

  for (const childId of directChildren) {
    descendants.push(childId)
    // Recursively get descendants of this child
    descendants.push(...getAllDescendants(childId))
  }

  return descendants
}

// Function to remove box and all its descendants
const removeBox = (boxId: string) => {
  // Get all descendants before removing anything
  const descendantsToRemove = getAllDescendants(boxId)
  const allBoxesToRemove = [boxId, ...descendantsToRemove]

  // Remove all connections involving any of the boxes to be removed
  flowData.connections = flowData.connections.filter(connection =>
    !allBoxesToRemove.includes(connection.start) &&
    !allBoxesToRemove.includes(connection.end)
  )

  // Remove all boxes
  flowData.boxes = flowData.boxes.filter(box =>
    !allBoxesToRemove.includes(box.id)
  )

  // Clean up box references
  allBoxesToRemove.forEach(id => {
    delete boxRefs[id]
  })

  // Print the updated flow data to console
  console.log('Updated FlowData after removal:', JSON.stringify(flowData, null, 2))
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
