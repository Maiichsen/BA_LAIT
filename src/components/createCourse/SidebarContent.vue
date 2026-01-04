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
		<h1>Kursusindhold</h1>
		<RouterLink
			:to="`/opret-kursus/${editorStore.currentEditedCourseId}`"
			class="editor-nav-link flex gap-2"
		>
			Forside
		</RouterLink
		>
		<RouterLink
			v-for="page in editorStore.listOfCoursePages"
			:key="page.course_page_id"
			:to="`/opret-kursus/${editorStore.currentEditedCourseId}/${page.course_page_id}`"
			class="editor-nav-link flex justify-between"
			:class="{pageIsVisible: pageIsVisible(page)}"
		>
			<span class="flex gap-2">
				<EyeIcon v-if="!pageIsVisible(page)" class="visible-on-hover w-5" @click="setVisibility(page, false)" />
				<EyeOffIcon v-if="pageIsVisible(page)" class="w-5" @click="setVisibility(page, true)" />
				<QuizIcon v-if="pageTypeIsQuiz(page)" class="w-5" />
				<ContentIcon v-if="pageTypeIsArticle(page)" class="w-5" />
				<span :class="{ unsaved: pageHasUnsavedChanges(page) }">
					{{ page.course_page_title }}
				</span>
			</span>
			<PencilIcon class="visible-on-hover"/>
		</RouterLink>
	</div>
</template>

<style scoped>
.editor-nav-link {
	padding: 1rem 1rem 1rem 0.5rem;
}

.editor-nav-link.router-link-exact-active {
	background-color: var(--color-purple-10);
}

.visible-on-hover {
	opacity: 0;
}

.editor-nav-link:hover {
	background-color: var(--color-purple-10);

	.visible-on-hover {
		opacity: 1;
	}
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
