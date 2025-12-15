<script setup lang="ts">
import { createTemplateCourse } from '@/services/courseService.ts';
import { useRouter } from 'vue-router';
import CourseGrid from '@/components/course/CourseGrid.vue';
import { EditIcon } from '@/assets/icons';

const router = useRouter();

const handleCreateNewCourseClick = () => {
	createTemplateCourse()
		.then(course => {
			router.push({ name: 'frontpage', params: { course_id: course.course_id } });
		})
		.catch(err => console.log(err));
};
</script>

<template>
	<div class="container">
		<div class="container-row">
			<div class="lg:col-start-2 lg:col-span-11 col-span-full">
				<h1 class="text-h1">Kursusoversigt</h1>

				<button class="hover:text-amber-600" @click="handleCreateNewCourseClick">
					Opret kursus knap <EditIcon strokeClass="stroke-purple-500" />
				</button>
			</div>

			<!-- Course Grid -->
			<CourseGrid />
		</div>
	</div>
</template>
