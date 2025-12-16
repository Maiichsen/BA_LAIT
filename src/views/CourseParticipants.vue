<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseTable from '@/components/BaseTable.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import { EyeIcon, PencilIcon, TrashIcon, UserPlusIcon } from '@/assets/icons';
import InfoBadge from '@/components/atoms/InfoBadge.vue';
import ToolTip from '@/components/atoms/ToolTip.vue';

interface Participant {
	id: number;
	firstName: string;
	lastName: string;
	status: 'Aktiv' | 'Afventer';
	email: string;
	company: string;
	courses: number;
}

const isLoading = ref(false);

// dummy data - erstarttet med API call når den er klar
const participants = ref<Participant[]>([
	{
		id: 1,
		firstName: 'Mai',
		lastName: 'Jockwich',
		status: 'Aktiv',
		email: 'Mai.Jockwich@example.dk',
		company: 'ScanPipe',
		courses: 5,
	},
	{
		id: 2,
		firstName: 'Anders',
		lastName: 'Nielsen',
		status: 'Aktiv',
		email: 'anders.nielsen@example.dk',
		company: 'ScanPipe',
		courses: 4,
	},
	{
		id: 3,
		firstName: 'Emma',
		lastName: 'Christensen',
		status: 'Aktiv',
		email: 'emma.christensen@example.dk',
		company: 'ALFABO',
		courses: 2,
	},
	{
		id: 4,
		firstName: 'Lars',
		lastName: 'Jensen',
		status: 'Afventer',
		email: 'lars.jensen@example.dk',
		company: 'Aller Aqua',
		courses: 1,
	},
	{
		id: 5,
		firstName: 'Maria',
		lastName: 'Petersen',
		status: 'Aktiv',
		email: 'maria.petersen@example.dk',
		company: 'UCL',
		courses: 4,
	},
	{
		id: 6,
		firstName: 'Michael',
		lastName: 'Rasmussen',
		status: 'Aktiv',
		email: 'michael.rasmussen@example.dk',
		company: 'Mette Munk',
		courses: 2,
	},
	{
		id: 7,
		firstName: 'Sofie',
		lastName: 'Hansen',
		status: 'Aktiv',
		email: 'sofie.hansen@example.dk',
		company: 'Interreg-NPA',
		courses: 5,
	},
	{
		id: 8,
		firstName: 'Peter',
		lastName: 'Andersen',
		status: 'Afventer',
		email: 'peter.andersen@example.dk',
		company: 'Rockwool',
		courses: 3,
	},
]);

const tableData = computed(() => {
	return participants.value.map(participant => [
		participant.firstName,
		participant.lastName,
		participant.status,
		participant.email,
		participant.company,
		participant.courses,
		participant.id,
	]);
});

function viewParticipant(id: number) {
	console.log('View participant:', id);
	// Navigate to participant details or open modal
}

function editParticipant(id: number) {
	console.log('Edit participant:', id);
	// Navigate to edit page or open edit modal
}

function deleteParticipant(id: number) {
	console.log('Delete participant:', id);
	// Show confirmation dialog and delete
}

function addParticipant() {
	console.log('Add new participant');
	// Navigate to create page or open create modal
}
</script>

<template>
	<div class="container">
		<div class="container-row">
			<div class="lg:col-start-2 lg:col-span-11 col-span-full mb-8">
				<h1 class="text-h1">Kursister</h1>
			</div>
			<div class="flex flex-col gap-6 lg:col-start-2 lg:col-span-14 col-span-full">
				<div class="flex justify-between items-center">
					<h2 class="text-h6 text-tutara-900">Brugeroversigt</h2>
					<BaseButton variant="primary" icon-name="UserPlusIcon" @click="addParticipant"> Tilføj kursist </BaseButton>
				</div>

				<BaseTable
					:is-loading="isLoading"
					:page-size="10"
					has-search
					search-placeholder="Søg efter fornavn, efternavn, email..."
					default-sort="Fornavn"
					:cols="['Fornavn', 'Efternavn', 'Status', 'Email', 'Virksomhed', 'Kurser', 'Handlinger']"
					:rows="tableData">
					<template #cell-Status="{ value }">
						<InfoBadge :variant="value === 'Aktiv' ? 'green' : 'gray'">
							{{ value }}
						</InfoBadge>
					</template>

					<template #cell-Kurser="{ value }">
						<div class="flex items-center gap-2 text-tutara-900">
							<span>{{ value }}</span>
							<EyeIcon :width="24" :height="17" fill-class="fill-tutara-900" />
						</div>
					</template>

					<template #cell-Handlinger="{ value }">
						<div class="flex gap-2 items-center">
							<ToolTip text="Tildel kursus">
								<button
									class="flex items-center justify-center w-8 h-8 cursor-pointer"
									@click="viewParticipant(value as number)">
									<UserPlusIcon
										:width="20"
										:height="25"
										fill-class="fill-purple-500"
										stroke-class="stroke-purple-500" />
								</button>
							</ToolTip>
							<ToolTip text="Rediger">
								<button
									class="flex items-center justify-center w-8 h-8 cursor-pointer"
									@click="editParticipant(value as number)">
									<PencilIcon :width="20" :height="20" fill-class="fill-cornflower-blue-500" />
								</button>
							</ToolTip>
							<ToolTip text="Slet">
								<button
									class="flex items-center justify-center w-8 h-8 cursor-pointer"
									@click="deleteParticipant(value as number)">
									<TrashIcon :width="20" :height="20" fill-class="fill-info-red" />
								</button>
							</ToolTip>
						</div>
					</template>
				</BaseTable>
			</div>
		</div>
	</div>
</template>
