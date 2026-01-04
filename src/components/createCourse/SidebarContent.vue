<script setup lang="ts">
import { useCourseEditorStore } from '@/stores/courseEditorStore.ts';
import { CoursePageType } from '@/constants/courseConstants.ts';
import type { CoursePage } from '@/types/db.ts';
import {
	ContentIcon,
	EyeIcon,
	EyeOffIcon,
	PencilIcon,
	QuizIcon,
} from '@/assets/icons';

const editorStore = useCourseEditorStore();

const getPageTypeFromPage = (page: CoursePage): CoursePageType => {
	return editorStore.coursePageContent[page.course_page_id]?.contentType ?? CoursePageType.unknown;
};

const pageTypeIsQuiz = (page: CoursePage): boolean => {
	return getPageTypeFromPage(page) === CoursePageType.quiz;
};

const pageTypeIsArticle = (page: CoursePage): boolean => {
	return getPageTypeFromPage(page) === CoursePageType.article;
};

const pageIsVisible = (page: CoursePage): boolean => {
	return !page.is_visible;
};

const pageHasUnsavedChanges = (page: CoursePage): boolean => {
	return editorStore.coursePageContent[page.course_page_id]?.hasUnsavedData ?? false;
};

const setVisibility = (page: CoursePage, pageToVisible: boolean) => {
	editorStore.setPageVisibility(page.course_page_id, pageToVisible);
};
</script>

<template>
	<div class="border border-tutara-200 bg-white overflow-y-auto h-full">
		<h3 class="text-c1 p-4 pr-10">Kursusindhold</h3>
		<RouterLink
			:to="`/opret-kursus/${editorStore.currentEditedCourseId}`"
			class="flex gap-2 hover:bg-purple-10 p-4 pl-9"
			exact-active-class="bg-purple-10"
		>
			<ContentIcon class="w-5" />
			<p class="text-h8">Forside</p>
		</RouterLink
		>
		<RouterLink
			v-for="page in editorStore.listOfCoursePages"
			:key="page.course_page_id"
			:to="`/opret-kursus/${editorStore.currentEditedCourseId}/${page.course_page_id}`"
			class="text-h8 flex justify-between hover:bg-purple-10 group p-4 pl-2"
			exact-active-class="bg-purple-10"
		>
			<span class="flex gap-2">
				<EyeIcon v-if="!pageIsVisible(page)" class="opacity-0 group-hover:opacity-100 w-5" @click="setVisibility(page, false)" />
				<EyeOffIcon v-if="pageIsVisible(page)" class="w-5" @click="setVisibility(page, true)" />
				<QuizIcon v-if="pageTypeIsQuiz(page)" class="w-5" />
				<ContentIcon v-if="pageTypeIsArticle(page)" class="w-5" />
				<span class="text-h8" :class="{ 'italic opacity-70 before:content-[\'*\'] before:mr-1': pageHasUnsavedChanges(page) }">
					{{ page.course_page_title }}
				</span>
			</span>
			<PencilIcon class="opacity-0 group-hover:opacity-100"/>
		</RouterLink>
		<span class="block h-5"></span>
	</div>
</template>
