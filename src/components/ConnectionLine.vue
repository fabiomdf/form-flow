<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
    start: any
    end: any
}>()

const startPoint = ref<{ x: number; y: number } | null>(null)
const endPoint = ref<{ x: number; y: number } | null>(null)

const updatePositions = () => {
    if (props.start?.boxRef && props.end?.boxRef) {
        const startRect = props.start.boxRef.getBoundingClientRect()
        const endRect = props.end.boxRef.getBoundingClientRect()

        startPoint.value = {
            x: startRect.left + startRect.width / 2,
            y: startRect.top + startRect.height / 2,
        }

        endPoint.value = {
            x: endRect.left + endRect.width / 2,
            y: endRect.top + endRect.height / 2,
        }
    }

    requestAnimationFrame(updatePositions)
}

onMounted(() => {
    updatePositions()
})
</script>

<template>
    <svg class="connection-line">
        <line v-if="startPoint && endPoint" :x1="startPoint.x" :y1="startPoint.y" :x2="endPoint.x" :y2="endPoint.y"
            stroke="black" stroke-width="2" />
    </svg>
</template>

<style scoped>
.connection-line {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 1;
}
</style>
