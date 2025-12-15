<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';
import BreadCrumbs from '../BreadCrumbs.vue';
</script>

<template>
	<div class="flex flex-col min-h-screen">
		<TheHeader />
		<main class="flex-1 py-8 lg:py-24">
			<BreadCrumbs />
			<slot />
		</main>
		<TheFooter />
	</div>
</template>
