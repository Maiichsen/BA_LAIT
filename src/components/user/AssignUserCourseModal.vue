<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { getCoursesByCompanyId, type CompanyCourseWithStats } from '@/services/companyService.ts';
import { assignUserToCourseSeat } from '@/services/seatService.ts';
import BaseModal from '@/components/BaseModal.vue';

interface Props {
	isOpen: boolean;
	userId: string | null;
	companyId: string | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
	'update:isOpen': [value: boolean];
	'courseAssigned': [];
}>();

// Available courses data
const availableCourses = ref<CompanyCourseWithStats[]>([]);
const isLoadingCourses = ref(false);

// Selected course
const selectedCourseId = ref<string>('');

// Save state
const isSaving = ref(false);

// Load available courses when modal opens or company changes
watch(
	() => [props.isOpen, props.companyId] as const,
	async ([isOpen, companyId]) => {
		if (isOpen && companyId) {
			isLoadingCourses.value = true;
			try {
				const courses = await getCoursesByCompanyId(companyId);
				// Filter to only show courses with available seats
				availableCourses.value = courses.filter(course => course.availableSeats > 0);
				// Reset selection
				selectedCourseId.value = '';
			} catch (error) {
				console.error('Error loading courses:', error);
				availableCourses.value = [];
			} finally {
				isLoadingCourses.value = false;
			}
		}
	},
	{ immediate: true },
);

// Assign user to course
const handleConfirm = async () => {
	if (!selectedCourseId.value || !props.userId || !props.companyId) {
		alert('Vælg venligst et kursus');
		return;
	}

	isSaving.value = true;

	try {
		await assignUserToCourseSeat(props.companyId, selectedCourseId.value, props.userId);

		// Emit success event
		emit('courseAssigned');
		emit('update:isOpen', false);

		// Reset selection
		selectedCourseId.value = '';
	} catch (error) {
		console.error('Error assigning course:', error);
		if (error instanceof Error && error.message === 'No available seats for this course') {
			alert('Der er ingen ledige pladser til dette kursus.');
		} else {
			alert('Der opstod en fejl ved tildeling af kursus.');
		}
	} finally {
		isSaving.value = false;
	}
};

// Cancel action
const handleCancel = () => {
	selectedCourseId.value = '';
	emit('update:isOpen', false);
};

// Get selected course details
const selectedCourse = computed(() => {
	return availableCourses.value.find(c => c.course_id === selectedCourseId.value);
});
</script>

<template>
	<BaseModal
		:model-value="isOpen"
		@update:model-value="emit('update:isOpen', $event)"
		title="Tildel kursus"
		:show-footer="true"
		confirm-text="Tildel kursus"
		cancel-text="Annuller"
		@confirm="handleConfirm"
		@cancel="handleCancel"
		:is-loading="isSaving">
		<div class="space-y-4">
			<div v-if="isLoadingCourses" class="text-center py-8 text-tutara-600">
				Indlæser kurser...
			</div>

			<div v-else-if="availableCourses.length === 0" class="text-center py-8 text-tutara-600">
				Der er ingen kurser med ledige pladser tilgængelige.
			</div>

			<div v-else class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-tutara-700 mb-2">
						Vælg et kursus
					</label>
					<select
						v-model="selectedCourseId"
						class="w-full px-4 py-2.5 border border-tutara-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tutara-500 bg-white"
					>
						<option value="">-- Vælg et kursus --</option>
						<option
							v-for="course in availableCourses"
							:key="course.course_id"
							:value="course.course_id">
							{{ course.title }} ({{ course.availableSeats }} ledige pladser)
						</option>
					</select>
				</div>

				<!-- Show selected course details -->
				<div v-if="selectedCourse" class="bg-tutara-50 rounded-lg p-4 border border-tutara-200">
					<h4 class="font-semibold text-tutara-900 mb-2">{{ selectedCourse.title }}</h4>
					<p v-if="selectedCourse.short_course_description" class="text-sm text-tutara-600 mb-3">
						{{ selectedCourse.short_course_description }}
					</p>
					<div class="grid grid-cols-3 gap-4 text-sm">
						<div>
							<span class="text-tutara-600">Antal pladser:</span>
							<span class="ml-2 font-medium text-tutara-900">{{ selectedCourse.totalSeats }}</span>
						</div>
						<div>
							<span class="text-tutara-600">Brugte pladser:</span>
							<span class="ml-2 font-medium text-tutara-900">{{ selectedCourse.usedSeats }}</span>
						</div>
						<div>
							<span class="text-tutara-600">Ledige pladser:</span>
							<span class="ml-2 font-medium text-green-600">{{ selectedCourse.availableSeats }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</BaseModal>
</template>

<style scoped></style>
