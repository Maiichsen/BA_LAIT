<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { getCoursesByCompanyId, getUnusedSeatIds, type CompanyCourseWithStats } from '@/services/companyService.ts';
import { getAllCourses } from '@/services/courseService.ts';
import { createCourseSeat, deleteCourseSeat } from '@/services/seatService.ts';
import type { Course } from '@/types/db.ts';
import BaseModal from '@/components/BaseModal.vue';
import BaseTable from '@/components/BaseTable.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import CheckCircleIcon from '@/assets/icons/CheckCircleIcon.vue';

interface Props {
	isOpen: boolean;
	companyId: string | null;
	startInEditMode?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
	'update:isOpen': [value: boolean];
}>();

// Edit mode state
const isEditMode = ref(false);
const isSaving = ref(false);
const showSuccessState = ref(false);

// Courses data for the selected company
const companyCourses = ref<CompanyCourseWithStats[]>([]);
const isLoadingCourses = ref(false);

// Editable seats data
interface EditableCourse extends CompanyCourseWithStats {
	newTotalSeats: number;
}
const editableCoursesData = ref<EditableCourse[]>([]);

// Available courses for assignment
const allCourses = ref<Course[]>([]);
const selectedNewCourseId = ref<string>('');
const newCourseSeats = ref<number>(1);

// Define courses table columns
const courseTableColumns = ['Kursus',  'Antal pladser', 'Brugte pladser', 'Ledige pladser'] as const;

// Transform courses data to table format
const courseTableRows = computed(() => {
	return companyCourses.value.map(course => [
		course.title,
		course.totalSeats,
		course.usedSeats,
		course.availableSeats,
	]);
});

// Load courses when modal opens or company changes
watch(
	() => [props.isOpen, props.companyId, props.startInEditMode] as const,
	async ([isOpen, companyId, startInEditMode]) => {
		if (isOpen && companyId) {
			// Reset success state when opening modal
			showSuccessState.value = false;
			isLoadingCourses.value = true;
			try {
				companyCourses.value = await getCoursesByCompanyId(companyId);
				// Set edit mode based on prop or reset to false
				if (startInEditMode) {
					isEditMode.value = true;
					// Initialize editable data
					editableCoursesData.value = companyCourses.value.map(course => ({
						...course,
						newTotalSeats: course.totalSeats,
					}));
					// Load all courses for the dropdown
					try {
						allCourses.value = await getAllCourses();
					} catch (error) {
						console.error('Error loading all courses:', error);
					}
				} else {
					isEditMode.value = false;
				}
			} catch (error) {
				console.error('Error loading courses:', error);
				companyCourses.value = [];
			} finally {
				isLoadingCourses.value = false;
			}
		}
	},
	{ immediate: true },
);

// Enter edit mode
const handleConfirm = async () => {
	if (!isEditMode.value) {
		// Enter edit mode
		isEditMode.value = true;
		// Initialize editable data
		editableCoursesData.value = companyCourses.value.map(course => ({
			...course,
			newTotalSeats: course.totalSeats,
		}));

		// Load all courses for the dropdown
		try {
			allCourses.value = await getAllCourses();
		} catch (error) {
			console.error('Error loading all courses:', error);
		}
	} else {
		// Save changes
		await saveChanges();
	}
};

// Cancel edit mode
const handleCancel = () => {
	if (isEditMode.value) {
		isEditMode.value = false;
		editableCoursesData.value = [];
		selectedNewCourseId.value = '';
		newCourseSeats.value = 1;
	} else {
		emit('update:isOpen', false);
	}
};

// Update seats for a course
const updateSeats = (index: number, newValue: string) => {
	const seats = parseInt(newValue);
	if (!isNaN(seats) && editableCoursesData.value[index]) {
		editableCoursesData.value[index].newTotalSeats = seats;
	}
};

// Validate that new total seats is not less than used seats
const validateSeats = (course: EditableCourse): boolean => {
	return course.newTotalSeats >= course.usedSeats;
};

// Get validation error message
const getValidationError = (course: EditableCourse): string | null => {
	if (course.newTotalSeats < course.usedSeats) {
		return `Antal pladser kan ikke være mindre end ${course.usedSeats} (antal brugte pladser)`;
	}
	return null;
};

// Save changes
const saveChanges = async () => {
	if (!props.companyId) return;

	// Validate all courses
	const invalidCourses = editableCoursesData.value.filter(course => !validateSeats(course));
	if (invalidCourses.length > 0) {
		alert('Der er kurser med ugyldige pladser. Antal pladser kan ikke være mindre end antal brugte pladser.');
		return;
	}

	isSaving.value = true;

	try {
		// Update existing courses
		for (const course of editableCoursesData.value) {
			const seatDifference = course.newTotalSeats - course.totalSeats;

			if (seatDifference > 0) {
				// Add seats
				for (let i = 0; i < seatDifference; i++) {
					await createCourseSeat({
						course_id: course.course_id,
						company_id: props.companyId,
						user_id: null,
						reserved_for_email: null,
					});
				}
			} else if (seatDifference < 0) {
				// Remove unused seats
				const seatsToRemove = Math.abs(seatDifference);
				const unusedSeatIds = await getUnusedSeatIds(props.companyId, course.course_id, seatsToRemove);

				for (const seatId of unusedSeatIds) {
					await deleteCourseSeat(seatId);
				}
			}
		}

		// Add new course if selected
		if (selectedNewCourseId.value && newCourseSeats.value > 0) {
			for (let i = 0; i < newCourseSeats.value; i++) {
				await createCourseSeat({
					course_id: selectedNewCourseId.value,
					company_id: props.companyId,
					user_id: null,
					reserved_for_email: null,
				});
			}
		}

		// Reload courses
		companyCourses.value = await getCoursesByCompanyId(props.companyId);

		// Show success state
		isEditMode.value = false;
		showSuccessState.value = true;
		editableCoursesData.value = [];
		selectedNewCourseId.value = '';
		newCourseSeats.value = 1;
	} catch (error) {
		console.error('Error saving changes:', error);
		alert('Der opstod en fejl ved gemning af ændringer.');
	} finally {
		isSaving.value = false;
	}
};

