import { reactive, ref, computed } from 'vue'
import type { FlowData, BoxData, BoxElement } from '@/components/HierarchyTree/types/flow'

export function useFlowData(initialData: FlowData) {
  // Make flowData reactive by copying the initial data
  const flowData: FlowData = reactive({
    boxes: [...initialData.boxes],
    connections: [...initialData.connections]
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
  const calculateChildPosition = (parentId: string) => {
    const parent = flowData.boxes.find(box => box.id === parentId)
    if (!parent) return { x: 100, y: 100 }

    const childrenCount = flowData.connections.filter(conn => conn.start === parentId).length
    return {
      x: parent.position.x + (childrenCount * 180) - 90,
      y: parent.position.y + 150
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
    console.log(`${action} - FlowData:`, JSON.stringify(flowData, null, 2))
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
    setBoxRef,
    addChildBox,
    updateBoxLabel,
    updateBoxPosition,
    removeBox,
    validConnections
  }
}
