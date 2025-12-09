<script setup lang="ts">
import { createCoursePage } from '@/services/courseService.ts';

interface Props {
	course_id: string;
}

const props = defineProps<Props>();

const handleCreateNewContentPage = () => {
	createCoursePage('Ny side', props.course_id, 10);
};
</script>

<template>
	<div class="flex gap-8 border-2 border-red-500">
		<p @click="handleCreateNewContentPage">tilføj indhold</p>
		<p>tilføj quiz</p>
		<p>tilføj slut-test</p>
	</div>
</template>
