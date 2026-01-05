<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue';
</script>

<template>
	<div class="flex flex-col h-screen">
		<TheHeader />
		<main class="flex-1 flex flex-col overflow-hidden">
			<slot />
		</main>
	</div>
</template>
