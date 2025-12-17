<script setup lang="ts">
import { useCourseEditorStore } from '@/stores/courseEditorStore.ts';
import { computed } from 'vue';

const editorStore = useCourseEditorStore();

const canSave = computed(() => {
	return editorStore.courseHasAnyUnsavedChanges;
});
</script>

<template>
	<div class="flex gap-8 border-2 border-blue-500">
		<p class="disabled">Forhåndsvisning</p>
		<p :class="{ disabled: !canSave }">Gem</p>
		<p>Gem og udgiv</p>
	</div>
</template>

<style scoped>
p {
	cursor: pointer;
}

.disabled {
	opacity: 0.7;
	cursor: not-allowed;
}
</style>
