<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import LessonNav from './components/LessonNav.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #doc-before>
      <LessonNav />
    </template>
  </Layout>
</template>
