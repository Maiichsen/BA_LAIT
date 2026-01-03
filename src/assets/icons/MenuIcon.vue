<script setup lang="ts">
defineProps({
	strokeClass: {
		type: String,
		default: 'stroke-current',
	},
	height: {
		type: Number,
		default: 24,
	},
	width: {
		type: Number,
		default: 24,
	},
});
</script>

<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		:width="width"
		:height="height"
		viewBox="0 0 24 24"
		fill="none"
		:class="strokeClass">
		<path d="M4 6h16M4 12h16M4 18h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
	</svg>
</template>
