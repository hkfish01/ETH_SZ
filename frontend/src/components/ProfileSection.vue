<template>
  <section class="author-section section-space">
    <div class="container">
      <div class="row">
        <div class="col-xl-3">
          <slot name="left"></slot>
        </div>
        <!-- end col -->
        <div class="col-xl-9 ps-xl-4">
          <div class="author-items-wrap">
            <h3>{{ SectionData.profileData.title }}</h3>
            <div class="gap-2x"></div>
            <!-- end gap -->
            <div class="row g-gs">
              <div v-for="item in openedNftList" :key="item.id" class="col-md-4">
                <div class="card card-full">
                  <div
                    :style="{
                      'background-image': `url(${item.raw.metadata.image})`,
                    }"
                    class="card-image card-image-bg"
                  >
                  </div>
                  <div class="card-body p-4">
                    <h5 class="card-title text-wrap text-break mb-0">
                      {{ item.raw.metadata.name }}
                    </h5>
                    <ul class="btns-group pt-[10px]">
                      <BottleWithdraw :hasWithdrawedIds='hasWithdrawedIds' :opened='true'
                        :withdraw-item="item" @query-user-items="queryUserItems"/>
                    </ul>
                  </div>
                  <!-- end card-body -->
                </div>
                <!-- end card -->
              </div>
              <div v-for="item in mintedNftList" :key="item.id" class="col-md-4">
                <div class="card card-full">
                  <div
                    :style="{
                      'background-image': `url(${item.raw.metadata.image})`,
                    }"
                    class="card-image card-image-bg"
                  >
                  </div>
                  <div class="card-body p-4">
                    <h5 class="card-title text-wrap text-break mb-0">
                      {{ item.raw.metadata.name }}
                    </h5>
                    <ul class="btns-group pt-[10px]">
                      <BottleWithdraw :hasWithdrawedIds='hasWithdrawedIds' :opened='false'
                        :withdraw-item="item" @query-user-items="queryUserItems"/>
                    </ul>
                  </div>
                  <!-- end card-body -->
                </div>
                <!-- end card -->
              </div>
            </div>
            <div class="text-center mt-4 mt-md-5">
              <Pagination v-model="pageOpts.offset" :per-page="pageOpts.limit" :records="total"></Pagination>
            </div>
          </div>
          <!-- end author-items-wrap -->
        </div>
        <!-- end col-lg-8 -->
      </div>
      <!-- end row -->
    </div>
    <!-- .container -->

    <ModalSection v-model="withdrawModal" style="z-index: 1000" title="" @confirm="withdrawNft">
      <div class="modal-content">
        <div class="modal-body text-center">
          <h4 class="modal-tilte mb-2">Please confirm you want to withdraw this NFT</h4>
          <div class="card-image">
            <img
              :src="withdrawItem.preview_url || withdrawItem.thumbnail || withdrawItem.image"
              alt="art image"
              class="card-img-top"
            />
          </div>
        </div>
      </div>
    </ModalSection>
    <ModalSection v-model="bottleWithdrawModal" style="z-index: 1000" title="" @confirm="bottleWithdrawConfirm">
      <div class="modal-content">
        <div class="modal-body text-center">
          <h4 class="modal-tilte mb-2">Please confirm you want to withdraw this Bottle</h4>
          <div class="card-image">
            <img
              :src="withdrawItem.preview_url || withdrawItem.thumbnail || withdrawItem.image"
              alt="art image"
              class="card-img-top"
            />
          </div>
          <div class="mb-2">
            <el-form ref="bottleWithdrawFormRef" :model="bottleWithdrawForm" label-position="top">
              <el-form-item
                :rules="{ required: true, message: 'Please enter name', trigger: 'blur' }"
                label="name"
                prop="name"
              >
                <el-input v-model="bottleWithdrawForm.name" clearable placeholder="Enter your name"></el-input>
              </el-form-item>
              <el-form-item
                :rules="{ required: true, message: 'Please enter address', trigger: 'blur' }"
                label="address"
                prop="address"
              >
                <el-input v-model="bottleWithdrawForm.address" clearable placeholder="Enter your address"></el-input>
              </el-form-item>
              <el-form-item
                :rules="{ required: true, message: 'Please enter tel', trigger: 'blur' }"
                label="tel"
                prop="tel"
              >
                <el-input v-model="bottleWithdrawForm.tel" clearable placeholder="Enter your tel"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </ModalSection>
    <!-- end modal-->
    <!-- Modal -->
  </section>
  <!-- end author-section -->
