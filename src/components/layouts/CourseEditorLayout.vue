<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue';
</script>

<template>
	<div>
		<TheHeader />
		<main class="flex-1 py-8 lg:py-24">
			<slot />
		</main>
	</div>
</template>

