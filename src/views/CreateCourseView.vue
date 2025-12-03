<script setup lang="ts">
import AddContentHeader from '@/components/createCourse/addContentHeader.vue';
import SidebarContent from '@/components/createCourse/SidebarContent.vue';
import CourseDetailsPage from '@/components/createCourse/CourseDetailsPage.vue';
import CourseEditorFooter from '@/components/createCourse/CourseEditorFooter.vue';
</script>

<template>
  <div class="flex">
    <SidebarContent/>
    <div>
      <AddContentHeader/>
      <CourseDetailsPage/>
      <CourseEditorFooter/>
    </div>
  </div>
</template>
