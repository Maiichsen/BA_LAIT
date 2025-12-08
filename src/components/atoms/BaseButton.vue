<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'primary-small' | 'cta-white' | 'light-small' | 'dark-small' | 'stroke'
  as?: 'button' | 'router-link' | 'a'
  to?: string
  href?: string
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  as: 'button',
  type: 'button',
});

const baseClasses = 'rounded-full leading-none transition-colors ease-lait duration-100 relative inline-flex items-center justify-center w-fit';

const variantClasses = {
  'primary': 'py-4 px-6 text-tutara-50 bg-tutara-900 hover:bg-tutara-700 focus:outline-purple-100',
  'primary-small': 'py-3 px-6 text-tutara-50 bg-tutara-900 hover:bg-tutara-700',
  'cta-white': 'py-4 px-6 bg-tutara-50 text-tutara-900 hover:bg-tutara-200 focus:outline-purple-100',
  'light-small': 'py-2 px-3 bg-tutara-50 hover:bg-tutara-200 [&_*]:fill-tutara-900',
  'dark-small': 'py-2 px-3 bg-tutara-900 hover:bg-tutara-700 [&_*]:fill-tutara-50',
  'stroke': 'py-2 px-3 border border-tutara-900 hover:outline-1',
};

const buttonClasses = `${baseClasses} ${variantClasses[props.variant]}`;
</script>

<template>
  <component
    :is="as === 'router-link' ? 'router-link' : as"
    :to="to"
    :href="href"
    :type="as === 'button' ? type : undefined"
    :class="buttonClasses"
  >
    <span class="relative top-[1.5px]">
      <slot />
    </span>
  </component>
</template>
