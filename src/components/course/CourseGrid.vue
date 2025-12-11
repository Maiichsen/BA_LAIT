<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAllPublicCourses } from '@/services/courseService';
import type { Course } from '@/types/db';
import CourseCard from './CourseCard.vue';

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
		const data = await getAllPublicCourses();

		// DUMMY DATA, for at se design
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
</script>

<template>
  <div class="w-full">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-info-red mb-4">{{ error }}</p>
      <button
        @click="fetchCourses"
        class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-100 transition-colors"
      >
        Prøv igen
      </button>
    </div>

    <div v-else-if="courses.length === 0" class="text-center py-12">
      <p class="text-tutara-600">Ingen kurser tilgængelige endnu</p>
    </div>

    <div v-else class="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-6">
      <div
        v-for="course in courses"
        :key="course.course_id"
        class="col-span-4"
      >
        <CourseCard
          :course-id="course.course_id"
          :title="course.title"
          :description="course.short_course_description"
          :estimated-time-minutes="course.estimated_time_minutes"
          :cover-image-url="course.cover_image_url"
          :author-name="course.author_name"
          :status="course.status"
        />
      </div>
    </div>
  </div>
</template>
