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
				<BaseButton variant="primary" @click="toggleEditMode">
					<span class="flex items-center gap-2.5">
						<EditIcon strokeClass="stroke-tutara-50" />
						{{ isEditMode ? 'Deaktivér redigering' : 'Aktivér redigering' }}
					</span>
				</BaseButton>
			</div>

			<!-- Course Grid -->
			<CourseGrid :is-edit-mode="isEditMode" />
		</div>
	</div>
</template>
