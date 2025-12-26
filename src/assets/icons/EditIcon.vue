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
		default: 21,
	},
	width: {
		type: Number,
		default: 21,
	},
});
</script>

<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		:width="width"
		:height="height"
		viewBox="0 0 21 21"
		fill="none"
		:class="strokeClass">
		<path
			d="M18.1464 0.842274C18.1958 0.873314 18.2502 0.905287 18.3056 0.94172C18.5799 1.12196 18.8761 1.33934 19.059 1.53069C19.2338 1.7135 19.4324 2.00669 19.5981 2.27724C19.6284 2.32683 19.6561 2.37532 19.6825 2.4201L7.1798 15.2851L4.34849 16.358L5.62734 13.724L18.1464 0.842274Z" />
		<path d="M13.707 0.844971H0.5V19.9999H9.80776H15.2163L17.103 18.4136L19.1155 16.6634V13.3269V6.65395" />
		<path d="M15.5566 19.4367V16.0564H19.1155" />
	</svg>
</template>
