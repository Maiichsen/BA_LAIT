<script setup lang="ts">
import { watch } from 'vue';
import { XIcon } from '@/assets/icons';
import BaseButton from '@/components/atoms/BaseButton.vue';

interface Props {
	modelValue: boolean;
	title: string;
	showFooter?: boolean;
	cancelText?: string;
	confirmText?: string;
	maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

const props = withDefaults(defineProps<Props>(), {
	showFooter: true,
	cancelText: 'Annuller',
	confirmText: 'Gem ændringer',
	maxWidth: 'md',
});

const emit = defineEmits<{
	'update:modelValue': [value: boolean];
	confirm: [];
	cancel: [];
}>();

const maxWidthClasses = {
	sm: 'max-w-md',
	md: 'max-w-2xl',
	lg: 'max-w-4xl',
	xl: 'max-w-6xl',
};

function closeModal() {
	emit('update:modelValue', false);
	emit('cancel');
}

function handleConfirm() {
	emit('confirm');
}

// Prevent body scroll when modal is open
watch(
	() => props.modelValue,
	isOpen => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	},
);

// Handle escape key
function handleKeydown(event: KeyboardEvent) {
	if (event.key === 'Escape' && props.modelValue) {
		closeModal();
	}
}

watch(
	() => props.modelValue,
	isOpen => {
		if (isOpen) {
			document.addEventListener('keydown', handleKeydown);
		} else {
			document.removeEventListener('keydown', handleKeydown);
		}
	},
);
</script>

<template>
	<Teleport to="body">
		<Transition
			enter-active-class="transition-opacity duration-200 ease-out"
			enter-from-class="opacity-0"
			enter-to-class="opacity-100"
			leave-active-class="transition-opacity duration-150 ease-in"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0">
			<div
				v-if="modelValue"
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
				@click.self="closeModal">
				<Transition
					enter-active-class="transition-all duration-200 ease-out"
					enter-from-class="opacity-0 scale-95"
					enter-to-class="opacity-100 scale-100"
					leave-active-class="transition-all duration-150 ease-in"
					leave-from-class="opacity-100 scale-100"
					leave-to-class="opacity-0 scale-95">
					<div
						v-if="modelValue"
						:class="['bg-white rounded-3xl shadow-2xl w-full', maxWidthClasses[maxWidth]]"
						@click.stop>
						<!-- Header -->
						<div class="flex items-center justify-between px-8 py-6 border-b border-tutara-200">
							<h2 class="text-t1 text-tutara-900">{{ title }}</h2>
							<button
								type="button"
								class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-tutara-100 transition-colors cursor-pointer"
								@click="closeModal">
								<XIcon :width="20" :height="20" fill-class="fill-tutara-600" />
							</button>
						</div>

						<!-- Content -->
						<div class="px-8 py-6">
							<slot />
						</div>

						<!-- Footer -->
						<div v-if="showFooter || $slots.footer" class="px-8 py-6 border-t border-tutara-200">
							<slot name="footer">
								<div class="flex justify-center gap-4">
									<BaseButton variant="stroke" @click="closeModal">
										{{ cancelText }}
									</BaseButton>
									<BaseButton variant="primary" @click="handleConfirm">
										{{ confirmText }}
									</BaseButton>
								</div>
							</slot>
						</div>
					</div>
				</Transition>
			</div>
		</Transition>
	</Teleport>
</template>
