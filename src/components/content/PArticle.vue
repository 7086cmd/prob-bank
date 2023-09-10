<script lang="ts" setup>
/* global defineProps */
import type { ArticleContent } from '@/../@types/content'
import PContent from './PContent.vue'
import { toRefs } from 'vue'

const props = defineProps<{
  article: ArticleContent['article']
}>()

const { article } = toRefs(props)
</script>

<template>
  <div class="all pl-8" style="width: 100%">
    <p v-if="article.title" style="text-align: center">
      <span v-if="article.language === 'en'" class="title-en">{{
        article.title
      }}</span>
      <span v-else class="title">{{ article.title }}</span>
    </p>
    <p v-if="article.author" style="text-align: center">
      <span v-if="article.language === 'en'" class="author-en"
        >——{{ article.author }}</span
      >
      <span v-else class="author">{{ article.author }}</span>
    </p>
    <p v-for="(line, idx) in article.content" :key="idx">
      <!-- eslint-disable-next-line no-irregular-whitespace -->
      <span>　　</span>
      <PContent
        v-if="article.language === 'en'"
        class="article-en"
        :content="[{ type: 'text', content: line }]"
        prompt
        english
        :full-italic="article.align === 'center'"
      />
      <PContent
        v-else
        class="article"
        :content="[{ type: 'text', content: line }]"
        prompt
      />
    </p>
  </div>
</template>

<style scoped>
.all {
  width: 100%;
}
.article {
  font-family: '方正楷体' !important;
}

.article-en {
  font-family: 'Times New Roman', 'Source Han Serif SC' !important;
  font-weight: bold;
}

.title {
  font-family: 'Source Han Sans SC';
}

.title-en {
  font-family: 'Times New Roman', 'Source Han Sans SC';
  font-weight: bold;
}

.author {
  text-align: center;
  font-family: '方正仿宋';
}

.author-en {
  text-align: center;
  font-family: 'Times New Roman', '方正仿宋';
  font-style: italic;
}
</style>
