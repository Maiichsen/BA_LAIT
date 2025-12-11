<script setup lang="ts">
interface Props {
	name: string;
}

const props = defineProps<Props>();
</script>

<template>
	<div>
		<label>
			<input type="radio" :name="props.name" />
			<input type="text" placeholder="Valgmulighed" />
		</label>
	</div>
</template>
