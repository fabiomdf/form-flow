<script setup lang="ts">
interface Props {
  parentId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  addChild: [parentId: string]
}>()

const handleAddChild = (event: MouseEvent) => {
  // Prevent the drag event from the parent box
  event.stopPropagation()
  emit('addChild', props.parentId)
}
</script>

<template>
  <button
    class="add-button"
    @mousedown="handleAddChild"
    title="Add Child Box"
  >
    +
  </button>
</template>

<style scoped>
.add-button {
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #4CAF50;
  color: white;
  border: 2px solid white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  z-index: 20;
}

.add-button:hover {
  background-color: #45a049;
  transform: translateX(-50%) scale(1.1);
}

.add-button:active {
  transform: translateX(-50%) scale(0.95);
}
</style>
