<script setup lang="ts">
interface Props {
  boxId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  removeBox: [boxId: string]
}>()

const handleRemoveBox = (event: MouseEvent) => {
  // Prevent the drag event from the parent box
  event.stopPropagation()
  emit('removeBox', props.boxId)
}
</script>

<template>
  <button
    class="remove-button"
    @mousedown="handleRemoveBox"
    title="Remove Box"
  >
    ×
  </button>
</template>

<style scoped>
.remove-button {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #f44336;
  color: white;
  border: 2px solid white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  z-index: 20;
}

.remove-button:hover {
  background-color: #d32f2f;
  transform: translateX(-50%) scale(1.1);
}

.remove-button:active {
  transform: translateX(-50%) scale(0.95);
}
</style>
