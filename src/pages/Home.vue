<template>
  <q-page padding>
    <router-link class="no-text-decoration col-xs-3 col-sm-auto" :to="{ name: 'compound' }">
      Compound Rates
    </router-link>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'PageHome',
  setup() {
    return {};
  },
});
</script>
