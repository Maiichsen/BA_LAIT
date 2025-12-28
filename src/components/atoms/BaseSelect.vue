<script setup lang="ts">
interface Option {
	value: string;
	label: string;
}

interface Props {
	inputId: string;
	labelText?: string;
	layout?: 'stacked' | 'inline';
	options: Option[];
	placeholder?: string;
}

const props = defineProps<Props>();
const modelValue = defineModel<string>();

const emit = defineEmits(['change']);
const onChange = (event: Event) => {
	modelValue.value = (event.target as HTMLSelectElement).value;
	emit('change', event);
};
</script>

<template>
	<div :class="props.layout === 'stacked' ? 'flex flex-col gap-1' : 'flex justify-between'">
		<label :for="props.inputId" class="text-t3">
			{{ props.labelText }}
		</label>
		<select
			:id="props.inputId"
			:name="props.inputId"
			:value="modelValue"
			@change="onChange"
			class="bg-white border border-tutara-200 text-p1 text-tutara-600 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-tutara-900">
			<option value="" v-if="placeholder">{{ placeholder }}</option>
			<option v-for="option in props.options" :key="option.value" :value="option.value">
				{{ option.label }}
			</option>
		</select>
	</div>
</template>
