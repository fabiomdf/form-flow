import { reactive, ref, computed } from 'vue'
import type { FlowData, BoxData, BoxElement, Position } from '@/components/HierarchyTree/types/flow'

interface FlowDataOptions {
  boxWidth: number
  boxHeight: number
  enableCollisionAvoidance: boolean
  enableConsoleLog: boolean
  highlightSelectedBox: boolean
}

export function useFlowData(initialData: FlowData, options: FlowDataOptions) {
  // Make flowData reactive by copying the initial data
  const flowData: FlowData = reactive({
    boxes: [...initialData.boxes],
    connections: [...initialData.connections]
  })

  // Store references to box components
  const boxRefs = reactive<Record<string, BoxElement>>({})
  const nextId = ref(1)

  // Selection state
  const selectedBoxId = ref<string | null>(null)

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

  // Function to check if two boxes collide
  const checkCollision = (pos1: Position, pos2: Position): boolean => {
    const buffer = 20 // Buffer space between boxes
    return Math.abs(pos1.x - pos2.x) < options.boxWidth + buffer &&
           Math.abs(pos1.y - pos2.y) < options.boxHeight + buffer
  }

  // Function to find a position without collision
  const findPositionWithoutCollision = (basePosition: Position): Position => {
    if (!options.enableCollisionAvoidance) {
      return basePosition
    }

    let position = { ...basePosition }
    let attempts = 0
    const maxAttempts = 50
    const step = 50

    while (attempts < maxAttempts) {
      const hasCollision = flowData.boxes.some(box =>
        checkCollision(position, box.position)
      )

      if (!hasCollision) {
        return position
      }

      // Try different positions in a spiral pattern
      const angle = (attempts * 45) % 360
      const radius = Math.floor(attempts / 8) * step + step

      position = {
        x: basePosition.x + Math.cos(angle * Math.PI / 180) * radius,
        y: basePosition.y + Math.sin(angle * Math.PI / 180) * radius
      }

      attempts++
    }

    return position // Return last position if no collision-free spot found
  }

  // Function to calculate position for new child box
  const calculateChildPosition = (parentId: string): Position => {
    const parent = flowData.boxes.find(box => box.id === parentId)
    if (!parent) return { x: 100, y: 100 }

    const childrenCount = flowData.connections.filter(conn => conn.start === parentId).length
    const basePosition = {
      x: parent.position.x + (childrenCount * 180) - 90,
      y: parent.position.y + 150
    }

    return findPositionWithoutCollision(basePosition)
  }

  // Function to get all descendant box IDs recursively
  const getAllDescendants = (boxId: string): string[] => {
    const descendants: string[] = []
    const directChildren = flowData.connections
      .filter(conn => conn.start === boxId)
      .map(conn => conn.end)

    for (const childId of directChildren) {
      descendants.push(childId)
      descendants.push(...getAllDescendants(childId))
    }

    return descendants
  }

  // Function to add new child box
  const addChildBox = (parentId: string) => {
    const newId = generateId()
    const position = calculateChildPosition(parentId)

    const newBox: BoxData = {
      id: newId,
      label: `Child ${newId}`,
      position: position
    }

    flowData.boxes.push(newBox)
    flowData.connections.push({ start: parentId, end: newId })

    logFlowData('Child added')
  }

  // Function to update box label
  const updateBoxLabel = (boxId: string, newLabel: string) => {
    const box = flowData.boxes.find(box => box.id === boxId)
    if (box) {
      box.label = newLabel
      logFlowData('Label updated')
    }
  }

  // Function to update box position
  const updateBoxPosition = (boxId: string, newPosition: { x: number; y: number }) => {
    const box = flowData.boxes.find(box => box.id === boxId)
    if (box) {
      box.position = newPosition
      logFlowData('Position updated')
    }
  }

  // Function to remove box and all its descendants
  const removeBox = (boxId: string) => {
    const descendantsToRemove = getAllDescendants(boxId)
    const allBoxesToRemove = [boxId, ...descendantsToRemove]

    flowData.connections = flowData.connections.filter(connection =>
      !allBoxesToRemove.includes(connection.start) &&
      !allBoxesToRemove.includes(connection.end)
    )

    flowData.boxes = flowData.boxes.filter(box =>
      !allBoxesToRemove.includes(box.id)
    )

    allBoxesToRemove.forEach(id => {
      delete boxRefs[id]
    })

    logFlowData('Box removed')
  }

  // Helper function to log flow data
  const logFlowData = (action: string) => {
    if (options.enableConsoleLog) {
      console.log(`${action} - FlowData:`, JSON.stringify(flowData, null, 2))
    }
  }

  // Function to select a box
  const selectBox = (boxId: string | null) => {
    selectedBoxId.value = boxId
  }

  // Computed property for valid connections
  const validConnections = computed(() => {
    return flowData.connections.filter(connection =>
      boxRefs[connection.start] && boxRefs[connection.end]
    )
  })

  return {
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
  }
}
