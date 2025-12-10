<script setup lang="ts">
interface Props {
	page_id: string;
}

const props = defineProps<Props>();
</script>

<template>
	<h1>PAGE VIEW {{ props.page_id }}</h1>
</template>
