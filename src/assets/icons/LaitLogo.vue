<script setup lang="ts">
defineProps({
	fillClass: {
		type: String,
		default: 'fill-tutara-900',
	},
	height: {
		type: Number,
		default: 26,
	},
	width: {
		type: Number,
	},
});
</script>

<template>
	<svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" viewBox="0 0 82 30" fill="none">
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M0 0L0 29.9496L17.9568 29.9496V27.5371L2.9706 27.5371L2.9706 0L0 0Z"
			:class="fillClass" />
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M54.8457 29.9496H57.8163L57.8163 0L54.8457 0L54.8457 29.9496Z"
			:class="fillClass" />
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M63.6191 0.050293V2.46319L78.6054 2.46319V29.9999H81.5764V0.050293L63.6191 0.050293Z"
			:class="fillClass" />
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M33.954 0L21.5908 29.9496H24.6489L28.3618 20.5485L39.0628 20.5485L38.1766 18.136H29.3669L35.5266 2.41289L46.3168 29.9496H49.3752L37.3179 0L33.954 0Z"
			:class="fillClass" />
	</svg>
</template>
