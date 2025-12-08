<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {getAllCoursePagesByCourseId} from '@/services/courseService.ts';
import type {CoursePage} from '@/types/db.ts';
import {useRouter} from 'vue-router';

const router = useRouter();

interface Props {
  courseId: string;
}

const props = defineProps<Props>();

const listOfCoursePages = ref<CoursePage[]>([]);

const getCoursePages = async () => {
  try {
    listOfCoursePages.value = await getAllCoursePagesByCourseId(props.courseId);
  } catch (error) {
    console.log(error);
  }
};


onMounted(async () => {
  await getCoursePages();

});

const test = (pageId: string) => {
  router.push({ name: 'createCourseContent', params: { id: courseId.value } });
};


</script>

<template>
  <div class="flex-col border-2 border-yellow-500">
    <p>
      Forside
    </p>
    <p v-for="coursePage in listOfCoursePages" :key="coursePage.course_page_id" @click="test(coursePage.course_page_id)">
      {{ coursePage.course_page_title }}
    </p>
  </div>
</template>
