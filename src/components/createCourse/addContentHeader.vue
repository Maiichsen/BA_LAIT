<script setup lang="ts">
import {useRouter} from 'vue-router';
import { useCourseEditorStore } from '@/stores/courseEditorStore.ts';

const router = useRouter();
const courseStore = useCourseEditorStore();

const handleCreateNewContentPage = () => {
	courseStore.addNewCoursePage().then(coursePage => {
		router.push({name: 'courseEditorPage', params: {page_id: coursePage.course_page_id}});
	}).catch(err => console.log(err));
};
</script>

<template>
	<div class="flex gap-8 border-2 border-red-500">
		<p @click="handleCreateNewContentPage" class="cursor-pointer">tilføj indhold</p>
		<p>tilføj quiz</p>
		<p>tilføj slut-test</p>
	</div>
</template>
