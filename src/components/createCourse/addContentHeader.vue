<script setup lang="ts">
import {useCourseStore} from '@/stores/courseStore.ts';

interface Props {
	course_id: string;
}

const props = defineProps<Props>();
const courseStore = useCourseStore();

const handleCreateNewContentPage = async () => {
	courseStore.addNewCoursePage(props.course_id);
};
</script>

<template>
	<div class="flex gap-8 border-2 border-red-500">
		<p @click="handleCreateNewContentPage">tilføj indhold</p>
		<p>tilføj quiz</p>
		<p>tilføj slut-test</p>
	</div>
</template>
