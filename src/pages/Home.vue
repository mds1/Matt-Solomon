<template>
  <q-page padding>
    <div class="row justify-center" style="max-width: 800px; margin: 0 auto">
      <tool-card
        class="tool-card col-xs-12 col-sm-5"
        to="https://cancel-ethereum-transactions.web.app/"
        title="Cancel Transactions"
        description="Easily cancel or speed up Ethereum transactions from any wallet."
        img="easy-button.png"
      />
      <tool-card
        class="tool-card col-xs-12 col-sm-5"
        to="https://ethdashboard.com/"
        title="ETH Dashboard"
        description="A customized dashboard for the Ethereum data you care about."
        img="eth-dashboard.png"
      />
      <tool-card
        class="tool-card col-xs-12 col-sm-5"
        to="compound"
        title="Compound Rates"
        description="Figures and stats of Compound's historical lending rates."
        img="compound.svg"
      />
      <tool-card
        class="tool-card col-xs-12 col-sm-5"
        to="https://www.scopelift.co/blog/fakerdao"
        title="FakerDAO"
        description="An exploration of MakerDAO's governance incentives."
        img="fakerdao.png"
      />
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
