<script setup lang="ts">
import BaseInput from '@/components/atoms/BaseInput.vue';
import QuestionOption from '@/components/createCourse/quiz/questionOption.vue';
import AddQuestionOption from '@/components/createCourse/quiz/AddQuestionOption.vue';
</script>

<template>
	<div>
		<BaseInput input-type="text" input-id="quizquestion" placeholder="Spørgsmål" />
		<QuestionOption name="test" />
		<QuestionOption name="test" />
		<QuestionOption name="test" />
		<AddQuestionOption />
	</div>
</template>
