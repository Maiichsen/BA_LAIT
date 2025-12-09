<script setup lang="ts">
import AddContentHeader from '@/components/createCourse/addContentHeader.vue';
import SidebarContent from '@/components/createCourse/SidebarContent.vue';
import CourseEditorFooter from '@/components/createCourse/CourseEditorFooter.vue';
import { onMounted } from 'vue';
import { useCourseStore } from '@/stores/courseStore.ts';

interface Props {
	course_id: string;
}

const props = defineProps<Props>();
const courseStore = useCourseStore();

onMounted(async () => {
	courseStore.loadCourse(props.course_id);
});
</script>

<template>
	<div class="flex">
		<SidebarContent :course_id="props.course_id" />
		<div>
			<AddContentHeader :course_id="props.course_id" />
			<div>
				<router-view />
			</div>
			<CourseEditorFooter />
		</div>
	</div>
</template>
