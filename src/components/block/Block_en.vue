<template>
  <div class="container clearfix">
    <div class="common-title">Block</div>
    <section class="common-content">
      <div class="column">
        <div class="first">Block</div>
        <div class="last block-num">
          {{ blockNumber }}
          <el-button
            type="text"
            :class="{ disabled: !firstBlock }"
            :disabled="!firstBlock"
            @click="goLink(blockNumber - 1)"
          >
            <i class="arrow-left"></i>
          </el-button>

          <el-button
            type="text"
            :class="{ disabled: !lastBlock }"
            :disabled="!lastBlock"
            @click="goLink(blockNumber + 1)"
          >
            <i class="arrow-right"></i>
          </el-button>
        </div>
      </div>
      <div class="column">
        <div class="first">Timestamp</div>
        <div class="last">{{ (result.timestamp * 1000) | timestampAge }}</div>
      </div>
      <div class="column">
        <div class="first">Transactions</div>
        <div class="last">{{ numberOfTransactions }}</div>
      </div>
      <div class="column">
        <div class="first">Difficulty</div>
        <div class="last">{{ difficulty }}</div>
      </div>
      <div class="column">
        <div class="first">Size</div>
        <div class="last">
          {{ result.size ? result.size + "bytes" : result.size }}
        </div>
      </div>
      <div class="column">
        <div class="first">Gas Used</div>
        <div class="last">{{ result.gasUsed | gasFormatNounit }}</div>
      </div>
      <div class="column">
        <div class="first">Gas Limit</div>
        <div class="last">{{ result.gasLimit | gasFormatNounit }}</div>
      </div>
      <div class="column">
        <div class="first">Extra Data</div>
        <div class="last">
          <el-input
            resize="none"
            type="textarea"
            :autosize="true"
            :disabled="true"
            v-model="extraData"
          >
          </el-input>
        </div>
      </div>
    </section>
    <el-row class="list-wrap block-title">
      <el-col :span="12" class="list-title">
        <span>Transactions</span>
      </el-col>
      <el-col :span="12" class="list-total">
        <span>Total {{ total }}</span>
      </el-col>
    </el-row>
    <section>
      <el-table
        :data="
          transactions.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )
        "
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
      <div class="pagination">
        <el-pagination
          layout="slot,prev, pager, next"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handleCurrentChange"
          :hide-on-single-page="true"
          :total="total"
        >
          <span @click="toFirst">First</span>
        </el-pagination>
        <el-pagination
          layout="slot"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handleCurrentChange"
          :hide-on-single-page="true"
          :total="total"
        >
          <span @click="toLast">Last</span>
        </el-pagination>
      </div>
    </section>
  </div>
</template>

<script>
import Fn from "../../utils/fn";
export default {
  name: "Block",
  data() {
    return {
      blockId: "",
      result: {},
      difficulty: "",
      extraData: "",
      dataFromHex: "",
      firstBlock: true,
      lastBlock: true,
      blockNumber: "",
      conf: "Unconfirmed",
      //
      transactions: [],
      numberOfTransactions: "",
      total: 0,
      pageSize: 12,
      currentPage: 1,
    };
  },
  created() {
    this.blockId = this.$route.params.id;
    this.getCount();
    if (this.blockId) {
      this.getBlockInfos();
    } else {
      this.$router.push({ path: "/" });
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
      // this.getBlock(this.total - (this.currentPage - 1) * this.pageSize);
    },
    toFirst() {
      this.handleCurrentChange(1);
    },
    toLast() {
      let maxPage = Math.ceil(this.total / this.pageSize);
      this.handleCurrentChange(maxPage);
    },
    goLink(id) {
      this.$router.push({
        path: "/block/" + id,
      });
    },
    getBlockInfos() {
      this.$web3.eth.getBlock(this.blockId, true, async (error, result) => {
        if (!error) {
          this.result = result;
          if (result.transactions) {
            this.transactions = result.transactions;
            this.transactions.forEach(async (item) => {
              let rewardData = await this.$web3.eth.getTransactionReceipt(
                item["hash"]
              );
              if (rewardData) {
                this.$set(item, "reward", rewardData.effectiveGasPrice);
              }
              this.$set(item, "timestamp", result.timestamp);
            });
          }
          var diff =
            ("" + result.difficulty).replace(/['"]+/g, "") / 1000000000000;
          this.difficulty = diff.toFixed(3) + " T";
          this.blockNumber = result.number;
          this.extraData = result.extraData.slice(2);
          this.dataFromHex = Fn.hex2a(result.extraData.slice(2));
          var number = await this.$web3.eth.getBlockNumber();
          if (this.blockNumber >= 0) {
            this.conf = number - this.blockNumber + " Confirmations";

            if (number === this.blockNumber) {
              this.conf = "Unconfirmed";
              this.lastBlock = false;
            } else {
              this.lastBlock = true;
            }
            if (this.blockNumber === 0) {
              this.firstBlock = false;
            } else {
              this.firstBlock = true;
            }
          }
        }
      });
    },
    async getCount() {
      let data = await this.$web3.eth.getBlockTransactionCount(this.blockId);
      this.numberOfTransactions = data;
      this.total = data;
    },
  },
};
</script>
