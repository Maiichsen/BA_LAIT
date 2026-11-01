<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';
import BreadCrumbs from '../BreadCrumbs.vue';
import { isDemo } from '@/db/connection.ts';
</script>

<template>
	<div class="flex flex-col min-h-screen">
		<p v-if="isDemo" class="bg-tutara-900 text-white text-center text-sm py-2 px-4">
			Demo of our bachelor project with fictional seed data. Changes reset when you reload.
		</p>
		<TheHeader />
		<main class="flex-1 py-8 lg:py-24">
			<BreadCrumbs />
			<slot />
		</main>
		<TheFooter />
	</div>
</template>
