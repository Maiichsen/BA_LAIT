<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {getAllCoursePagesByCourseId} from '@/services/courseService.ts';
import type {CoursePage} from '@/types/db.ts';
import {useRouter} from 'vue-router';

const router = useRouter();

interface Props {
  course_id: string;
}

const props = defineProps<Props>();

const listOfCoursePages = ref<CoursePage[]>([]);

const getCoursePages = async () => {
  try {
    const data = await getAllCoursePagesByCourseId(props.course_id);
    if (!data) return;
    listOfCoursePages.value = data;
  } catch (error) {
    console.log(error);
  }
};

const routeToContent = (pageId: string) => {
  router.push({ name: 'courseContent', params: { page_id: pageId } });
};

const routeToDetails = () => {
  router.push({ name: 'frontpage'});
};

onMounted(async () => {
  await getCoursePages();

});
</script>

<template>
  <div class="flex-col border-2 border-yellow-500">
    <p @click="routeToDetails()" class="hover:text-amber-600 cursor-pointer">
      Forside
    </p>
    <p v-for="coursePage in listOfCoursePages" :key="coursePage.course_page_id" @click="routeToContent(coursePage.course_page_id)" class="hover:text-amber-600 cursor-pointer">
      {{ coursePage.course_page_title }}
    </p>
  </div>
</template>
