<script setup lang="ts">
import { computed } from 'vue';

interface Props {
	variant?: 'green' | 'purple' | 'tutara' | 'blue' | 'default';
}

const props = withDefaults(defineProps<Props>(), {
	variant: 'default',
});

const badgeClasses = computed(() => {
	const baseClasses = 'text-p2 px-4 border-2 rounded-full inline-block';

	switch (props.variant) {
		case 'green':
			return `${baseClasses} bg-info-green border-tutara-50! text-green-800`;
		case 'purple':
			return `${baseClasses} bg-purple-10 border-tutara-50! text-purple-500`;
		case 'tutara':
			return `${baseClasses} bg-tutara-100 border-tutara-200! text-tutara-500`;
		case 'blue':
			return `${baseClasses} bg-cornflower-blue-10 border-cornflower-blue-10`;
		default:
			return `${baseClasses} border-cornflower-blue-10`;
	}
});
</script>

<template>
	<span :class="badgeClasses">
		<slot />
	</span>
</template>
