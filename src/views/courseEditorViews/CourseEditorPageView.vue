<script setup lang="ts">
import { computed } from 'vue';
import {useCourseEditorStore} from '@/stores/courseEditorStore.ts';

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
	<div v-if="!pageData || !pageData.content">LOADING...</div>
	<div v-else>
		<h1>{{ pageData.course_page_title }} ({{pageData.contentType}})</h1>
		<p>Order index {{pageData.order_index}}</p>
		{{ pageData.content }}
	</div>
</template>
