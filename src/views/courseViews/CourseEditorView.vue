<script setup lang="ts">
import AddContentHeader from '@/components/createCourse/addContentHeader.vue';
import SidebarContent from '@/components/createCourse/SidebarContent.vue';
import CourseEditorFooter from '@/components/createCourse/CourseEditorFooter.vue';
import { onMounted } from 'vue';
import { getAllCoursePagesByCourseId } from '@/services/courseService.ts';
import { useCourseStore } from '@/stores/courseStore.ts';

interface Props {
	course_id: string;
}

const props = defineProps<Props>();
const courseStore = useCourseStore();

/*onmounted clear og hent courses til store*/

onMounted(async () => {
  const data = await getAllCoursePagesByCourseId(props.course_id);
  if (!data) return;
  courseStore.listOfCoursePages = data;
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
