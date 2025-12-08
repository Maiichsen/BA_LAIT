<script setup lang="ts">
import {createTemplateCourse} from '@/services/courseService.ts';
import {ref} from 'vue';
import {useRouter} from 'vue-router';


const router = useRouter();


const courseId = ref<string | null>('');

const handleCreateNewCourseClick = async () => {
  try {
    const course = await createTemplateCourse();
    if (!course) return;
    courseId.value = course.course_id;

    router.push({ name: 'frontpage', params: {course_id: courseId.value } });
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <h1>ALL KURSER</h1>
  <button class="hover:text-amber-600" @click="handleCreateNewCourseClick">Opret kursus knap</button>
</template>
