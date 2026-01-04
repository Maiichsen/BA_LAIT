<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue';
</script>

<template>
	<div class="flex flex-col h-screen overflow-hidden">
		<TheHeader />
		<main class="flex-1 flex flex-col h-full">
			<slot />
		</main>
	</div>
</template>
