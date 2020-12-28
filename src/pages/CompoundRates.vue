<template>
  <q-page padding class="text-center">
    <h1 class="q-mb-sm">Compound Lending Rates</h1>
    <h3 class="q-mt-none">
      Historical APY Data for
      <a href="https://compound.finance" target="_blank" class="hyperlink">Compound</a>
    </h3>

    <div class="horizontal-center" style="max-width: 1000px">
      <!-- USER SETTINGS -->
      <h4 class="text-left">Settings</h4>
      <div class="row justify-between">
        <!-- Dates -->
        <q-card class="col-auto defi-toggles q-pa-lg">
          <p class="text-left"><strong>Start & End Dates</strong></p>

          <!-- Start Date -->
          <q-input
            dense
            hide-bottom-space
            filled
            v-model="userOptions.dates.startDate"
            mask="date"
            :rules="['date']"
            placeholder="Start Date"
            class="q-mb-sm"
            style="max-width: 175px"
          >
            <template v-slot:append>
              <q-icon name="fas fa-calendar-alt" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="userOptions.dates.startDate" @input="() => $refs.qDateProxy.hide()" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <!-- End Date -->
          <q-input
            dense
            hide-bottom-space
            filled
            v-model="userOptions.dates.endDate"
            mask="date"
            :rules="['date']"
            placeholder="End Date"
            class="text-left q-mb-sm"
            style="max-width: 175px"
          >
            <template v-slot:append>
              <q-icon name="fas fa-calendar-alt" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="userOptions.dates.endDate" @input="() => $refs.qDateProxy.hide()" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <p class="text-left q-mt-md q-mb-none">
            <q-btn class="text-left" color="primary" label="Apply" @click="generateTimeSeriesFigure(true)" />
          </p>
        </q-card>

        <!-- Rate types toggle -->
        <q-card class="col-auto defi-toggles q-pa-lg q-pr-xl">
          <p><strong class="text-left">Rate Types</strong></p>
          <p>
            <q-option-group
              v-model="userOptions.rateTypes.group"
              :options="userOptions.rateTypes.options"
              color="primary"
              type="checkbox"
              @input="generateTimeSeriesFigure()"
            />
          </p>
        </q-card>

        <!-- Currencies toggle -->
        <q-card class="col-auto defi-toggles q-pa-lg q-pr-sm">
          <p class="text-left"><strong>Currencies</strong></p>
          <!-- Not using option-group so we have more control over the layout -->
          <p class="row" style="max-width: 475px">
            <q-checkbox
              v-for="(currency, index) in userOptions.currencies"
              :key="currency.address"
              v-model="userOptions.currencies[index].show"
              @input="generateTimeSeriesFigure()"
              class="col-xs-3"
              :label="userOptions.currencies[index].label"
            />
          </p>
        </q-card>
      </div>

      <!-- FIGURES -->
      <h4 class="text-left">Figures</h4>

      <!-- LOADING ANIMATION -->
      <div v-if="!isDataLoaded">
        <div class="horizontal-center text-center">
          <q-spinner-gears size="5rem" color="primary" />
          <h4>Fetching data...</h4>
          <p class="text-italic">This may take a minute. If it's not loading, try refreshing the page.</p>
        </div>
      </div>

      <!-- FIGURES -->
      <!-- We use a v-show so the divs always exist on the DOM -->
      <div v-show="isDataLoaded">
        <q-card class="q-mb-md"> <div id="time-series-figure" /> </q-card>

        <div class="row justify-between q-mb-md">
          <q-card class="col q-mr-sm"> <div id="average-rates-figure" /> </q-card>
          <q-card class="col q-ml-sm"> <div id="box-plot" /> </q-card>
        </div>

        <q-card class="q-mb-md"> <div id="growth-of-investment" /> </q-card>
      </div>

      <br />
    </div>
  </q-page>
</template>

