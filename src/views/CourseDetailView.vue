<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCourseById, getAllCoursePagesByCourseId } from '@/services/courseService';
import type { Course, CoursePage } from '@/types/db';
import CourseDetailCard from '@/components/course/CourseDetailCard.vue';

const route = useRoute();
const router = useRouter();
const courseId = computed(() => route.params.course_id as string);

const course = ref<Course | null>(null);
const coursePages = ref<CoursePage[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
	try {
		loading.value = true;
		// Hent kursus data
		const courseData = await getCourseById(courseId.value);
		course.value = courseData;

		// Hent alle kursus sider
		const pages = await getAllCoursePagesByCourseId(courseId.value);
		coursePages.value = pages;
	} catch (err) {
		console.error('Error loading course:', err);
		error.value = 'Kunne ikke indlæse kurset';
	} finally {
		loading.value = false;
	}
});

//total video tid, dummy data = 30% af samlet tid - tilføj video_duration fra databasen senere
const totalVideoMinutes = computed(() => {
	if (!course.value?.estimated_time_minutes) return null;
	return Math.floor(course.value.estimated_time_minutes * 0.3);
});

// Handler for "Bliv kontaktet" knap
const handleContact = () => {
	router.push('/kontakt');
};
</script>

<template>
	<div class="container">
		<div class="container-row">
			<!-- Loading state -->
			<div v-if="loading" class="col-span-full flex items-center justify-center min-h-[400px]">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
			</div>

			<!-- Error state -->
			<div v-else-if="error || !course" class="col-span-full flex items-center justify-center min-h-[400px]">
				<div class="text-center">
					<h2 class="text-h4 text-tutara-900 mb-2">Fejl</h2>
					<p class="text-p1 ">{{ error || 'Kurset blev ikke fundet' }}</p>
				</div>
			</div>

			<!-- Kursus detalje/info -->
			<template v-else>
				<div class="lg:col-start-2 lg:col-span-10 col-span-full mb-8">
					<h1 class="text-h2">{{ course.title }}</h1>
				</div>

				<div class="lg:col-start-2 lg:col-span-8 col-span-full space-y-8 bg order-2 lg:order-0">
					<div class="space-y-4">
						<h2 v-if="course.short_course_description" class="text-h5 ">
							{{ course.short_course_description }}
						</h2>
						<p v-if="course.long_course_description" class="text-p1">
							{{ course.long_course_description }}
						</p>
						<p v-if="course.author_name" class="text-t3">
							Af: <span class="">{{ course.author_name }}</span>
						</p>
					</div>

					<div v-if="coursePages.length > 0" class="space-y-3">
						<h3 class="text-t2 ">Kursus indhold:</h3>
						<ul class="list-disc list-inside space-y-2 text-p1 ">
							<li v-for="page in coursePages" :key="page.course_page_id">
								{{ page.course_page_title }}
							</li>
						</ul>
					</div>

					<!-- Dummy kursus indhold-->
					<div class="space-y-3">
						<h3 class="text-t2 ">Hvem er kurset til?</h3>
						<p class="text-p1 ">
						Kurset er målrettet virksomheder, der ønsker at styrke deres medarbejdere i at arbejde professionelt med webtilgængelighed. Det henvender sig til udviklere, designere, redaktører og andre, der arbejder med digitale produkter.
						</p>
					</div>

					<div class="space-y-3">
						<h3 class="text-t2 ">Det lærer i på kurset</h3>
						<ul class="list-disc list-inside space-y-2 text-p1 ">
							<li>Hvad webtilgængelighed er, og hvorfor det er vigtigt</li>
							<li>Introduktion til WCAG 2.2 og lovgivning (EU's tilgængelighedsdirektiv)</li>
							<li>Bedste praksis for tilgængelig design, struktur og UI</li>
							<li>Semantisk HTML, ARIA og tilgængelige komponenter</li>
							<li>Tastaturnavigation, fokus, farver og kontrast</li>
							<li>Tilgængelighedstest, manuelle og automatiske metoder</li>
							<li>Konkrete eksempler og løsninger, I kan bruge med det samme</li>
						</ul>
					</div>

					<div class="space-y-3">
						<h3 class="text-t2 ">Udbytte</h3>
						<p class="text-p1 ">Efter kurset vil lærer medarbejderen kunne:</p>
						<ul class="list-disc list-inside space-y-2 text-p1 ">
							<li>Identificere og løse tilgængelighedsproblemer</li>
							<li>Forstå WCAG-principper</li>
							<li>Udvikle mere inkluderende og lovmedholdige digitale løsninger.</li>
						</ul>
					</div>

					<div class="space-y-3">
						<h3 class="text-t2 ">Praktisk info</h3>
						<p class="text-p1 ">
							Kurset leveres on-demand, så medarbejdere kan tage det i eget tempo – når det passer
							ind i arbejdsdagen.
						</p>
					</div>
				</div>

			<!-- Kursus detalje card  -->
				<div class="lg:col-start-11 lg:col-span-5 col-span-full order-1 lg:order-0 pb-5 lg:pb-0">
					<div class="">
						<CourseDetailCard
							:course-id="courseId"
							:title="course.title"
							:estimated-time-minutes="course.estimated_time_minutes"
							:cover-image-url="course.cover_image_url"
							:video-content-minutes="totalVideoMinutes"
							language="Dansk"
							:has-certificate="true"
							course-type="Online"
							pacing="Selvvalgt tempo"
							@contact="handleContact" />
					</div>
				</div>
			</template>
		</div>
	</div>
</template>
