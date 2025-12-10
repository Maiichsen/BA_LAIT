<script setup lang="ts">
import AddContentHeader from '@/components/createCourse/addContentHeader.vue';
import SidebarContent from '@/components/createCourse/SidebarContent.vue';
import CourseEditorFooter from '@/components/createCourse/CourseEditorFooter.vue';
import { onMounted, watch } from 'vue';
import { useCourseEditorStore } from '@/stores/courseEditorStore.ts';

interface Props {
	course_id: string;
	page_id: string;
}

const props = defineProps<Props>();
const editorStore = useCourseEditorStore();

onMounted(async () => {
	editorStore.loadCourse(props.course_id);
});

watch(
	() => props.page_id,
	newVal => {
		console.log('ARGH');
		console.log(newVal);
	},
);
</script>

<template>
	<div class="flex">
		<div v-if="editorStore.courseGlobalLoading">LOADING...</div>
		<SidebarContent />
		<div>
			<AddContentHeader />
			<div>
				<router-view />
			</div>
			<CourseEditorFooter />
		</div>
	</div>
</template>
