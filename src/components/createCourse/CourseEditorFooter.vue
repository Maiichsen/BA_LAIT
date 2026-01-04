<script setup lang="ts">
import { useCourseEditorStore } from '@/stores/courseEditorStore.ts';
import { computed } from 'vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import { EyeIcon } from '@/assets/icons';

const editorStore = useCourseEditorStore();

const canSave = computed(() => {
	return editorStore.courseHasAnyUnsavedChanges;
});
</script>

<template>
	<div class="flex justify-end gap-4 py-2 pr-10 bg-cornflower-blue-10">
		<span class="flex gap-2 p-4" :class="{ disabled: true }">
			<EyeIcon /> Forhåndsvisning
		</span>
		<BaseButton
			variant="stroke"
			:class="{ disabled: !canSave }"
		>
			Gem
		</BaseButton>
		<BaseButton
			variant="primary-tiny"
			:class="{ disabled: !canSave }"
		>
			Gem og udgiv
		</BaseButton>
	</div>
</template>

<style scoped>
/* Temporary, visual only, until button component has disabled property */
.disabled {
	opacity: 0.7;
	cursor: not-allowed;
}
</style>
