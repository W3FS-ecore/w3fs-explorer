<template>
  <div class="container">
    <div class="common-title">Overview</div>

    <section class="common-content">
      <div class="column">
        <div class="first">Address</div>
        <div class="last adr-hash">
          {{ addressId }}
          <el-tooltip
            class="item"
            effect="light"
            content="QR Code"
            placement="bottom"
          >
            <el-button
              type="text"
              class="addressId"
              @click="bindQRCode(addressId)"
            >
              <i class="icon-qrcode"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="light"
            content="Copy"
            placement="bottom"
          >
            <el-button
              type="text"
              class="addressId"
              @click="copyLink(addressId)"
            >
              <i class="icon-copy"></i>
            </el-button>
          </el-tooltip>
        </div>
      </div>
      <div class="column">
        <div class="first">Balance</div>
        <div class="last">
          {{ balance }}
        </div>
      </div>
      <div class="column">
        <div class="first">Txs Counts</div>
        <div class="last">{{ txCount }}</div>
      </div>
      <div class="column">
        <div class="first">Blocks Validated</div>
        <div class="last">{{ txCount }}</div>
      </div>
    </section>
    <el-dialog
      title="My QR Code"
      :visible.sync="dialogVisible"
      :destroy-on-close="true"
      width="30%"
    >
      <div ref="qrCodeDiv" class="qr-content"></div>
    </el-dialog>
  </div>
</template>

<script>
import Clipboard from "clipboard";
import QRCode from "qrcodejs2";
export default {
  name: "Address",
  data() {
    return {
      addressId: "",
      balanceusd: "",
      balance: "",
      txCount: "",
      code: "",
      dialogVisible: false,
      total: 1000,
      pageSize: 12,
      currentPage: 1,
      recenttransactions: [],
    };
  },
  created() {
    this.addressId = this.$route.params.id;
    if (this.addressId) {
      this.getAddressBalance();
      this.getAddressTransactionCount();
      this.getCode();
    } else {
      this.$router.push({ path: "/" });
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    toFirst() {
      this.handleCurrentChange(1);
    },
    toLast() {
      let maxPage = Math.ceil(this.total / this.pageSize);
      this.handleCurrentChange(maxPage);
    },
    bindQRCode(text) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        new QRCode(this.$refs.qrCodeDiv, {
          text: text,
          width: 250,
          height: 250,
          colorDark: "#333333",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.L,
        });
      });
    },

    copyLink(hash) {
      let clipboard = new Clipboard(".addressId", {
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
    async getETHRates() {
      let json = await this.$http.get(
        process.env.NODE_ENV == "development"
          ? this.$api.urlETHRates
          : this.$store.state.coincap + this.$api.urlETHRates
      );
      if (json) {
        let price = Number(json.data[1].priceUsd);
        let ethusd = price.toFixed(2);
        this.balanceusd = "$" + ethusd * this.balance;
      }
    },
    getAddressBalance() {
      this.$web3.eth.getBalance(this.addressId, (error, result) => {
        if (!error) {
          this.balance = this.$web3.utils.fromWei(result) + " W3FS";
          // this.getETHRates();
        }
      });
    },
    getAddressTransactionCount() {
      this.$web3.eth.getTransactionCount(this.addressId, (error, result) => {
        if (!error) {
          this.txCount = result;
        }
      });
    },
    getCode() {
      this.$web3.eth.getCode(this.addressId, (error, result) => {
        if (!error) {
          this.code = result;
        }
      });
    },
  },
};
</script>
