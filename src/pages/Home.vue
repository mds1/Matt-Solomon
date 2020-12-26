<template>
  <q-page padding>
    <div class="horizontal-center text-left" style="max-width: 450px">
      <img src="~assets/logo.png" height="60 rem" class="q-ma-none" style="border-radius: 50%" />
      <h1 class="q-mt-none">Hello.</h1>
      <p>
        I help build awesome things on Ethereum at <a href="https://www.scopelift.co/" target="_blank">ScopeLift</a>.
      </p>
      <p>
        Sometimes I
        <a href="https://blog.mattsolomon.dev/">write</a>, and I also have some
        <router-link :to="{ name: 'projects' }"> side projects</router-link>.
      </p>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import ToolCard from 'components/ToolCard.vue';

export default defineComponent({
  name: 'PageHome',
  components: { ToolCard },
  setup() {
    return {};
  },
});
</script>

<style lang="sass" scoped>
.tool-card
  margin: 2rem
</style>
