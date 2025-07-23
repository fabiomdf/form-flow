import { ref, nextTick, watch, type Ref } from 'vue'

export function useLabelEdit(
  initialLabel: string | Ref<string>,
  onSave: (newLabel: string) => void
) {
  const labelRef = typeof initialLabel === 'string' ? ref(initialLabel) : initialLabel
  const isEditing = ref(false)
  const tempLabel = ref(labelRef.value)
  const inputRef = ref<HTMLInputElement | null>(null)

  // Watch for changes in the label prop and update tempLabel when not editing
  watch(labelRef, (newLabel) => {
    if (!isEditing.value) {
      tempLabel.value = newLabel
    }
  })

  const startEditing = async () => {
    isEditing.value = true
    tempLabel.value = labelRef.value // Always use the current label value

    await nextTick()
    if (inputRef.value) {
      inputRef.value.focus()
      inputRef.value.select()
    }
  }

  const saveLabel = () => {
    const trimmedLabel = tempLabel.value.trim()
    if (trimmedLabel !== labelRef.value && trimmedLabel !== '') {
      onSave(trimmedLabel)
    }
    isEditing.value = false
  }

  const cancelEditing = () => {
    tempLabel.value = labelRef.value
    isEditing.value = false
  }

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      saveLabel()
    } else if (event.key === 'Escape') {
      cancelEditing()
    }
  }

  return {
    isEditing,
    tempLabel,
    inputRef,
    startEditing,
    saveLabel,
    handleKeydown
  }
}
