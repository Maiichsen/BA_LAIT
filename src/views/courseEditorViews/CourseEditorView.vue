<script setup lang="ts">
import AddContentHeader from '@/components/createCourse/addContentHeader.vue';
import SidebarContent from '@/components/createCourse/SidebarContent.vue';
import CourseEditorFooter from '@/components/createCourse/CourseEditorFooter.vue';
import { onMounted, watch } from 'vue';
import { useCourseEditorStore } from '@/stores/courseEditorStore.ts';

interface Props {
	course_id: string;
	page_id?: string;
}

const props = defineProps<Props>();
const editorStore = useCourseEditorStore();

onMounted(async () => {
	editorStore.loadCourse(props.course_id);
	editorStore.setCurrentEditedCoursePage(props.page_id);
});

watch(
	() => props.page_id,
	newPageId => {
		editorStore.setCurrentEditedCoursePage(newPageId);
	},
);
</script>

<template>
	<div class="flex-1 flex h-full">
		<div v-if="editorStore.courseGlobalLoading">LOADING...</div>
		<SidebarContent class="min-w-50 max-w-80" />
		<div class="flex-1 flex flex-col h-full">
			<AddContentHeader />
			<div class="flex-1 overflow-y-auto p-4">
				<router-view />
			</div>
			<CourseEditorFooter />
		</div>
	</div>
</template>
