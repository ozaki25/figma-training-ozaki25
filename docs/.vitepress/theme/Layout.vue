<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import LessonNav from './components/LessonNav.vue'
import GoalChecklist from './components/GoalChecklist.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #doc-before>
      <LessonNav />
    </template>
    <template #doc-after>
      <GoalChecklist />
    </template>
  </Layout>
</template>
