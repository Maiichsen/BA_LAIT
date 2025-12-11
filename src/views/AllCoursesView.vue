<script setup lang="ts">
import { createTemplateCourse } from '@/services/courseService.ts';
import { useRouter } from 'vue-router';

const router = useRouter();

const handleCreateNewCourseClick = () => {
	createTemplateCourse()
		.then(course => {
			router.push({ name: 'courseEditorFrontpage', params: { course_id: course.course_id } });
		})
		.catch(err => console.log(err));
};
</script>

<template>
	<div class="container">
		<div class="container-row">
			<div class="lg:col-start-2 lg:col-span-11 col-span-full">
				<h1 class="text-h1">Kursusoversigt</h1>
				<button class="hover:text-amber-600 cursor-pointer" @click="handleCreateNewCourseClick">Opret kursus knap</button>

				<!-- Indhold her -->
				<div></div>
			</div>
		</div>
	</div>
</template>
