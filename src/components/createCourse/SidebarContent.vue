<script setup lang="ts">
import { onMounted } from 'vue';
import { getAllCoursePagesByCourseId } from '@/services/courseService.ts';
import { useRouter } from 'vue-router';
import { useCourseStore } from '@/stores/courseStore.ts';

const router = useRouter();

interface Props {
	course_id: string;
}

const props = defineProps<Props>();
const courseStore = useCourseStore();

const getCoursePages = async () => {
	try {
		const data = await getAllCoursePagesByCourseId(props.course_id);
		if (!data) return;
		courseStore.listOfCoursePages = data;
	} catch (error) {
		console.log(error);
	}
};

const routeToContent = (pageId: string) => {
	router.push({ name: 'courseContent', params: { page_id: pageId } });
};

const routeToDetails = () => {
	router.push({ name: 'frontpage' });
};

onMounted(async () => {
	await getCoursePages();
});
</script>

<template>
	<div class="flex-col border-2 border-yellow-500">
		<p @click="routeToDetails()" class="hover:text-amber-600 cursor-pointer">Forside</p>
		<p
			v-for="coursePage in courseStore.listOfCoursePages"
			:key="coursePage.course_page_id"
			@click="routeToContent(coursePage.course_page_id)"
			class="hover:text-amber-600 cursor-pointer">
			{{ coursePage.course_page_title }}
		</p>
	</div>
</template>
