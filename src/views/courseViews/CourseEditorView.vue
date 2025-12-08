<script setup lang="ts">
import AddContentHeader from '@/components/createCourse/addContentHeader.vue';
import SidebarContent from '@/components/createCourse/SidebarContent.vue';
import CourseEditorFooter from '@/components/createCourse/CourseEditorFooter.vue';
import {computed} from 'vue';

interface Props {
  course_id: string;
}

const props = defineProps<Props>();

const courseId = computed(() => {
  return props.course_id;
});

console.log(courseId.value);

</script>

<template>
  <div class="flex">
    <SidebarContent :course_id="props.course_id"/>
    <div>
      <AddContentHeader/>
      <div>
        <router-view/>
      </div>
      <CourseEditorFooter/>
    </div>
  </div>
</template>
