<script setup lang="ts">
import { useCourseEditorStore } from '@/stores/courseEditorStore.ts';
import { CoursePageType } from '@/constants/courseConstants.ts';
import type { CoursePage } from '@/types/db.ts';

const editorStore = useCourseEditorStore();

const contentTypeIcon = (page: CoursePage): string => {
	const pageType = editorStore.coursePageContent[page.course_page_id]?.contentType ?? CoursePageType.unknown;

	if (pageType === CoursePageType.article) return '[T]';
	if (pageType === CoursePageType.quiz) return '[Q]';
	return '[?]';
};

const pageHasUnsavedChanges = (page: CoursePage): boolean => {
	return editorStore.coursePageContent[page.course_page_id]?.hasUnsavedData ?? false;
};
</script>

<template>
	<div class="flex-col border-2 border-yellow-500">
		<RouterLink :to="`/opret-kursus/${editorStore.currentEditedCourseId}`" class="editor-nav-link"
			><p>Forside</p></RouterLink
		>
		<RouterLink
			v-for="page in editorStore.listOfCoursePages"
			:key="page.course_page_id"
			:to="`/opret-kursus/${editorStore.currentEditedCourseId}/${page.course_page_id}`"
			class="editor-nav-link">
			{{ contentTypeIcon(page) }}
			<span :class="{ unsaved: pageHasUnsavedChanges(page) }">
				{{ page.course_page_title }}
			</span>
		</RouterLink>
	</div>
</template>

<style scoped>
.editor-nav-link {
	/* active color is currently set in base.css */
	display: block;
}

.unsaved {
	font-style: italic;
	opacity: 0.7;
}

.unsaved::before {
	content: '* ';
	position: relative;
}
</style>
