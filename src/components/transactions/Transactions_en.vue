<template>
  <div class="container clearfix">
    <el-row class="list-wrap">
      <el-col :span="12" class="list-title">
        <span>Transactions</span>
      </el-col>
    </el-row>
    <section class="tx-content">
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
            <router-link class="clickable" :to="'/address/' + scope.row.from">
              {{ scope.row.from || "" }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="To" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <router-link class="clickable" :to="'/address/' + scope.row.to">
              {{ scope.row.to || "" }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="Type">
          <template slot-scope="scope">
            {{ scope.row.type }}
          </template>
        </el-table-column>
        <el-table-column label="Reward (W3FS)">
          <template slot-scope="scope">
            {{ scope.row.reward }}
          </template>
        </el-table-column>
        <el-table-column label="Block">
          <template slot-scope="scope">
            <router-link :to="'/block/' + scope.row.blockNumber">
              {{ scope.row.blockNumber }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="Age">
          <template slot-scope="scope">
            {{ (scope.row.timestamp * 1000) | timestampAge }}
          </template>
        </el-table-column>
      </el-table>
    </section>
    <div class="txs-page">
      <span class="first" @click="toFirst">First</span>
      <el-button
        type="text"
        :class="{ disabled: currentPage <= 1 || isDisabled }"
        :disabled="currentPage <= 1 || isDisabled"
        @click="toPrev"
      >
        <i class="el-icon el-icon-arrow-left"></i>
      </el-button>
      <span>Page {{ currentPage }}</span>
      <el-button
        type="text"
        :class="{ disabled: endBlock <= 0 || isDisabled }"
        :disabled="endBlock <= 0 || isDisabled"
        @click="toNext"
      >
        <i class="el-icon el-icon-arrow-right"></i>
      </el-button>

      <!-- <span class="last" @click="toLast">Last</span> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "Transactions",
  data() {
    return {
      isDisabled: false,
      that: this,
      total: 1000,
      pageSize: 12,
      currentPage: 1,
      recenttransactions: [],
      //
      startBlock: 0,
      endBlock: 0,
      maxNumber: 5,
      startIndex: -1,
      endIndex: -1,
      nextCrisis: false,
    };
  },
  created() {
    this.isTx();
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    toPrev() {
      this.getTransactionsWrap(this.startBlock, false);
      this.currentPage -= 1;
    },
    toFirst() {
      if (this.isDisabled) return;
      this.currentPage = 1;
      this.nextCrisis = false;
      this.endIndex = -1;
      this.getTransactionsWrap(this.maxNumber, true);
    },
    toNext() {
      this.getTransactionsWrap(this.endBlock, true);
      this.currentPage += 1;
    },
    toLast() {
      this.getTransactionsWrap(1, false);
    },
    async isTx() {
      let data = await this.$web3.eth.getBlockNumber();
      if (data >= 0) {
        this.getLogs(data);
      }
    },
    async getLogs(toBlock) {
      let temp = 1000;
      let fromBlock = toBlock - temp > 0 ? toBlock - temp : 0;
      let data = await this.$web3.eth.getPastLogs({
        fromBlock: fromBlock,
        toBlock: toBlock,
      });
      if (data.length > 0) {
        let blockNumber = data[0]["blockNumber"];
        this.maxNumber = blockNumber;
        this.getTransactionsWrap(blockNumber, true);
      } else {
        this.getLogs(fromBlock);
      }
    },
    getTransactionsWrap(blockNumber, isNext) {
      if (blockNumber < 0 || blockNumber > this.maxNumber) return;
      var transInBlock = [];
      if (isNext) {
        this.startBlock = blockNumber;
        this.startIndex = this.endIndex;
        this.getTransactions(blockNumber, transInBlock);
      } else {
        this.endBlock = this.startBlock;
        this.endIndex = this.startIndex;
        this.getprevTransactions(blockNumber, transInBlock);
      }
    },
    getTransactions(blockNumber, transInBlock) {
      this.isDisabled = true;
      if (this.nextCrisis) {
        this.nextCrisis = false;
        this.endIndex = -1;
        this.getTransactions(--blockNumber, transInBlock);

        return false;
      }
      let forLen = this.endIndex + 1;
      if (blockNumber < 0 || blockNumber > this.maxNumber) return;
      this.$web3.eth.getBlock(blockNumber, true, async (err, block) => {
        if (err) {
          return this.getTransactions(blockNumber, transInBlock);
        }
        let txLen = block.transactions.length;
        if (transInBlock.length < 12) {
          this.endBlock = blockNumber;

          for (var i = forLen; i < txLen; i++) {
            if (transInBlock.length < 12) {
              this.endIndex = i;

              let rewardData = await this.$web3.eth.getTransactionReceipt(
                block.transactions[i]["hash"]
              );
              if (rewardData) {
                block.transactions[i]["reward"] = rewardData.effectiveGasPrice;
              }
              block.transactions[i]["timestamp"] = block.timestamp;
              transInBlock.push(block.transactions[i]);
            }
          }
          this.recenttransactions = transInBlock;
          if (transInBlock.length < 12) {
            this.endIndex = -1;
            this.nextCrisis = false;
            this.getTransactions(--blockNumber, transInBlock);
          } else if (transInBlock.length == 12) {
            if (this.endIndex == txLen - 1) {
              this.nextCrisis = true;
            }
            this.isDisabled = false;
          } else {
            this.nextCrisis = false;
            this.isDisabled = false;
          }
        }
      });
    },
    getprevTransactions(blockNumber, transInBlock, isPrevCrisis) {
      let forLen = this.startIndex;
      if (forLen == -1) {
        if (!isPrevCrisis) {
          blockNumber += 1;
        }
      }
      if (blockNumber < 0 || blockNumber > this.maxNumber) return;
      this.$web3.eth.getBlock(blockNumber, true, async (err, block) => {
        if (err) {
          return this.getprevTransactions(blockNumber, transInBlock);
        }
        let txLen = block.transactions.length;
        if (transInBlock.length < 12) {
          if (this.startIndex == -1) {
            forLen = txLen - 1;
          }
          this.startBlock = blockNumber;
          for (var i = forLen; i >= 0; i--) {
            if (transInBlock.length < 12) {
              this.startIndex = i - 1;
              let rewardData = await this.$web3.eth.getTransactionReceipt(
                block.transactions[i]["hash"]
              );
              if (rewardData) {
                block.transactions[i]["reward"] = rewardData.effectiveGasPrice;
              }
              block.transactions[i]["timestamp"] = block.timestamp;
              transInBlock.unshift(block.transactions[i]);
            }
          }
          this.nextCrisis = false;
          this.recenttransactions = transInBlock;
          if (this.startIndex == -1 && transInBlock.length < 12) {
            this.getprevTransactions(++blockNumber, transInBlock, true);
          }
        }
      });
    },
  },
};
</script>
