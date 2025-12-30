<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue';
</script>

<template>
	<div>
		<TheHeader />
		<main>
			<slot />
		</main>
	</div>
</template>

