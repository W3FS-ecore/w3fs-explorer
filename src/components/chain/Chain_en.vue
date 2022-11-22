<template>
  <div class="container">
    <h1>
      <i class="fa fa-server"></i> Ethereum Information
      <small>View information about the Ethereum Blockchain</small>
    </h1>
    <section>
      <div class="column">
        <div class="first">Summary</div>
        <div class="last"></div>
      </div>
      <div class="column">
        <div class="first">Current Block</div>
        <div class="last">
          <router-link :to="'/block/' + blockNum">
            {{ blockNum }}
          </router-link>
        </div>
      </div>
      <div class="column">
        <div class="first">Block Time</div>
        <div class="last">
          {{ blocktime }}seconds since block
          <router-link :to="'/block/' + (blockNum - 1)">
            {{ blockNum - 1 }}
          </router-link>
        </div>
      </div>
      <div class="column">
        <div class="first">Block Time Averages</div>
        <div class="last">
          <table style="width: 100%">
            <tbody>
              <tr>
                <td>
                  {{ blocktimeAverage1 }} seconds for the past 100 blocks<br />
                  {{ blocktimeAverage2 }} seconds for the past 1,000 blocks
                </td>
                <td>
                  {{ blocktimeAverage3 }} seconds for the past 10,000 blocks<br />
                  {{ blocktimeAverage4 }} seconds for the past 100,000 blocks
                </td>
              </tr>
              <tr>
                <td>
                  {{ blocktimeAverageAll }} seconds for all
                  {{ blockNum }} blocks
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="column">
        <div class="first">Current Difficulty</div>
        <div class="last">{{ difficulty_formatted }}</div>
      </div>
      <div class="column">
        <div class="first">Total Difficulty</div>
        <div class="last">{{ totalDifficulty_formatted }}</div>
      </div>
      <div class="column">
        <div class="first">Gas Limit</div>
        <div class="last">{{ gasLimit }}</div>
      </div>
      <div class="column">
        <div class="first">Time</div>
        <div class="last">{{ time }}</div>
      </div>
      <div class="column">
        <div class="first">Connected to ETH Network</div>
        <div class="last">{{ isConnected }}</div>
      </div>
      <div class="column">
        <div class="first">API/Client Version</div>
        <div class="last">{{ versionApi }} - {{ versionClient }}</div>
      </div>
    </section>
  </div>
</template>

<script>
var BigNumber = require("bignumber.js");
export default {
  name: "Chain",
  data() {
    return {
      blockNum: "",
      difficulty_formatted: "",
      totalDifficulty_formatted: "",
      gasLimit: "",
      time: "",
      blocktime: "",
      //
      blocktimeAverage1: "",
      blocktimeAverage2: "",
      blocktimeAverage3: "",
      blocktimeAverage4: "",
      blocktimeAverageAll: "",
      //
      isConnected: "",
      versionApi: "",
      versionClient: "",
      // versionNetwork: "",
      // versionCurrency: "",
      // versionWhisper: "",
    };
  },
  created() {
    this.getChainInfos();
  },
  methods: {
    getChainInfos() {
      this.blockNum = this.$web3.eth.blockNumber; // now that was easy
      if (this.blockNum) {
        // TODO: put the 2 web3.eth.getBlock into the async function below
        //       easiest to first do with fastInfosCtrl
        var blockNewest = this.$web3.eth.getBlock(this.blockNum);
        if (blockNewest) {
          // large numbers still printed nicely:
          this.difficulty_formatted = blockNewest.difficulty.toFormat(0);
          this.totalDifficulty_formatted =
            blockNewest.totalDifficulty.toFormat(0);

          // Gas Limit
          this.gasLimit =
            new BigNumber(blockNewest.gasLimit).toFormat(0) + " m/s";

          // Time
          var newDate = new Date();
          newDate.setTime(blockNewest.timestamp * 1000);
          this.time = newDate.toUTCString();

          // Average Block Times:
          // TODO: make fully async, put below into 'fastInfosCtrl'
          var blockPast;
          var blockBefore = this.$web3.eth.getBlock(this.blockNum - 1);
          if (blockBefore) {
            this.blocktime = blockNewest.timestamp - blockBefore.timestamp;
          }
          var range1 = 100;
          blockPast = this.$web3.eth.getBlock(
            Math.max(this.blockNum - range1, 0)
          );
          if (blockBefore) {
            this.blocktimeAverage1 = (
              (blockNewest.timestamp - blockPast.timestamp) /
              range1
            ).toFixed(2);
          }
          var range2 = 1000;
          blockPast = this.$web3.eth.getBlock(
            Math.max(this.blockNum - range2, 0)
          );
          if (blockBefore) {
            this.blocktimeAverage2 = (
              (blockNewest.timestamp - blockPast.timestamp) /
              range2
            ).toFixed(2);
          }
          var range3 = 10000;
          blockPast = this.$web3.eth.getBlock(
            Math.max(this.blockNum - range3, 0)
          );
          if (blockBefore) {
            this.blocktimeAverage3 = (
              (blockNewest.timestamp - blockPast.timestamp) /
              range3
            ).toFixed(2);
          }
          var range4 = 100000;
          blockPast = this.$web3.eth.getBlock(
            Math.max(this.blockNum - range4, 0)
          );
          if (blockBefore) {
            this.blocktimeAverage4 = (
              (blockNewest.timestamp - blockPast.timestamp) /
              range4
            ).toFixed(2);
          }

          blockPast = this.$web3.eth.getBlock(1);
          if (blockBefore) {
            this.blocktimeAverageAll = (
              (blockNewest.timestamp - blockPast.timestamp) /
              this.blockNum
            ).toFixed(2);
          }
        }
      }
      // Block Explorer Info
      this.isConnected = this.$web3.isConnected();
      this.versionApi = this.$web3.version.api;
      this.versionClient = this.$web3.version.node;
      // this.versionNetwork = this.$web3.version.network;
      // this.versionCurrency = this.$web3.version.ethereum; // TODO: change that to currencyname?

      // ready for the future:
      // try {
      //   this.versionWhisper = this.$web3.version.whisper;
      // } catch (err) {
      //   this.versionWhisper = err.message;
      // }
    },
  },
};
</script>
