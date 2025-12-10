<script setup lang="ts">
import { useCourseEditorStore } from '@/stores/courseEditorStore.ts';

const courseStore = useCourseEditorStore();

const handleCreateNewContentPage = async () => {
	courseStore.addNewCoursePage();
};
</script>

<template>
	<div class="flex gap-8 border-2 border-red-500">
		<p @click="handleCreateNewContentPage" class="cursor-pointer">tilføj indhold</p>
		<p>tilføj quiz</p>
		<p>tilføj slut-test</p>
	</div>
</template>
