<script setup lang="ts">
import {createTemplateCourse} from '@/services/courseService.ts';
import {useRouter} from 'vue-router';
import {onMounted, ref} from 'vue';
import {getAuthUser, getUserById, getUserRoleById} from '@/services/userService.ts';
import type {User} from '@/types/db.ts';
import {useUserStore} from '@/stores/userStore.ts';

const router = useRouter();
const userStore = useUserStore();

const handleCreateNewCourseClick = () => {
	createTemplateCourse()
		.then(course => {
			router.push({name: 'frontpageCreateCourse', params: {course_id: course.course_id}});
		})
		.catch(err => console.log(err));
};
</script>

<template>
	<div class="container">
		<div class="container-row">
			<div class="lg:col-start-2 lg:col-span-11 col-span-full">
				<h1 class="text-h1">Kursusoversigt</h1>
				<button class="hover:text-amber-600" @click="handleCreateNewCourseClick">Opret kursus knap
				</button>

				<!-- Indhold her -->

				<div>
					<h1>HER ER VI!!!</h1>
					<p>{{userStore.userId}}</p>
				</div>
			</div>
		</div>
	</div>
</template>
