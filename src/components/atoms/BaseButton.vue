<script setup lang="ts">
interface Props {
  inputType: string,
  placeholder: string,
  inputId: string,
  labelText: string,
  variant: 'default' | 'danger' | 'hollow',
}

const props = defineProps<Props>();
const modelValue = defineModel();

const onInput = (event: Event) => {
  modelValue.value = (event.target as HTMLInputElement).value
};
</script>

<template>
<button/>
</template>
