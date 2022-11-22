<template>
  <div class="home-tpl">
    <div class="banner">
      <!-- <img src="../../assets/bg.png" alt="" /> -->
      <div class="container banner-img">
        <div class="circle">
          <div class="circle1">&nbsp;</div>
          <div class="circle2">&nbsp;</div>
          <div class="circle3">&nbsp;</div>
          <div class="center">
            <img src="../../assets/hexagon.png" alt="" />
          </div>
        </div>
      </div>

      <div class="search container">
        <div class="search-txt">
          <p class="home-title">W3FS Chain Explorer</p>
          <el-input
            placeholder="Tx Hash, Address, or Block #"
            v-model="ethRequest"
          >
            <el-button slot="suffix" class="search-btn" @click="processRequest"
              ><i class="icon-search"></i
            ></el-button>
          </el-input>
        </div>
      </div>
    </div>
    <div class="container">
      <el-row class="overview-wrap">
        <el-col :xs="12" :sm="8" :md="4"
          ><div class="overview">
            <p>
              {{ currentBlockNumber || "Loading.." }}
            </p>
            <span> Current Block </span>
          </div></el-col
        >
        <el-col :xs="12" :sm="8" :md="4"
          ><div class="overview">
            <p>
              {{ ethprice || "Loading.." }}
            </p>
            <span>W3FS/USD Price </span>
          </div></el-col
        >
        <el-col :xs="12" :sm="8" :md="4"
          ><div class="overview">
            <p>
              {{ gasLimit || "Loading.." }}
            </p>
            <span>Gas Limit (m/s)</span>
          </div></el-col
        >
        <el-col :xs="12" :sm="8" :md="4"
          ><div class="overview">
            <p>
              {{ blocktime ? blocktime + " second" : false || "Loading.." }}
            </p>
            <span>Block Time (s)</span>
          </div></el-col
        >
        <el-col :xs="12" :sm="8" :md="4"
          ><div class="overview">
            <p>
              {{ difficulty || "Loading.." | diffFormat }}
            </p>
            <span>Current Diff</span>
          </div></el-col
        >
        <el-col :xs="12" :sm="8" :md="4"
          ><div class="overview">
            <p>
              <!-- {{ hashrate  | hashFormat }} -->
              {{ hashrate }}
            </p>
            <span>Hashrate (Hash/s)</span>
          </div></el-col
        >
      </el-row>
    </div>
    <section class="container">
      <el-row :gutter="30">
        <el-col :xs="24" :sm="24" :md="12">
          <div class="table-title">Recent Blocks</div>
          <div class="table-con">
            <el-table
              :data="blocks"
              header-row-class-name="table-header"
              cell-class-name="table-cell"
              :header-cell-style="{ 'text-align': 'center' }"
            >
              <el-table-column label="Block">
                <template slot-scope="scope">
                  <router-link
                    class="clickable"
                    :to="'/block/' + scope.row.number"
                  >
                    {{ scope.row.number }}
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column label="Size">
                <template slot-scope="scope">
                  {{ scope.row.size | sizeFormat }}
                </template>
              </el-table-column>
              <el-table-column prop="transactions.length" label="Txs Counts">
              </el-table-column>
              <el-table-column label="Age">
                <template slot-scope="scope">
                  {{ (scope.row.timestamp * 1000) | timestampAge }}
                </template>
              </el-table-column>
              <div slot="append" v-if="blocks.length" class="table-view">
                <p @click="goLink('Blocks')">View all</p>
              </div>
            </el-table>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12">
          <div class="table-title">Recent Transactions</div>
          <div class="table-con">
            <el-table
              :data="recenttransactions"
              header-row-class-name="table-header"
              cell-class-name="table-cell"
              :header-cell-style="{ 'text-align': 'center' }"
            >
              <el-table-column label="Hash" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <router-link class="clickable" :to="'/tx/' + scope.row.hash">
                    {{ scope.row.hash || "" }}
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column label="From" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <router-link
                    class="clickable"
                    :to="'/address/' + scope.row.from"
                  >
                    {{ scope.row.from || "" }}
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column label="To" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <router-link
                    class="clickable"
                    :to="'/address/' + scope.row.to"
                  >
                    {{ scope.row.to || "" }}
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column label="Reward (W3FS)">
                <template slot-scope="scope">
                  {{ scope.row.Reward || 0 }}
                </template>
              </el-table-column>
              <el-table-column label="Age">
                <template slot-scope="scope">
                  {{ (scope.row.timestamp * 1000) | timestampAge }}
                </template>
              </el-table-column>
              <div
                slot="append"
                v-if="recenttransactions.length"
                class="table-view"
              >
                <p @click="goLink('Transactions')">View all</p>
              </div>
            </el-table>
          </div>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script>
