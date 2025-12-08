<script setup lang="ts">
/*TODO: måske sin egen prop til input name?*/
interface Props {
  inputType: string,
  placeholder?: string,
  inputId: string,
  labelText?: string,
  layout?: 'stacked' | 'inline',
  accept?: string,
}

const props = defineProps<Props>();
const modelValue = defineModel();

const emit = defineEmits(['change']);
const onInput = (event: Event) => {
  modelValue.value = (event.target as HTMLInputElement).value;
};

</script>

<template>
  <div :class="props.layout === 'stacked' ? 'flex flex-col gap-1' : 'flex justify-between'">
    <label :for=props.inputId>
      {{ props.labelText }}
    </label>
    <input :type=props.inputType
           :placeholder=props.placeholder
           :id=props.inputId
           :name=props.inputId
           :value="modelValue"
           @input="onInput"
           :accept="accept"
           @change="emit('change', $event)"
    />
  </div>
</template>
