<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useCourseEditorStore } from '@/stores/courseEditorStore.ts';
import { CertificateIcon, ContentIcon, QuizIcon } from '@/assets/icons';
import { isDemo } from '@/db/connection.ts';

const router = useRouter();
const courseStore = useCourseEditorStore();

const handleCreateNewTextPage = () => {
	courseStore
		.addNewPageTypeArticle()
		.then(coursePage => {
			router.push({ name: 'courseEditorPage', params: { page_id: coursePage.course_page_id } });
		})
		.catch(err => console.log(err));
};

const handleCreateNewQuizPage = () => {
	courseStore
		.addNewPageTypeQuiz()
		.then(coursePage => {
			router.push({ name: 'courseEditorPage', params: { page_id: coursePage.course_page_id } });
		})
		.catch(err => console.log(err));
};
</script>

<template>
	<div class="flex border border-tutara-200 bg-white">
		<p @click="handleCreateNewTextPage" class="cursor-pointer py-4 px-8 hover:bg-purple-10 flex gap-2 text-p1">
			<ContentIcon /> Tilføj indhold
		</p>
		<!-- The quiz editor was never finished, so the demo hides these -->
		<p
			v-if="!isDemo"
			@click="handleCreateNewQuizPage"
			class="cursor-pointer py-4 px-8 hover:bg-purple-10 flex gap-2 text-p1">
			<QuizIcon /> Tilføj quiz
		</p>
		<p
			v-if="!isDemo"
			@click="handleCreateNewQuizPage"
			class="cursor-pointer py-4 px-8 hover:bg-purple-10 flex gap-2 text-p1">
			<CertificateIcon /> Tilføj slut-test
		</p>
	</div>
</template>
