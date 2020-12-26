<template>
  <q-layout view="lhh Lpr lFf" class="main-container">
    <q-header class="transparent q-mx-md q-pt-md">
      <q-toolbar>
        <!-- HEADER LINKS -->
        <div class="row justify-start">
          <router-link active-class="active-header-item" class="col-auto header-item" exact :to="{ name: 'home' }">
            Home
          </router-link>
          <router-link active-class="active-header-item" class="col-auto header-item" exact :to="{ name: 'projects' }">
            Projects
          </router-link>
          <a href="https://blog.mattsolomon.dev/" class="col-auto header-item"> Blog </a>
          <router-link active-class="active-header-item" class="col-auto header-item" exact :to="{ name: 'contact' }">
            Contact
          </router-link>
        </div>
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
