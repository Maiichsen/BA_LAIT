<script setup lang="ts">
import { createTemplateCourse } from '@/services/courseService.ts';
import { useRouter } from 'vue-router';
import CourseGrid from '@/components/course/CourseGrid.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';

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
		<div class="container-row gap-y-12">
			<div class="lg:col-start-2 col-span-full">
				<h1 class="text-h1">Kursusoversigt</h1>
				<BaseButton variant="primary" @click="handleCreateNewCourseClick"> Opret kursus </BaseButton>
			</div>

			<!-- Course Grid -->
			<CourseGrid />
		</div>
	</div>
</template>
