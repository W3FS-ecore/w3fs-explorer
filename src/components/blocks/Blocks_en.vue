<template>
  <div class="container clearfix">
    <el-row class="list-wrap">
      <el-col :span="12" class="list-title">
        <span>Blocks</span>
      </el-col>
      <el-col :span="12" class="list-total">
        <span>Total {{ total }}</span>
      </el-col>
    </el-row>
    <section class="blocks-content">
      <el-table
        :data="blocks"
        header-row-class-name="table-header"
        cell-class-name="table-cell"
        :header-cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column label="Block">
          <template slot-scope="scope">
            <router-link class="clickable" :to="'/block/' + scope.row.number">
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

        <el-table-column label="Gas Used">
          <template slot-scope="scope">
            {{ scope.row.gasUsed | gasFormat }}
          </template>
        </el-table-column>
        <el-table-column label="Gas Limit">
          <template slot-scope="scope">
            {{ scope.row.gasLimit | gasFormatNounit }}
          </template>
        </el-table-column>
      </el-table>
    </section>
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
  </div>
</template>

<script>
export default {
  name: "Block",
  data() {
    return {
      total: 1000,
      pageSize: 12,
      currentPage: 1,
      blocks: [],
    };
  },
  created() {
    this.getBlockNumber();
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getBlock(this.total - (this.currentPage - 1) * this.pageSize);
    },
    toFirst() {
      this.handleCurrentChange(1);
    },
    toLast() {
      let maxPage = Math.ceil(this.total / this.pageSize);
      this.handleCurrentChange(maxPage);
    },
    async getBlockNumber() {
      let total = await this.$web3.eth.getBlockNumber();
      this.total = total;
      this.getBlock(this.total - (this.currentPage - 1) * this.pageSize);
    },
    async getBlock(blockNumber) {
      let blocks = [];
      for (var i = 0; i < this.pageSize; i++) {
        if (blockNumber - i >= 0) {
          let block = await this.$web3.eth.getBlock(blockNumber - i);
          if (block) {
            blocks.push(block);
          }
        }
      }
      this.blocks = blocks;
    },
  },
};
</script>
