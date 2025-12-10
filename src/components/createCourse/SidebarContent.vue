<script setup lang="ts">
//import { onMounted } from 'vue';
//import { getAllCoursePagesByCourseId } from '@/services/courseService.ts';
import { useRouter } from 'vue-router';
import { useCourseEditorStore } from '@/stores/courseEditorStore.ts';
import {computed} from 'vue';

const router = useRouter();
const editorStore = useCourseEditorStore();

const routeToContent = (pageId: string) => {
	router.push({ name: 'courseEditorPage', params: { page_id: pageId } });
};

const routeToDetails = () => {
	router.push({ name: 'courseEditorFrontpage' });
};
</script>

<template>
	<div class="flex-col border-2 border-yellow-500">
		<p @click="routeToDetails()" class="hover:text-amber-600 cursor-pointer">Forside</p>
		<p
			v-for="coursePage in editorStore.listOfCoursePages"
			:key="coursePage.course_page_id"
			@click="routeToContent(coursePage.course_page_id)"
			class="hover:text-amber-600 cursor-pointer">
			{{ coursePage.course_page_title }}
		</p>
	</div>
</template>
