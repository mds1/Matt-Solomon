<template>
  <q-layout view="lhh Lpr lFf">
    <q-header class="transparent">
      <q-toolbar>
        <!-- 1: SITE LOGO -->
        <router-link class="no-text-decoration col-xs-3 col-sm-auto" to="/">
          <img src="~assets/logo.png" height="60 rem" class="q-ma-md" style="border-radius: 50%" />
        </router-link>

        <!-- 2: SITE NAME/SUBTITLE -->
        <router-link class="no-text-decoration float-to-left col-xs-8 col-sm-auto" to="/">
          <q-toolbar-title class="site-title">
            Matt Solomon
            <div class="site-subtitle q-mt-sm">Ethereum developer</div>
          </q-toolbar-title>
        </router-link>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'BaseLayout',
  setup() {
    return {};
  },
});
</script>
