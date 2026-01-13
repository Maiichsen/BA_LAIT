<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getUserCourses, getCourseStatusForUser } from '@/services/courseService';
import type { Course } from '@/types/db';
import CourseCard from '@/components/course/CourseCard.vue';
import { useUserStore } from '@/stores/userStore.ts';

const userStore = useUserStore();

type CourseStatus = 'not_started' | 'in_progress' | 'completed';

interface CourseWithStatus extends Course {
	status?: CourseStatus;
}

const courses = ref<CourseWithStatus[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchCourses = async () => {
	try {
		loading.value = true;
		error.value = null;

		if (!userStore.userId) {
			error.value = 'Bruger ikke fundet';
			return;
		}

		const data = await getUserCourses(userStore.userId);

		// Hent status for hvert kursus
		const coursesWithStatus = await Promise.all(
			data.map(async course => {
				try {
					const status = await getCourseStatusForUser(course.course_id, userStore.userId!);
					return { ...course, status };
				} catch {
					return course;
				}
			}),
		);

		courses.value = coursesWithStatus;
	} catch (e) {
		error.value = e instanceof Error ? e.message : 'Kunne ikke hente dine kurser';
		console.error('Error fetching user courses:', e);
	} finally {
		loading.value = false;
	}
};

onMounted(() => {
	fetchCourses();
});
</script>

<template>
	<div class="container">
		<div class="container-row space-y-8">
			<div
				class="lg:col-start-2 lg:col-span-14 items-start col-span-full flex flex-col md:flex-row md:items-center justify-between">
				<h1 class="text-h1">Mine Kurser</h1>
			</div>

			<!-- Loading state -->
			<div v-if="loading" class="lg:col-start-2 lg:col-span-11 col-span-full flex items-center justify-center py-12">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
			</div>

			<!-- Error state -->
			<div v-else-if="error" class="lg:col-start-2 lg:col-span-11 col-span-full text-center py-12">
				<p class="text-red-600">{{ error }}</p>
			</div>

			<!-- Empty state -->
			<template v-else>
				<div v-if="courses.length === 0" class="lg:col-start-2 lg:col-span-11 col-span-full text-center py-12">
					<p class="text-tutara-600">Du har ingen tildelte kurser endnu</p>
				</div>

				<!-- Course Grid -->
				<div
					v-else
					class="lg:col-start-2 lg:col-span-14 col-span-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 auto-rows-fr">
					<CourseCard
						v-for="course in courses"
						:key="course.course_id"
						:course-id="course.course_id"
						:title="course.title"
						:description="course.short_course_description"
						:estimated-time-minutes="course.estimated_time_minutes"
						:cover-image-url="course.cover_image_url"
						:author-name="course.author_name"
						:status="course.status"
						:is-edit-mode="false" />
				</div>
			</template>
		</div>
	</div>
</template>