<script lang="js">
import { computed, defineComponent, onMounted, ref } from '@vue/composition-api';
import { date, Dark } from 'quasar';
import Plotly from 'plotly.js-dist';
import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import mean from 'lodash/mean';
import merge from 'lodash/merge';

function useCompoundRates() {

  // Initial parameters for user options
  const userOptions = ref({
    dates: { startDate: '2019/04/01', endDate: date.formatDate(Date.now(), 'YYYY/MM/DD') },
    currencies: [
      { label: 'BAT', show: false, address: '0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e' },
      { label: 'COMP', show: false, address: '0x70e36f6BF80a52b3B46b3aF8e106CC0ed743E8e4' },
      { label: 'DAI', show: true, address: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643' },
      { label: 'ETH', show: false, address: '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5' },
      { label: 'REP', show: false, address: '0x158079ee67fce2f58472a96584a73c7ab9ac95c1' },
      { label: 'SAI', show: false, address: '0xf5dce57282a584d2746faf1593d3121fcac444dc' },
      { label: 'UNI', show: false, address: '0x35A18000230DA775CAc24873d00Ff85BccdeD550' },
      { label: 'USDC', show: true, address: '0x39aa39c021dfbae8fac545936693ac917d5e7563' },
      { label: 'USDT', show: false, address: '0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9' },
      { label: 'WBTC', show: false, address: '0xc11b1268c1a384e55c48c2391d8d480264a3a7f4' },
      { label: 'ZRX', show: false, address: '0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407' },
    ],
    rateTypes: {
      group: ['supply', 'borrow'],
      options: [
        { label: 'Supply', value: 'supply' },
        { label: 'Borrow', value: 'borrow' },
      ],
    },
  });

  // Data
  const isDataLoaded = ref(false); // Loading indicator. True once compoundData has been populated
  const compoundData = ref([]); // Compound data returned form the API, each item in the array has the rates for a currency
  const plottedData = ref([]); // Plotted data, also an array
  const growthOf10k = ref([]); // Growth of 10k plot data

  // Options for the Compound data and plotting
  const numBuckets = '100'; // API call seems to become unreliable as this number increases
  // Default plotly colors, from https://stackoverflow.com/a/44727682
  // Used for plotting colors in order in a loop
  // prettier-ignore
  const colorArray = [ '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf', '#000000' ];
  const lineSettingsTemplate = { line: { width: 3 } };
  const gridcolor = Dark.isActive ? '#ffffff44': '#00000044';
  const axiscolor = Dark.isActive ? '#E1E3E5' : '#222325';
  const layoutTemplate = {
    // Set transparent background
    paper_bgcolor: '#00000000',
    plot_bgcolor: '#00000000',
    font: { color: axiscolor },
    xaxis: { gridcolor, gridwidth: 1, },
    yaxis: { automargin: true, gridcolor, gridwidth: 1, hoverformat: '.2f', },
    // configure plot margins
    margin: { l: 60, r: 50, b: 75, t: 100, pad: 4 },
  };

  // Computed properties
  const compoundMinBlockTimestamp = computed(() => {
    const d = userOptions.value.dates.startDate.split('/');
    const startDateObject = date.buildDate({ year: Number(d[0]), month: Number(d[1]), date: Number(d[2]) });
    return String(date.formatDate(startDateObject, 'X'));
  });
  const compoundMaxBlockTimestamp = computed(() => {
    const d = userOptions.value.dates.endDate.split('/');
    const startDateObject = date.buildDate({ year: Number(d[0]), month: Number(d[1]), date: Number(d[2]) });
    return String(date.formatDate(startDateObject, 'X'));
  });

  // Merge provided layout parameters with our template parameters
  const mergeLayout = (layout) => merge(layout, layoutTemplate);

  // Take a specific plots data and layout parameters and merge them with the template parameters
  const prepareLinePlot = (data, layout) => {
    // For each data source, merge the settings
    const finalData = [];
    for (let i = 0; i < data.length; i += 1) {
      finalData[i] = merge(data[i], lineSettingsTemplate);
    }
    // Merge layout settings
    const finalLayout = mergeLayout(layout);
    return { finalData, finalLayout };
  };

  onMounted(() => generateTimeSeriesFigure());

  // Fetch data from Compound's API for all assets
  async function getCompoundData() {
    // Set status flag to mention we don't have data
    isDataLoaded.value = false;

    // Call API for each asset
    // First we add all API requests to an array
    const url = 'https://api.compound.finance/api/v2/market_history/graph';
    const promises = [];
    userOptions.value.currencies.forEach((currency) => {
      promises.push(
        axios.get(url, {
          params: {
            asset: String(currency.address),
            min_block_timestamp: String(compoundMinBlockTimestamp.value),
            max_block_timestamp: String(compoundMaxBlockTimestamp.value),
            num_buckets: String(numBuckets),
          },
        })
      );
    });

    // Then we fetch all promises
    compoundData.value = await Promise.all(promises);
    isDataLoaded.value = true;
  }

  /**
   * Use Compound API response to generate plots
   * @param fetchData If true, data is re-fetched instead of using cached data
   */
  async function generateTimeSeriesFigure(fetchData = false) {
    // Call API if data isn't cached -------------------------------------------------------------
    if (isEmpty(compoundData.value) || fetchData) {
      await getCompoundData();
    }

    // Configure data for plotting ---------------------------------------------------------------
    const numberOfCurrencies = userOptions.value.currencies.length;
    let plotColorCount = 0;
    const supplyTraces = [];
    const borrowTraces = [];
    const currencyNames = [];

    userOptions.value.currencies.forEach((currency, i) => {
      // Only plot checked items
      if (!currency.show) return;

      // Get rates, dates, and generate legend labels
      const supplyData = compoundData.value[i].data.supply_rates;
      const borrowData = compoundData.value[i].data.borrow_rates;

      const supplyRates = supplyData.map((obj) => obj.rate * 100);
      const borrowRates = borrowData.map((obj) => obj.rate * 100);

      const supplyDates = supplyData.map((obj) => new Date(obj.block_timestamp * 1000));
      const borrowDates = borrowData.map((obj) => new Date(obj.block_timestamp * 1000));

      const currencyName = userOptions.value.currencies[i].label;
      const supplyLegendLabel = `${currencyName} Supply Rate`;
      const borrowLegendLabel = `${currencyName} Borrow Rate`;

      // Add data for supply trace
      if (userOptions.value.rateTypes.group.includes('supply')) {
        supplyTraces.push({
          x: supplyDates,
          y: supplyRates,
          type: 'lines',
          name: supplyLegendLabel,
          marker: { color: colorArray[plotColorCount] },
        });
        currencyNames.push(currencyName);
      } // end if supply

      // Add data for borrow trace
      if (userOptions.value.rateTypes.group.includes('borrow')) {
        borrowTraces.push({
          x: borrowDates,
          y: borrowRates,
          type: 'lines',
          name: borrowLegendLabel,
          marker: { color: colorArray[plotColorCount] },
          // Show dashed line if we are also plotting supply
          line: { dash: userOptions.value.rateTypes.group.includes('supply') ? 'dot' : 'solid' },
        });

        currencyNames.push(currencyName);
      } // end if borrow

      plotColorCount += 1; // move to the next plot color
    }); // end for each currency

    const layout = {
      title: 'Compound Interest Rates (APY)',
      xaxis: { title: 'Date' },
      yaxis: { title: 'Rate', ticksuffix: '%' },
    };

    // Generate plot -----------------------------------------------------------------------------
    isDataLoaded.value = true;
    const data = [];
    const plottedData = [];

    if (userOptions.value.rateTypes.group.includes('supply') && userOptions.value.rateTypes.group.includes('borrow')) {
      // If user requests supply and borrow, add both to our stored data
      // Alternate suply and borrow arrays such that all lines for an asset are paired
      for (let i = 0; i < supplyTraces.length; i += 1) {
        data.push(supplyTraces[i], borrowTraces[i]);
        plottedData.push(
          { data: supplyTraces[i], name: currencyNames[i] },
          { data: borrowTraces[i], name: currencyNames[i] }
        );
      }
    } else if (userOptions.value.rateTypes.group.includes('supply')) {
      // If user only requested supply
      for (let i = 0; i < supplyTraces.length; i += 1) {
        data.push(supplyTraces[i]);
        plottedData.push({ data: supplyTraces[i], name: currencyNames[i] });
      }
    } else if (userOptions.value.rateTypes.group.includes('borrow')) {
      // If user only requested borrow
      for (let i = 0; i < borrowTraces.length; i += 1) {
        data.push(borrowTraces[i]);
        plottedData.push({ data: borrowTraces[i], name: currencyNames[i] });
      }
    }

    plottedData.value = data;
    const { finalData, finalLayout } = prepareLinePlot(data, layout);
    Plotly.newPlot('time-series-figure', finalData, finalLayout, { responsive: true });

    // Generate other plots
    generateAverageRatePlot(plottedData.value);
    generateBoxPlot(plottedData.value);
    generateGrowthOfInvestmentPlot(supplyTraces);
  }

  /**
   * @notice Compute and plots averate rates for selected assets, calculated as CAGR
   */
  function generateAverageRatePlot(plottedData) {
    // Define arrays to hold data
    const currencyNames = [];
    const supplyRates = [];
    const borrowRates = [];

    for (let i = 0; i < plottedData.length; i += 1) {
      // Parse out data
      const data = plottedData[i];
      const { x: timestamps, y: rates } = data;

      // Get start and end values
      // TODO this is very similar to how growth of 10k plot is generated, so refactor
      // to be more modular
      const initialValue = 10000;
      const values = [initialValue];
      for (let j = 0; j < timestamps.length - 1; j += 1) {
        // In above loop, we use length-1 to skip last value because we use j+1 for deltas
        const deltaT = (timestamps[j + 1].getTime() - timestamps[j].getTime()) / 1000; // in sec
        const presentValue = values[values.length - 1];
        const rate = rates[j] / 100 / 365 / 24 / 3600; // per-second interest rate
        const n = 1; // Math.floor(deltaT / 15); // number of times interest applied per period
        const t = deltaT; // number of time periods elapsed
        const newValue = presentValue * (1 + rate / n) ** (n * t);
        values.push(newValue);
      }

      const startDate = new Date(timestamps[0]).getTime() / 1000;
      const endDate = new Date(timestamps[timestamps.length - 1]).getTime() / 1000;
      const secondsElapsed = endDate - startDate;

      const secondsPerYear = 365.25 * 24 * 3600;
      const numYears = secondsElapsed / secondsPerYear;

      const startValue = values[0];
      const endValue = values[values.length - 1];

      const averageRate = 100 * ((endValue / startValue) ** (1 / numYears) - 1);

      // Get name data
      const nameComponents = data.name.split(' ');
      const currencyName = nameComponents[0];
      const rateType = nameComponents[1].toLowerCase();

      // Update arrays
      if (!currencyNames.includes(currencyName)) currencyNames.push(currencyName);
      if (rateType === 'supply') supplyRates.push(averageRate);
      else borrowRates.push(averageRate);
    } // end for each set of plotted data

    // Generate plots
    const data = [];
    if (userOptions.value.rateTypes.group.includes('supply')) {
      data.push({ x: currencyNames, y: supplyRates, name: 'Supply', type: 'bar' });
    }
    if (userOptions.value.rateTypes.group.includes('borrow')) {
      data.push({ x: currencyNames, y: borrowRates, name: 'Borrow', type: 'bar' });
    }

    const layout = {
      barmode: 'group',
      title: 'Average Interest Rates (APY)',
      paper_bgcolor: '#00000000',
      plot_bgcolor: '#00000000',
      font: { color: axiscolor },
      xaxis: { title: 'Currency' },
      yaxis: { title: 'Rate', ticksuffix: '%', hoverformat: '.2f' },
    };

    Plotly.newPlot('average-rates-figure', data, layout, { responsive: true });
  }

  /**
   * Generates box plots of selected assets
   */
  function generateBoxPlot(plottedData) {
    const traces = [];
    const supplyX = [];
    const supplyY = [];
    const borrowX = [];
    const borrowY = [];
    for (let i = 0; i < plottedData.length; i += 1) {
      // Get rates
      const data = plottedData[i];
      const rates = data.y;

      // Get name data
      const nameComponents = data.name.split(' ');
      const currencyName = nameComponents[0];
      const rateType = nameComponents[1].toLowerCase();

      if (rateType === 'supply') {
        rates.forEach(() => supplyX.push(currencyName));
        rates.forEach((rate) => supplyY.push(rate));
      } else {
        rates.forEach(() => borrowX.push(currencyName));
        rates.forEach((rate) => borrowY.push(rate));
      }
    } // end for each set of plotted data

    if (userOptions.value.rateTypes.group.includes('supply')) {
      traces.push({
        x: supplyX,
        y: supplyY,
        name: 'Supply',
        type: 'box',
        boxpoints: 'all',
        jitter: 0.3,
        pointpos: -1.5,
        marker: { size: 2 },
      });
    }
    if (userOptions.value.rateTypes.group.includes('borrow')) {
      traces.push({
        x: borrowX,
        y: borrowY,
        name: 'Borrow',
        type: 'box',
        boxpoints: 'all',
        jitter: 0.3,
        pointpos: -1.5,
        marker: { size: 2 },
      });
    }

    const layout = {
      title: 'Interest Rate Distribution (APY)',
      paper_bgcolor: '#00000000',
      plot_bgcolor: '#00000000',
      font: { color: axiscolor },
      xaxis: { title: 'Currency' },
      yaxis: { title: 'Rate', ticksuffix: '%', hoverformat: '.2f' },
      boxmode: 'group',
    };

    Plotly.newPlot('box-plot', traces, layout, { responsive: true });
  }

  /**
   * Generate growth of investment plot
   */
  function generateGrowthOfInvestmentPlot(supplyTraces) {
    const traces = [];
    for (let j = 0; j < supplyTraces.length; j += 1) {
      const data = supplyTraces[j];
      const { x: timestamps, y: rates } = data;

      const initialValue = 10000;
      const values = [initialValue];
      for (let i = 0; i < timestamps.length - 1; i += 1) {
        // In above loop, we use length-1 to ignore the current rate
        const deltaT = (timestamps[i + 1].getTime() - timestamps[i].getTime()) / 1000; // in sec
        const presentValue = values[values.length - 1];
        const rate = rates[i] / 100 / 365 / 24 / 3600; // per-second interest rate
        const n = 1; // Math.floor(deltaT / 15); // number of times interest applied per period
        const t = deltaT; // number of time periods elapsed
        const newValue = presentValue * (1 + rate / n) ** (n * t);
        values.push(newValue);
      }

      traces.push({
        x: timestamps,
        y: values,
        type: 'scatter',
        mode: 'lines',
        name: supplyTraces[j].name.split(' ')[0], // e.g. DAI Supply Rate -> Dai
      });
    }

    // Save off values so we can use them for computing average rates
    growthOf10k.value = traces;

    // Generate figure
    const layout = {
      title: 'Growth of $10,000',
      xaxis: { title: 'Date' },
      yaxis: { title: 'Value', tickprefix: '$' },
    };
    const { finalData, finalLayout } = prepareLinePlot(traces, layout);
    Plotly.newPlot('growth-of-investment', finalData, finalLayout, { responsive: true });
  }
  return { userOptions, isDataLoaded, generateTimeSeriesFigure };
}

export default defineComponent({
  name: 'PageCompoundRates',
  setup() {
    return { ...useCompoundRates() };
  },
});
</script>
