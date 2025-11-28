<script setup lang="ts">
/*TODO: måske sin egen prop til input name?*/
interface Props {
  inputType: string,
  placeholder: string,
  inputId: string,
  labelText: string,
  layout: 'stacked' | 'inline',
}

const props = defineProps<Props>();
</script>

<template>
  <div :class="props.layout === 'stacked' ? 'flex flex-col gap-1' : 'flex items-center gap-3'">
    <label :for=props.inputId>
      {{ props.labelText }}
    </label>
    <input :type=props.inputType
           :placeholder=props.placeholder
           :id=props.inputId
           :name=props.inputId
    />
  </div>
</template>
