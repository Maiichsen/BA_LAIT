<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { getCoursesByUserId, type UserCourseWithInfo } from '@/services/userService.ts';
import { deleteCourseSeat } from '@/services/seatService.ts';
import BaseModal from '@/components/BaseModal.vue';
import BaseTable from '@/components/BaseTable.vue';
import { XIcon } from '@/assets/icons';

interface Props {
	isOpen: boolean;
	userId: string | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
	'update:isOpen': [value: boolean];
}>();

// Courses data for the selected user
const userCourses = ref<UserCourseWithInfo[]>([]);
const isLoadingCourses = ref(false);

// Define courses table columns
const courseTableColumns = ['Kursus', 'Handling'] as const;

// Transform courses data to table format
const courseTableRows = computed(() => {
	return userCourses.value.map(course => [
		course.title,
		course.seat_id,
	]);
});

// Load courses when modal opens or user changes
watch(
	() => [props.isOpen, props.userId] as const,
	async ([isOpen, userId]) => {
		if (isOpen && userId) {
			isLoadingCourses.value = true;
			try {
				userCourses.value = await getCoursesByUserId(userId);
			} catch (error) {
				console.error('Error loading courses:', error);
				userCourses.value = [];
			} finally {
				isLoadingCourses.value = false;
			}
		}
	},
	{ immediate: true },
);

// Remove course from user
const removeCourse = async (seatId: string) => {
	if (!props.userId) return;

	if (!confirm('Er du sikker på, at du vil fjerne dette kursus fra brugeren?')) {
		return;
	}

	try {
		await deleteCourseSeat(seatId);
		// Reload courses
		userCourses.value = await getCoursesByUserId(props.userId);
	} catch (error) {
		console.error('Error removing course:', error);
		alert('Der opstod en fejl ved fjernelse af kurset.');
	}
};
</script>

<template>
	<BaseModal
		:model-value="isOpen"
		@update:model-value="emit('update:isOpen', $event)"
		title="Tildelte kurser"
		:show-footer="false">
		<div class="space-y-4">
			<BaseTable
				:cols="courseTableColumns"
				:rows="courseTableRows"
				:is-loading="isLoadingCourses"
				:has-search="true"
				search-placeholder="Søg kurser..."
				:page-size="5">
				<template #cell-Handling="{ value }">
					<div class="flex justify-center">
						<button
							@click="removeCourse(value as string)"
							class="inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors bg-red-50 hover:bg-red-100"
							title="Fjern kursus">
							<XIcon :width="16" :height="16" fill-class="fill-red-600" />
						</button>
					</div>
				</template>
			</BaseTable>
		</div>
	</BaseModal>
</template>

<style scoped></style>
