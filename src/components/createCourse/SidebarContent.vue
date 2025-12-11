<script setup lang="ts">
import {useCourseEditorStore} from '@/stores/courseEditorStore.ts';
import { CoursePageType } from '@/constants/courseConstants.ts';

const editorStore = useCourseEditorStore();

const contentTypeIcon = (pageType: CoursePageType): string => {
	if (pageType === CoursePageType.ARTICLE) return 'A';
	if (pageType === CoursePageType.QUIZ) return 'Q';
	return '?';
};
</script>

<template>
	<div class="flex-col border-2 border-yellow-500">
		<RouterLink
			:to="`/opret-kursus/${editorStore.currentEditedCourseId}`"
			class="editor-nav-link"
		><p>Forside</p></RouterLink>
		<RouterLink
			v-for="coursePage in editorStore.listOfCoursePages"
			:key="coursePage.course_page_id"
			:to="`/opret-kursus/${editorStore.currentEditedCourseId}/${coursePage.course_page_id}`"
			class="editor-nav-link"
		><p>({{contentTypeIcon(editorStore.coursePageContent[coursePage.course_page_id]?.contentType ?? CoursePageType.UNKNOWN)}}) {{ coursePage.course_page_title }}</p></RouterLink>
	</div>
</template>
