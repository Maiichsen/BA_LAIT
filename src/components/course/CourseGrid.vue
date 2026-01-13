<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { createTemplateCourse, getAllPublicCourses } from '@/services/courseService';
import type { Course } from '@/types/db';
import CourseCard from './CourseCard.vue';
import { useRouter } from 'vue-router';
import { PlusIcon } from '@/assets/icons';

const router = useRouter();

type CourseStatus = 'not_started' | 'in_progress' | 'completed';

interface CourseWithStatus extends Course {
	status?: CourseStatus;
}

interface Props {
	isEditMode: boolean;
}

const { isEditMode } = defineProps<Props>();

const courses = ref<CourseWithStatus[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchCourses = async () => {
	try {
		loading.value = true;
		error.value = null;
		const data = await getAllPublicCourses();

		// Tilføj tilfældig status til de første 3 kurser
		courses.value = data.map((course, index) => {
			if (index === 0) return { ...course, status: 'completed' as CourseStatus };
			if (index === 1) return { ...course, status: 'in_progress' as CourseStatus };
			if (index === 2) return { ...course, status: 'not_started' as CourseStatus };
			return course;
			// Resten uden status
		});
	} catch (e) {
		error.value = e instanceof Error ? e.message : 'Kunne ikke hente kurser';
		console.error('Error fetching courses:', e);
	} finally {
		loading.value = false;
	}
};

onMounted(() => {
	fetchCourses();
});

const handleCreateNewCourseClick = () => {
	createTemplateCourse()
		.then(course => {
			router.push({ name: 'courseEditorFrontpage', params: { course_id: course.course_id } });
		})
		.catch(err => console.log(err));
};
</script>

<template>
	<div v-if="loading" class="lg:col-start-2 lg:col-span-11 col-span-full flex items-center justify-center py-12">
		<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
	</div>

	<template v-else>
		<div v-if="courses.length === 0" class="lg:col-start-2 lg:col-span-11 col-span-full text-center py-12">
			<p class="text-tutara-600">Ingen kurser tilgængelige endnu</p>
		</div>

		<div
			v-else
			class="lg:col-start-2 lg:col-span-14 col-span-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 auto-rows-fr">
			<!-- Create new course card -->
			<div
				v-if="isEditMode"
				@click="handleCreateNewCourseClick"
				class="group flex flex-col h-full border border-tutara-200 bg-white rounded-md cursor-pointer hover:bg-tutara-100 transition-colors duration-300 min-h-[300px]">
				<div class="flex flex-col items-center justify-center flex-1 gap-4">
					<PlusIcon
						:width="60"
						:height="60"
						stroke-class="stroke-tutara-600 group-hover:stroke-tutara-900 transition-transform duration-400 transform group-hover:scale-110" />
					<p
						class="text-h6 text-tutara-600 group-hover:text-tutara-900 underline decoration-transparent group-hover:decoration-tutara-900 transition-all">
						Opret kursus
					</p>
				</div>
			</div>

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
				:is-edit-mode="isEditMode" />
		</div>
	</template>
</template>
