<script setup lang="ts">
import AddContentHeader from '@/components/createCourse/addContentHeader.vue';
import SidebarContent from '@/components/createCourse/SidebarContent.vue';
import CourseDetailsPage from '@/components/createCourse/CourseDetailsPage.vue';
import CourseEditorFooter from '@/components/createCourse/CourseEditorFooter.vue';
import {computed} from 'vue';
import {useRoute} from 'vue-router';

const route = useRoute();

const courseId = computed(() => {
  return route.params.id;
});

console.log(courseId.value);

</script>

<template>
  <div class="flex">
    <SidebarContent :course-id="courseId as string" />
    <div>
      <AddContentHeader/>
      <div>
        <router-view/>
      </div>
      <CourseEditorFooter/>
    </div>
  </div>
</template>
