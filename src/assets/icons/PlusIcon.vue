<script setup lang="ts">
defineProps({
	fillClass: {
		type: String,
		default: 'fill-tutara-900',
	},
	strokeClass: {
		type: String,
		default: 'stroke-tutara-900',
	},
	height: {
		type: Number,
		default: 60,
	},
	width: {
		type: Number,
		default: 60,
	},
});
</script>

<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		:width="width"
		:height="height"
		viewBox="0 0 16 16"
		fill="none"
		:class="strokeClass">
		<path
			d="M3.33334 8H12.6667"
			stroke-width="1.33333"
			stroke-linecap="round"
			stroke-linejoin="round" />
		<path
			d="M8 3.3335V12.6668"
			stroke-width="1.33333"
			stroke-linecap="round"
			stroke-linejoin="round" />
	</svg>
</template>
