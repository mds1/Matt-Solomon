<template>
  <q-page padding>
    <p class="horizontal-center" style="max-width: 400px">
      <q-list>
        <!-- Email -->
        <q-item>
          <q-item-section avatar>
            <q-icon color="darktext" name="fas fa-envelope" />
          </q-item-section>

          <q-item-section class="text-left">
            <div><a class="hyperlink" href="mailto:matt@mattsolomon.dev">matt@mattsolomon.dev</a> by email</div>
          </q-item-section>
        </q-item>

        <!-- Twitter -->
        <q-item>
          <q-item-section avatar>
            <q-icon class="twitter" name="fab fa-twitter" />
          </q-item-section>

          <q-item-section class="text-left">
            <div>
              <a class="hyperlink" href="https://twitter.com/msolomon44" target="_blank">@msolomon44</a> on Twitter
            </div>
          </q-item-section>
        </q-item>

        <!-- Telegram -->
        <q-item>
          <q-item-section avatar>
            <q-icon class="telegram" name="fab fa-telegram" />
          </q-item-section>

          <q-item-section class="text-left">
            <div><a class="hyperlink" href="@msolomon4" target="_blank">@msolomon4</a> on Telegram</div>
          </q-item-section>
        </q-item>

        <!-- GitHub -->
        <q-item>
          <q-item-section avatar>
            <q-icon class="github" name="fab fa-github" />
          </q-item-section>

          <q-item-section class="text-left">
            <div><a class="hyperlink" href="https://github.com/mds1" target="_blank">@mds1</a> on GitHub</div>
          </q-item-section>
        </q-item>
      </q-list>
    </p>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import ToolCard from 'components/ToolCard.vue';

export default defineComponent({
  name: 'PageContact',
  components: { ToolCard },
  setup() {
    return {};
  },
});
</script>

<style lang="sass" scoped>
.github
  color: #211F1F
  @media (prefers-color-scheme: dark)
    color: invert(#211F1F)

.telegram
  color: #0088cc

.twitter
  color: #1DA1F2
</style>
