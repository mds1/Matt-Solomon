<template>
  <div class="col-auto">
    <q-card @click="openPage(props.to)" class="card-border">
      <q-card-section>
        <div class="card-title row justify-start items-center">
          <img :src="`/tool-img/${props.img}`" class="q-mr-md" style="height:4rem">
          {{ title }}
        </div>
      </q-card-section>

      <q-separator inset />

      <q-card-section class="q-my-md">
        <p class="card-body">{{ description }}</p>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'ToolCard',
  props: {
    to: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    img: { type: String, required: true },
  },
  setup(props, context) {
    async function openPage(to: string) {
      console.log('to: ', to);
      if (to.startsWith('http')) {
        // Open URL
        window.open(to, '_blank');
      } else {
        await context.root.$router.push({ name: to });
      }
    }
    return { props, openPage };
  },
});
</script>
