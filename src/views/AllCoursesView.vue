<script setup lang="ts">

import {createTemplateCourse} from '@/services/courseService.ts';
import {ref} from 'vue';
import router from '@/router';

const courseId = ref<string | null>('');

const handleCreateNewCourseClick = async () => {
  try {
    const course = await createTemplateCourse();
    courseId.value = course.course_id;

    router.push({ name: 'createCourse', params: { id: courseId.value } });
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <h1>ALL KURSER</h1>
  <button class="hover:text-amber-600" @click="handleCreateNewCourseClick">Opret kursus knap</button>
</template>
