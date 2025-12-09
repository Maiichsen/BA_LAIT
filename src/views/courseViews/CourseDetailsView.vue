<script setup lang="ts">
import CourseDetails from '@/components/createCourse/CourseDetails.vue';
interface Props {
  course_id: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div>
    <CourseDetails :course_id="props.course_id"/>
  </div>
</template>

