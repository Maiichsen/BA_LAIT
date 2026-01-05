<script setup lang="ts">
import { computed } from 'vue';
import { useCourseEditorStore } from '@/stores/courseEditorStore.ts';
import { CoursePageType } from '@/constants/courseConstants.ts';
import EditArticle from '@/components/createCourse/EditArticle.vue';
import EditQuiz from '@/components/createCourse/EditQuiz.vue';

const editorStore = useCourseEditorStore();

interface Props {
	page_id: string;
}

const props = defineProps<Props>();

const pageData = computed(() => {
	return editorStore.coursePageContent[props.page_id];
});
</script>

<template>
	<div v-if="!pageData || !pageData.content" class="text-center">LOADING...</div>
	<EditArticle v-else-if="pageData.contentType === CoursePageType.article" :page="pageData" />
	<EditQuiz v-else-if="pageData.contentType === CoursePageType.quiz" :page="pageData" />
	<div v-else>
		<h1>Something went wrong. Unknown page type...</h1>
		<h1>{{ pageData.course_page_title }} ({{ pageData.contentType }})</h1>
		<p>Order index {{ pageData.order_index }}</p>
		{{ pageData.content }}
	</div>
</template>
