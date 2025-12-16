<script setup lang="ts">
interface Props {
	text: string;
}

defineProps<Props>();
</script>

<template>
	<div class="group relative inline-flex">
		<slot />
		<span
			class="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-2 inline-flex px-2.5 py-1 justify-center items-center gap-2.5 rounded border border-tutara-200 bg-white shadow-lg text-tutara-900 text-p1 font-p1 leading-p1 whitespace-nowrap pointer-events-none z-10">
			{{ text }}
		</span>
	</div>
</template>
