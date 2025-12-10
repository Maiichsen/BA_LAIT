<script setup lang="ts">
import TheHeader from '@/components/header/TheHeader.vue';
import TheFooter from '@/components/footer/TheFooter.vue';
</script>

<template>
	<div class="flex flex-col h-full">
		<TheHeader />
		<main class="flex-1">
			<slot />
		</main>
		<TheFooter />
	</div>
</template>
