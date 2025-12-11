<script setup lang="ts">
import {useRouter} from 'vue-router';
import {useCourseEditorStore} from '@/stores/courseEditorStore.ts';
import { CoursePageType } from '@/constants/courseConstants.ts';

const router = useRouter();
const editorStore = useCourseEditorStore();

const routeToContent = (pageId: string) => {
	router.push({name: 'courseEditorPage', params: {page_id: pageId}});
};

const routeToDetails = () => {
	router.push({name: 'courseEditorFrontpage'});
};

const contentTypeIcon = (pageType: CoursePageType): string => {
	if (pageType === CoursePageType.ARTICLE) return 'A';
	if (pageType === CoursePageType.QUIZ) return 'Q';
	return '?';
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
			({{contentTypeIcon(editorStore.coursePageContent[coursePage.course_page_id]?.contentType ?? CoursePageType.UNKNOWN)}}) {{ coursePage.course_page_title }}
		</p>
	</div>
</template>
