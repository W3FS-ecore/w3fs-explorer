<template>
  <div class="container">
    <div class="common-title">Transaction</div>
    <section class="common-content">
      <div class="column">
        <div class="first">Hash</div>
        <div class="last tx-hash">
          {{ txId }}
          <el-tooltip
            class="item"
            effect="light"
            content="Copy"
            placement="bottom"
          >
            <el-button type="text" class="txHash" @click="copyLink(txId)">
              <i class="icon-copy"></i>
            </el-button>
          </el-tooltip>
        </div>
      </div>
      <div class="column">
        <div class="first">Status</div>
        <div class="last tx-status" :class="{ 'tx-success': receipt.status }">
          {{ receipt.status ? "Success" : "Fail" }}
        </div>
      </div>
      <div class="column">
        <div class="first">Block</div>
        <div class="last tx-block">
          <router-link :to="'/block/' + result.blockNumber">
            {{ result.blockNumber ? result.blockNumber : "pending" }}
          </router-link>
        </div>
      </div>
      <div class="column">
        <div class="first">Timestamp</div>
        <div class="last">
          {{ (time * 1000) | timestampAge }}
          {{ time | timeFormat(true) }}
        </div>
      </div>
      <div class="column">
        <div class="first">From</div>
        <div class="last linkHash">
          <router-link :to="'/address/' + result.from">
            {{ result.from }}
          </router-link>
        </div>
      </div>
      <div class="column">
        <div class="first">To</div>
        <div class="last linkHash">
          <router-link :to="'/address/' + result.to">
            {{ result.to }}
          </router-link>
        </div>
      </div>
      <div class="column">
        <div class="first">Value</div>
        <div class="last">{{ result.value }}</div>
      </div>
      <div class="column">
        <div class="first">Transaction Fee</div>
        <div class="last">{{ receipt.effectiveGasPrice }}</div>
      </div>
      <div class="column">
        <div class="first">Gas Limit</div>
        <div class="last">{{ gasLimit | gasFormatNounit }}</div>
      </div>
      <div class="column">
        <div class="first">Gas Used by Transaction</div>
        <div class="last">{{ receipt.gasUsed | gasFormatNounit }}</div>
      </div>

      <div class="column">
        <div class="first">Gas Price</div>
        <div class="last">{{ gasPrice }}</div>
      </div>
      <div class="column">
        <div class="first">Extra Data</div>
        <div class="last">
          <el-input
            resize="none"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            :disabled="true"
            v-model="result.input"
          >
          </el-input>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Clipboard from "clipboard";
export default {
  name: "Transaction",
  data() {
    return {
      txId: "",
      result: {},
      receipt: {},
      time: null,
      gasPrice: "",
      ethValue: "",
      txprice: "",
      gasLimit: "",
    };
  },
  created() {
    this.txId = this.$route.params.id;
    if (this.txId) {
      this.getTransactionInfos();
    } else {
      this.$router.push({ path: "/" });
    }
  },
  methods: {
    copyLink(hash) {
      let clipboard = new Clipboard(".txHash", {
        text: function () {
          return hash;
        },
      });
      clipboard.on("success", () => {
        this.$message({ message: "success", showClose: true, type: "success" });
        clipboard.destroy();
      });
      clipboard.on("error", () => {
        this.$message({ message: "error", showClose: true, type: "error" });
        clipboard.destroy();
      });
    },
    async getTransactionInfos() {
      let data = await this.$web3.eth.getTransactionReceipt(this.txId);
      if (data) {
        data.type = this.$web3.utils.hexToNumber(data.type);
        this.receipt = data;
      }

      this.$web3.eth.getTransaction(this.txId, async (error, result) => {
        if (!error) {
          if (!result) return;
          this.result = result;

          let blockNumber = result.blockNumber;
          this.gasPrice =
            this.$web3.utils.fromWei(result.gasPrice, "ether") + " W3FS";
          // this.ethValue = result.value.c[0] / 10000;

          // this.txprice =
          //   this.$web3.utils.fromWei(result.gas * result.gasPrice, "ether") + " ETH";
          if (blockNumber) {
            var info = await this.$web3.eth.getBlock(blockNumber);
            if (info) {
              this.time = info.timestamp;
              this.gasLimit = info.gasLimit;
            }
          }
        }
      });
    },
  },
};
</script>