// Get courses not yet assigned to this company
const availableCoursesForAssignment = computed(() => {
	const assignedCourseIds = new Set(companyCourses.value.map(c => c.course_id));
	return allCourses.value.filter(c => !assignedCourseIds.has(c.course_id));
});

// Close modal from success state
const closeFromSuccess = () => {
	showSuccessState.value = false;
	emit('update:isOpen', false);
};
</script>

<template>
	<BaseModal
		:model-value="isOpen"
		@update:model-value="emit('update:isOpen', $event)"
		:title="showSuccessState ? 'Fuldført!' : 'Tildelte kurser'"
		:show-footer="!showSuccessState"
		:confirm-text="isEditMode ? 'Gem ændringer' : 'Administrer'"
		:cancel-text="isEditMode ? 'Annuller' : 'Luk'"
		@confirm="handleConfirm"
		@cancel="handleCancel">
		<div class="space-y-4">
			<!-- Success state: Show success message -->
			<div v-if="showSuccessState" class="flex flex-col items-center justify-center py-8 space-y-6">
				<CheckCircleIcon :width="152" :height="152" fill-class="fill-purple-500" />
				<p class="text-p1 text-tutara-900">Handlingen blev gennemført.</p>
				<BaseButton variant="primary" @click="closeFromSuccess">
					Luk
				</BaseButton>
			</div>

			<!-- View mode: Show table -->
			<div v-else-if="!isEditMode">
				<BaseTable
					:cols="courseTableColumns"
					:rows="courseTableRows"
					:is-loading="isLoadingCourses"
					:has-search="true"
					search-placeholder="Søg kurser..."
					:page-size="5">
				</BaseTable>
			</div>

			<!-- Edit mode: Show editable table -->
			<div v-else class="space-y-6">
				<div class="space-y-4">
					<h3 class="text-lg font-semibold text-tutara-900">Rediger kurser</h3>

					<div class="w-full overflow-x-auto border border-tutara-200 rounded-xl">
						<table class="w-full border-collapse bg-white">
							<thead class="bg-tutara-50 border-b border-tutara-200">
								<tr>
									<th class="py-3.5 px-6 text-left text-p1 text-tutara-900">Navn</th>
									<th class="py-3.5 px-6 text-left text-p1 text-tutara-900">Antal pladser</th>
									<th class="py-3.5 px-6 text-left text-p1 text-tutara-900">Brugte pladser</th>
									<th class="py-3.5 px-6 text-left text-p1 text-tutara-900">Ledige pladser</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="(course, index) in editableCoursesData"
									:key="course.course_id"
									class="border-b border-tutara-200 last:border-b-0 transition-colors hover:bg-purple-10">
									<td class="py-4 px-6 text-p1 text-tutara-900">
									{{ course.title }}
									</td>
									<td class="py-4 px-6 text-p1 text-tutara-900">
										<div>
											<input
												type="number"
												:value="course.newTotalSeats"
												@input="updateSeats(index, ($event.target as HTMLInputElement).value)"
												:min="course.usedSeats"
												class="w-24 px-3 py-2 border border-tutara-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tutara-500"
												:class="{ 'border-red-500': !validateSeats(course) }" />
											<p v-if="getValidationError(course)" class="text-xs text-red-600 mt-1">
												{{ getValidationError(course) }}
											</p>
										</div>
									</td>
									<td class="py-4 px-6 text-p1 text-tutara-900">{{ course.usedSeats }}</td>
									<td class="py-4 px-6 text-p1 text-tutara-900">{{ course.newTotalSeats - course.usedSeats }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<!-- Add new course section -->
				<div class="border-t border-tutara-200 pt-6">
					<h3 class="text-lg font-semibold text-tutara-900 mb-4">Tildel nyt kursus</h3>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-medium text-tutara-700 mb-1">
								Vælg kursus
							</label>
							<select
								v-model="selectedNewCourseId"
								class="w-full px-3 py-2 border border-tutara-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tutara-500"
							>
								<option value="">-- Vælg et kursus --</option>
								<option v-for="course in availableCoursesForAssignment" :key="course.course_id" :value="course.course_id">
									{{ course.title }}
								</option>
							</select>
						</div>

						<div>
							<label class="block text-sm font-medium text-tutara-700 mb-1">
								Antal pladser
							</label>
							<input
								v-model.number="newCourseSeats"
								type="number"
								:min="1"
								:disabled="!selectedNewCourseId"
								class="w-full px-3 py-2 border border-tutara-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tutara-500 disabled:bg-tutara-50 disabled:text-tutara-400"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</BaseModal>
</template>

<style scoped></style>
