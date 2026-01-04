<script setup lang="ts">
import { onMounted } from 'vue';
import type { RichCoursePage } from '@/types/courseTypes.ts';

interface Props {
	page: RichCoursePage;
}

const { page } = defineProps<Props>();

onMounted(() => {
	console.log('edit quiz');
});
</script>

<template>
	<div class="bg-white rounded border border-tutara-200">This is quiz {{page}}</div>
</template>