</template>

<script>
// Import component data. You can change the data in the store to reflect in all component
import SectionData from "@/libs/store.js";
import { mapActions } from "vuex";
import { BOTTLE_ON_TRANSACTION, BOTTLE_WITHDRAW } from "@/enum/bottle";
// import VoteProfileAction from "@/components/WhiskyPlus/Vote/VoteProfileAction.vue";
import BottleWithdraw from "@/components/BottleWithdraw.vue";
import blindImg from '@/assets/images/whisky/blind.png';
import apis from '@/x/server';
import ModalSection from "@/components/ModalSection"

export default {
  name: "ProfileSection",
  components: { BottleWithdraw, ModalSection },
  data() {
    return {
      blindImg,
      SectionData,
      BOTTLE_WITHDRAW,
      BOTTLE_ON_TRANSACTION,
      // currentPage: 12,
      total: 0,
      // userNftItems: [],
      form: {
        method: 1,
        price: "",
        payment_method: 1,
        start_time: "",
        end_time: "",
      },
      rules: {
        price: [
          {
            required: true,
            message: "Please input price",
          },
        ],
        auction_price: [
          {
            required: true,
            message: "Please input price",
          },
        ],
        start_time: {required: true, message: "Please select start_time"},
        end_time: {required: true, message: "Please select end_time"},
        payment_method: [
          {
            required: true,
            message: "Please input price",
          },
        ],
      },
      showModal: false,
      withdrawModal: false,
      updateNftId: "",
      paymentMethodList: [],
      withdrawItem: {},
      pageOpts: {
        limit: 6,
        offset: 1,
      },
      listConfirmButtonText: "Confirm",
      bottleWithdrawModal: false,
      bottleWithdrawPassword: "",
      bottleWithdrawForm: {},
      mintedNftList: [],
      openedNftList: [],
      hasWithdrawedIds: []
    };
  },
  watch: {
    "pageOpts.offset": {
      handler() {
        this.queryUserItems();
      },
    },
  },
  created() {
    this.queryUserInfo();
    this.queryUserItems();
  },
  methods: {
    ...mapActions("$_USER", ["queryUserInfo"]),
    startTimeDisabledDate(time) {
      return time.getTime() < Date.now();
    },
    endTimeDisabledDate(time) {
      if (!this.form.start_time) return time.getTime() < Date.now();
      const startTime = new Date(this.form.start_time);
      return time.getTime() < startTime.getTime() || time.getTime() > startTime.getTime() + 1000 * 60 * 60 * 24 * 31;
    },
    // loadMore() {
    //   if (this.currentPage > this.total) return;
    //   this.currentPage = this.currentPage + 3;
    //   this.queryUserItems(this.currentPage)
    // },
    selectMethod(list) {
      this.form.method = list.id;
      this.form.payment_method = 1;
    },
    selectedNft(item) {
      if (+item["bottle_withdraw"] === 1) {
        this.$alert("Please use your mobile device to scan the tag first!", {
          type: "warning",
        });
        return;
      }

      if (+item["bottle_withdraw"] === 0 && +item["on_transaction"] === 0) {
        this.listConfirmButtonText = "Request to List";
      } else {
        this.listConfirmButtonText = "Confirm";
      }

      this.updateNftId = item.id;
      this.showModal = true;

      this.queryPaymentMethodList();
    },
    withdrawConfirmNft(item) {
      this.withdrawItem = item;
      this.withdrawModal = true;
    },
    async withdrawNft() {
      const {code} = await this.$apis.nft.updateWithdrawingStatus({id: this.withdrawItem.id});
      if (!code) {
        this.withdrawModal = false;
        this.queryUserItems();
      }
    },
    async queryUserItems() {
      // const {code, data} = await this.$apis.nft.queryNftList({
      //   user: this.userId,
      //   offset: (this.pageOpts.offset - 1) * this.pageOpts.limit,
      //   limit: this.pageOpts.limit,
      // });
      // if (!code) {
      //   this.total = data.count;
      //   this.userNftItems = data.results;
      // }
      this.getMintedNftList()
      this.getOpenedNftList()
      this.getWithdrawList()
    },
    // const mintedNftList = ref([])
    async getMintedNftList() {
      const { ownedNfts } = await apis.alchemy.queryOwnerNftList({
        owner: this.$store.state.buyerToken,
        'contractAddresses[]': '0x314e34EFfdA6999CF633c737daC961B0907061eF',
        withMetadata: 'true',
        pageSize: '100'
      })
      this.mintedNftList = ownedNfts
    },
    async getOpenedNftList() {
      const { ownedNfts } = await apis.alchemy.queryOwnerNftList({
        owner: this.$store.state.buyerToken,
        'contractAddresses[]': '0x589469Ac6bA85c441c91DcA4A4A1a88BAe556aBE',
        withMetadata: 'true',
        pageSize: '100'
      })
      this.openedNftList = ownedNfts
    },
    async getWithdrawList() {
      const { code, rows } = await apis.nft.queryNftList()
      if(code === 200) {
        this.hasWithdrawedIds = rows.map((row) => row.tokenid)
      }
    },
    confirmUpdate() {
      this.$refs.wdform.validate((valid) => {
        if (valid) {
          // this.updatePrice()
          console.log(this.form);
          if (this.form.method === 1) {
            this.updatePrice();
          }
          if (this.form.method === 2) {
            this.updateAuctionInfo();
          }
        }
      });
    },
    async queryPaymentMethodList() {
      const {code, data} = await this.$apis.nft.queryPaymentMethodList();
      if (!code) {
        this.paymentMethodList = data.results.filter((f) => f.id !== 2);
      }
    },
    async updatePrice() {
      const params = {
        price: this.form.price,
        payment_method: this.form.payment_method,
      };
      const {code} = await this.$apis.nft.updatePrice(this.updateNftId, params);

      if (!code) {
        this.$message({
          type: "success",
          message: "Success",
        });
        this.showModal = false;
        this.queryUserItems();
      }
    },
    async updateAuctionInfo() {
      const params = {
        price: this.form.auction_price,
        payment_method: this.form.payment_method,
        start_time: this.form.start_time,
        end_time: this.form.end_time,
      };
      const {code} = await this.$apis.nft.updateAuctionInfo(this.updateNftId, params);

      if (!code) {
        this.$message({
          type: "success",
          message: "Success",
        });
        this.showModal = false;
        this.queryUserItems();
      }
    },
    async updateNft(item) {
      const params = {
        is_publish: false,
      };
      const {code} = await this.$apis.nft.updateNft(item.id, params);

      if (!code) {
        this.queryUserItems();
      }
    },
    bottleWithdrawClick(item) {
      this.withdrawItem = item;
      this.bottleWithdrawForm = {};
      this.bottleWithdrawModal = true;
    },
    bottleWithdrawConfirm() {
      this.$refs.bottleWithdrawFormRef.validate(async (isValid) => {
        if (isValid) {
          const {code} = await this.$apis.nft.updateBottleWithdraw({
            id: this.withdrawItem.id,
            // pwd: this.bottleWithdrawForm["password"],
          });

          if (!code) {
            this.withdrawItem = {};
            this.bottleWithdrawModal = false;
            this.bottleWithdrawForm = {};
            this.queryUserItems();
          }
        }
      });
    },
  },
  computed: {
    userId() {
      return this.$store.state.$_USER.userInfo.id;
    },
    userNftItems(){
      return [...this.openedNftList, ...this.mintedNftList]
    }
  },
};
</script>

<style lang="scss" scoped>
.details {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.btn,
.author-link {
  z-index: 2;
  position: relative;
}

.card-image {
  height: 260px;
  overflow: hidden;
  position: relative;

  .profile-tips {
    position: absolute;
    bottom: 0;
    background-color: #c2c2c2;
    width: 100%;
    font-weight: bold;
    text-align: center;

    p {
      height: 30px;
      line-height: 30px;
      color: #000;
    }
  }
}

.modal-body {
  padding-bottom: 0;
}

@media (min-width: 1200px) {
  .container {
    max-width: 1295px;
  }
}
</style>
<style lang="scss">
.dark-mode {
  .el-input__inner {
    color: #fff;
  }

  .el-picker-panel .el-input__inner {
    color: #000;
  }
}

.card-price-number {
  display: flex;
  align-items: center;

  .icon {
    margin-right: 8px;
  }

  .icon-coin {
    width: 14px;
    height: auto;
  }
}
</style>
