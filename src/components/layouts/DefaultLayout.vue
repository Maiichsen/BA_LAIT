<script setup lang="ts">
import TheHeader from '@/components/header/TheHeader.vue';
import TheFooter from '@/components/footer/TheFooter.vue';
</script>

<template>
	<div>
		<TheHeader />
		<main>
			<slot />
		</main>
		<TheFooter />
	</div>
</template>
