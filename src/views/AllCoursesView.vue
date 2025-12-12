<script setup lang="ts">
import { createTemplateCourse } from '@/services/courseService.ts';
import { useRouter } from 'vue-router';
import CourseGrid from '@/components/course/CourseGrid.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
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
		<div class="container-row gap-y-12">
			<div class="col-span-full lg:col-start-2 lg:col-span-14 flex items-center justify-between">
				<h1 class="text-h1">Kursusoversigt</h1>
				<BaseButton variant="primary" @click="handleCreateNewCourseClick">
					<span class="flex items-center gap-2.5">
						<EditIcon strokeClass="stroke-tutara-50" /> Aktivér redigering
					</span>
				</BaseButton>
			</div>

			<!-- Course Grid -->
			<CourseGrid />
		</div>
	</div>
</template>
