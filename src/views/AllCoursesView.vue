<script setup lang="ts">
import { createTemplateCourse } from '@/services/courseService.ts';
import { useRouter } from 'vue-router';
import {onMounted} from 'vue';
import {getUserById} from '@/services/userService.ts';

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
	<h1>ALL KURSER</h1>
	<button class="hover:text-amber-600" @click="handleCreateNewCourseClick">Opret kursus knap</button>
</template>
