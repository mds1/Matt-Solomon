<template>
  <q-page padding>
    <div class="row justify-center" style="max-width: 800px; margin: 0 auto">
      <tool-card
        class="tool-card col-xs-12 col-sm-5"
        to="https://sweeposaurus.com/"
        title="Sweeposaurus"
        description="Sweep all your ETH and ERC-20 tokens to a new address"
        img="sweeposaurus.png"
      />
      <tool-card
        class="tool-card col-xs-12 col-sm-5"
        to="https://cancel-ethereum-transactions.web.app/"
        title="Cancel Transactions"
        description="Easily cancel or speed up Ethereum transactions from any wallet."
        img="easy-button.png"
      />
      <tool-card
        class="tool-card col-xs-12 col-sm-5"
        to="https://betbuds.net"
        title="BetBuds"
        description="Group chat for sports betting—bet with friends, not bookies."
        :img="betbudsLogo"
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
import { defineComponent, ref } from '@vue/composition-api';
import ToolCard from 'components/ToolCard.vue';

export default defineComponent({
  name: 'PageProjects',
  components: { ToolCard },
  setup() {
    // Change BetBuds icon based on dark mode status since it uses a white or black "B"
    // https://stackoverflow.com/questions/56393880/how-do-i-detect-dark-mode-using-javascript
    let betbudsLogo = ref('betbuds-light.png');
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      betbudsLogo.value = 'betbuds-dark.png'; // dark mode
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Listen for changes and update logo when changed
      betbudsLogo.value = e.matches ? 'betbuds-dark.png' : 'betbuds-light.png';
    });
    return { betbudsLogo };
  },
});
</script>

<style lang="sass" scoped>
.tool-card
  margin: 2rem
</style>
