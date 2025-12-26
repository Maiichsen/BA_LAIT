<script setup lang="ts">
import { computed } from 'vue';
import * as Icons from '@/assets/icons';

const variantClasses = {
	primary: 'py-4 px-6 text-tutara-50 bg-tutara-900 hover:bg-tutara-700 focus:outline-purple-100',
	'primary-small': 'py-3 px-6 text-tutara-50 bg-tutara-900 hover:bg-tutara-700',
	'primary-tiny': 'py-3 px-4 text-tutara-50 bg-tutara-900 hover:bg-tutara-700',
	'cta-white': 'py-4 px-6 bg-tutara-50 text-tutara-900 hover:bg-tutara-200 focus:outline-purple-100',
	'light-small': 'py-2 px-3 bg-tutara-50 hover:bg-tutara-200 [&_*]:fill-tutara-900',
	'dark-small': 'py-2 px-3 bg-tutara-900 hover:bg-tutara-700 [&_*]:fill-tutara-50',
	stroke: 'py-4 px-6 border border-tutara-900 hover:outline-1',
	'stroke-small': 'py-2 px-3 border border-tutara-900 hover:outline-1',
} as const;

interface Props {
	variant?: keyof typeof variantClasses;
	iconName?: keyof typeof Icons;
	as?: 'button' | 'router-link' | 'a';
	to?: string;
	href?: string;
	type?: 'button' | 'submit' | 'reset';
}

const fillVariantClasses: { [key in NonNullable<Props['variant']>]?: string } = {
	stroke: 'stroke-tutara-900',
};

const props = withDefaults(defineProps<Props>(), {
	variant: 'primary',
	as: 'button',
	type: 'button',
	iconName: undefined,
});

const baseClasses =
	'rounded-full leading-none transition-colors ease-lait duration-100 relative inline-flex items-center justify-center w-fit';

const buttonClasses = computed(() => `${baseClasses} ${variantClasses[props.variant]}`);

const currentIcon = computed(() => (props.iconName ? Icons[props.iconName] : null));

const fillClass = computed(() =>
	props.variant in fillVariantClasses ? fillVariantClasses[props.variant] : 'stroke-tutara-50',
);
</script>

<template>
	<component
		:is="as === 'router-link' ? 'router-link' : as"
		:to="to"
		:href="href"
		:type="as === 'button' ? type : undefined"
		:class="buttonClasses">
		<span class="relative top-[1.5px]">
			<span class="flex items-center gap-2.5">
				<currentIcon
					:width="20"
					:height="20"
					:stroke-class="fillClass"
					fill-class="fill-tutara-50"
					v-if="currentIcon != null" />
				<slot />
			</span>
		</span>
	</component>
</template>