import Fn from "../../utils/fn";
var BigNumber = require("bignumber.js");
export default {
  name: "Home",
  data() {
    return {
      ethRequest: "",
      blocks: [],
      recenttransactions: [],
      currentBlockNumber: "",
      ethprice: "0",
      gasLimit: "",
      blocktime: "",
      difficulty: "",
      hashrate: "",
      //
      getLatest: null,
      //txs
      curBlock: 0,
      getNumber: 0,
    };
  },
  created() {
    clearInterval(this.getLatest);
    this.homeInit();

    this.getLatest = setInterval(() => {
      this.homeInit();
    }, 10000);
  },
  destroyed() {
    clearInterval(this.getLatest);
  },
  methods: {
    homeInit() {
      this.getBlockNumber();
      // this.getETHRates();
      this.getHashrate();
    },
    processRequest() {
      Fn.processRequest(this.ethRequest, this.$router);
    },
    goLink(name) {
      this.$router.push({
        name: name,
      });
    },

    async getETHRates() {
      let json = await this.$http.get(
        process.env.NODE_ENV == "development"
          ? this.$api.urlETHRates
          : this.$store.state.coincap + this.$api.urlETHRates
      );
      if (json) {
        var price = Number(json.data[1].priceUsd);
        this.ethprice = "$" + price.toFixed(2);

        var btcprice = Number(json.data[0].priceUsd);
        this.ethbtcprice = btcprice;

        var cap = Number(json.data[1].marketCapUsd);
        this.ethmarketcap = cap;
      }
    },
    async getHashrate() {
      this.$web3.eth.getHashrate((err, hashrate) => {
        if (!err) {
          this.hashrate = hashrate;
        }
      });
      // let json = await this.$http.get(this.$api.urlHashrate);
      // if (json) {
      //   var hr = json.hashrate;
      //   this.hashrate = hr;
      // }
    },
    getBlockNumber() {
      this.$web3.eth.getBlockNumber((err, blockNum) => {
        if (err) return console.log(err);
        this.curBlock = blockNum;
        if (blockNum) {
          this.updateStats(blockNum);
          this.updateTXList(blockNum);
          this.updateBlockList(blockNum);
        }
      });
    },
    updateStats(blockNum) {
      this.$web3.eth.getBlock(blockNum, (err, blockNewest) => {
        if (err) return console.log(err);
        if (blockNewest) {
          // difficulty
          this.difficulty = blockNewest.difficulty;

          // Gas Limit
          this.gasLimit = new BigNumber(blockNewest.gasLimit).toFormat(0);

          this.$web3.eth.getBlock(blockNum - 1, (err, blockBefore) => {
            if (err) return console.log(err);
            this.blocktime = blockNewest.timestamp - blockBefore.timestamp;
          });
        }
      });
    },
    updateTXList() {
      this.$web3.eth.getBlockNumber((err, blockNum) => {
        if (err) return console.log(err);
        if (blockNum) {
          this.recenttransactions = [];
          this.getNumber = blockNum;
          this.getTransactionsFromBlock(blockNum);
        }
      });
    },
    getTransactionsFromBlock(blockNumber) {
      this.$web3.eth.getBlock(blockNumber, true, (err, block) => {
        if (err) {
          console.log(err);
          return this.getTransactionsFromBlock(blockNumber);
        }

        var transInBlock = [];
        var loopLimit = 10;

        if (loopLimit > block.transactions.length)
          loopLimit = block.transactions.length;
        if (loopLimit <= 0) {
          if (this.getNumber - blockNumber > 15) return;
          this.getTransactionsFromBlock(--blockNumber);
        } else {
          for (var i = 0; i < loopLimit; i++) {
            transInBlock.push(block.transactions[i]);

            if (i === loopLimit - 1) {
              this.recenttransactions =
                this.recenttransactions.concat(transInBlock);
              if (this.recenttransactions.length <= 10 && blockNumber > 0)
                this.getTransactionsFromBlock(--blockNumber);
            }
          }
        }
      });
    },
    updateBlockList(currentBlockNumber) {
      if (currentBlockNumber == this.currentBlockNumber) return;
      this.currentBlockNumber = currentBlockNumber;
      var num = this.blocks.length - 10;
      var short = currentBlockNumber + num + 1;
      if (num == -10) {
        currentBlockNumber = short > 0 ? short : currentBlockNumber;
      } else {
        var count = currentBlockNumber - this.blocks[0].number;
        if (num >= 0) {
          if (count - 10 > 0) {
            currentBlockNumber = currentBlockNumber - 9;
          } else {
            currentBlockNumber = currentBlockNumber - count + 1;
          }
        } else {
          if (count > 0) {
            currentBlockNumber = short > 0 ? short : currentBlockNumber;
          }
        }
      }
      this.getBlockDetails(currentBlockNumber);
    },
    getBlockDetails(blockNumber) {
      this.$web3.eth.getBlock(blockNumber, (err, block) => {
        if (err) {
          console.log(err);
          return this.getBlockDetails(blockNumber);
        }
        if (this.blocks.length >= 10) {
          this.blocks.pop();
        }
        this.blocks.unshift(block);
        if (this.currentBlockNumber > blockNumber && blockNumber > 0) {
          this.getBlockDetails(++blockNumber);
        }
      });
    },
  },
};
</script>
