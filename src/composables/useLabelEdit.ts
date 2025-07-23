import { ref, nextTick } from 'vue'

export function useLabelEdit(
  initialLabel: string,
  onSave: (newLabel: string) => void
) {
  const isEditing = ref(false)
  const tempLabel = ref(initialLabel)
  const inputRef = ref<HTMLInputElement | null>(null)

  const startEditing = async () => {
    isEditing.value = true
    tempLabel.value = initialLabel

    await nextTick()
    if (inputRef.value) {
      inputRef.value.focus()
      inputRef.value.select()
    }
  }

  const saveLabel = () => {
    const trimmedLabel = tempLabel.value.trim()
    if (trimmedLabel !== initialLabel && trimmedLabel !== '') {
      onSave(trimmedLabel)
    }
    isEditing.value = false
  }

  const cancelEditing = () => {
    tempLabel.value = initialLabel
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
