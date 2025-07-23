export interface Position {
  x: number
  y: number
}

export interface BoxData {
  id: string
  label: string
  position: Position
}

export interface ConnectionData {
  start: string
  end: string
}

export interface FlowData {
  boxes: BoxData[]
  connections: ConnectionData[]
}

export interface BoxElement {
  boxRef: HTMLElement
}

export interface HierarchyTreeProps {
  initialData: FlowData
  showAddButton?: boolean
  showRemoveButton?: boolean
  allowLabelEdit?: boolean
}
