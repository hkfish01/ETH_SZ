<script setup>
import {computed, getCurrentInstance, onMounted, onUnmounted, ref} from "vue";
import { useRoute } from "vue-router";
import {Line} from "@antv/g2plot";
import apis from "@/x/server";
import { getTimeGap, parseLeftTime } from "@/x/utils";
import HeaderSection from "@/components/HeaderSection.vue";

import ItemDetailBuyButton from "@/components/ItemDetailBuyButton.vue";
// import ItemDetailBidButton from "@/components/common/ItemDetailBidButton.vue";
// import ItemDetailCreator from "@/components/common/ItemDetailCreator.vue";
// import ItemDetailBidder from "@/components/common/ItemDetailBidder.vue";
// import BottleInput from "@/components/WhiskyPlus/BottleInput/Index.vue";
// import BottleListButton from "@/components/WhiskyPlus/BottleListButton/Index.vue";
// import VoteAction from "@/components/WhiskyPlus/Vote/VoteAction.vue";
// import VoteInfo from "@/components/WhiskyPlus/Vote/VoteInfo.vue";
import { ElMessage } from "element-plus";
import { Headset, Sort } from "@element-plus/icons-vue";
import { returnBottleStatusStr } from "@/x/utils/whisky";
import { BOTTLE_WITHDRAW } from "@/enum/bottle";

const route = useRoute();
// const router = useRouter();

// RSquare Chain Url
const rChainUrl = process.env.VUE_APP_CHAIN_SITE_URL;

// 控制表单格式
const labelPosition = "right";

// 是否正在读取数据
const isLoading = ref(false);
// 是否是港币交易
const isHKDPrice = ref(true);
// 商品信息
let productDetail = ref({});

const nftDetail = ref({
  description: "Experience the mystical charm of our Drunken Ghosts, where each sip is a step into a fantastical world.",
  image: "https://nftstorage.link/ipfs/bafybeih2yys2zr7gpipkqnzvbwlufjr6pbdju4lkgpj67e367fgilyk5ou",
  name: "OffChainDrunkenAccess"
})
// 酒瓶状态
let bottleStatus = ref("");
// 汇率信息
let ethRate = ref({});
// 数据图表
let biddingHistoryList = ref([]);
let tradingHistoryData = ref([]);
let listingHistoryList = ref([]);
let offerHistoryList = ref([]);
// 图表
let tradingChart = null;
// collection展示
let imgRef = ref(null);
// 3D模型高度
let vue3dLoaderHeight = ref(400);
// 倒计时
let countDown = ref(null);
let countdownSeconds = ref("");
// item activity
let activityList = ref([]);
let activityTotal = ref(0);
let activityPageIndex = ref(1);
const activityPageSize = 10;

// 当前进行中的Vote
const currentVoteInfo = ref({})
// 历史进行的Vote
const voteList = ref([]);
// 当前用户拥有的数量
const currentUserVoteCount = ref(0);

const serverTime = ref('')

// 当前登录
const currentUser = computed(() => getCurrentInstance().appContext.config.globalProperties.$store.getters.userInfo);
// 用户信息
// const user = computed(() => productDetail.value["user"] ?? {});
// 港币价值
const hkdPrice = computed(() => {
  let price;
  if (isHKDPrice.value) price = +productDetail.value["price"];
  else price = ethRate.value["eth_hkd"] * +productDetail.value["price"];
  return `HKD ${price.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
});
const ethPrice = computed(() => {
  let price;
  if (isHKDPrice.value) price = +productDetail.value.price / ethRate.value.eth_hkd
  else price = +productDetail.value.price;
  return `${price.toFixed(4).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
});
// 当前最高竞价人
const currentHighestBidder = computed(() => biddingHistoryList.value[0] ?? undefined);

/**
 * 转化方法名称
 * @param type
 * @returns {string}
 */
const formatEventLabel = (type) => {
  switch (type) {
    case 1:
      return "List for Sales";
    case 2:
      return "Sold";
    case 3:
      return "Auction Created";
    case 4:
      return "Place a Bid";
    case 5:
      return "Win Auction";
    case 6:
      return "Make Offer";
  }
};

/**
 * 初始化报表
 */
const initCharts = (data) => {
  if (!tradingChart) {
    tradingChart = new Line("charts", {
      data,
      padding: "auto",
      appendPadding: [20, 20, 20, 20],
      autoFit: true,
      height: 300,
      xField: "date",
      yField: "price",
      xAxis: {
        range: [0, 1],
      },
      yAxis: {
        min: 0,
        nice: true,
      },
    });
    tradingChart.render();
  }
};

// 渲染倒计时
// const renderCountDown = () => {
//   countdownSeconds.value = parseLeftTime(countDown.value);
//   countDown.value--;
//   const t = setTimeout(() => {
//     clearTimeout(t);
//     renderCountDown();
//   }, 1000);
// };

// 获取商品详情
const getDetailData = async () => {
  const res = await apis.nft.queryNftDetails({
    id: 588
  });
  if (res && +res.code === 0) {
    const {data = {}} = res;
    productDetail.value = data;
    productDetail.value.bottleStatusStr = returnBottleStatusStr(
      productDetail.value["bottle_status"],
      route.query.type,
      route.query.data
    );
    bottleStatus.value = data.status;
    isHKDPrice.value = data.payment_method === 1;
    if (data.auction && data.auction.id) {
      queryBiddingHistory(data.auction.id);

      let endTimeStamp = data.auction.status === 2 ? data.auction.end_time : data.auction.start_time;
      countDown.value = (new Date(endTimeStamp) - new Date(data.auction["server_time"])) / 1000;
      // if (countDown.value > 0) {
      //   renderCountDown();
      // }
    }

    // 如果有collection信息，则获取Vote信息
    if (productDetail.value["collection"]?.id) {
      voteList.value = []

      if (currentUser.value && currentUser.value.id) {
        queryCurrentUserVoteCount(productDetail.value["collection"]?.id)
      } else {
        queryVoteInfo(productDetail.value["collection"]?.id);
        queryVoteHistory(productDetail.value["collection"]?.id);
      }
    }
  }
};

// 获取竞价历史
const queryBiddingHistory = (id) => {
  apis.nft
    .queryAuctionUserList({
      auction: id,
      ordering: "-price", // 按价格倒叙
    })
    .then((res) => {
      if (res && +res["code"] === 0) {
        const {data} = res;
        if (data.count) {
          biddingHistoryList.value = data.results;
        }
      }
    })
    .catch((err) => {
      ElMessage.error(err.message ?? err);
    });
};

/**
 * 获取活动列表
 */
const queryActivityList = (index) => {
  activityPageIndex.value = index;

  apis.nft
    .queryActivityFilterList({
      nft: 588,
      offset: activityPageIndex.value - 1,
      limit: activityPageSize,
    })
    .then((res) => {
      if (res && +res["code"] === 0) {
        const {data} = res;
        if (data.count) {
          activityList.value = data.results;
          activityTotal.value = data.count;
        }
      }
    })
    .catch((err) => {
      ElMessage.error(err.message ?? err);
    });
};

// 获取页面数据
const getPageData = () => {
  isLoading.value = true;
  getDetailData();

  Promise.all([
    // 获取汇率
    apis.public.queryETHPrice(),
    // 获取Listing History
    apis.nft.queryListing({
      nft: 588,
      offset: 0,
      limit: 5,
    }),
    // // 获取Offer History
    // apis.offer.offerHistoryList({
    //   offset: 0,
    //   limit: 1000,
    //   nft: 588,
    // }),
    // 获取Trading History
    apis.nft.queryNftHistoryList({
      nft: 588,
      offset: 0,
      limit: 5,
    }),
    apis.nft.queryActivityFilterList({
      nft: 588,
      offset: activityPageIndex.value - 1,
      limit: activityPageSize,
    }),
  ])
    .then((res) => {
      const [ethRateRes, listingHistoryRes, TradingHistoryRes, activityRes] = res;

      // 处理汇率
      if (ethRateRes && +ethRateRes.code === 0) {
        const {data = {}} = ethRateRes;
        ethRate.value = data;
      }

      // 处理Listing History
      if (listingHistoryRes && +listingHistoryRes.code === 0) {
        const {data} = listingHistoryRes;
        if (data.count) {
          listingHistoryList.value = [
            {
              "id": 630,
              "user": {
                "id": 14,
                "full_name": "RI Collection",
                "username": "ricollection",
                "email": "hkter01@yahoo.com.hk",
                "avatar": "https://nft-marketplace-avatar.oss-cn-hongkong.aliyuncs.com/5016d554-579f-4a00-9405-ecaf5e86b956.png"
              },
              "nft": {
                "id": 588,
                "image": "bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku",
                "thumbnail": "https://lemon-nft-image.oss-cn-hongkong.aliyuncs.com/barrel10/10.jpg",
                "preview_url": "https://lemon-nft-image.oss-cn-hongkong.aliyuncs.com/a0d295ea-b8dd-403c-b748-48d6bd607f70.png",
                "title": "RI Collection Barrel Number 13 #10",
                "description": "<div class=\"row\">\r\n<div class=\"col-lg-4\" style=\"padding-left: 1%; padding-right: 1%;\"><img src=\"https://lemon-nft-image.oss-cn-hongkong.aliyuncs.com/whiskyplus/MC718-Certificate.jpg\" alt=\"\" width=\"100%\"></div>\r\n<div class=\"col-lg-4\" style=\"padding-left: 1%; padding-right: 1%;\"><img src=\"https://lemon-nft-image.oss-cn-hongkong.aliyuncs.com/whiskyplus/box_floral_1-02-02.png\" alt=\"\" width=\"100%\"></div>\r\n<div class=\"col-lg-4\" style=\"padding-left: 1%; padding-right: 1%;\"><img src=\"https://lemon-nft-image.oss-cn-hongkong.aliyuncs.com/whiskyplus/bottle_floral_1-02.png\" alt=\"\" width=\"100%\"></div>\r\n</div>"
              },
              "payment_method": {
                "id": 1,
                "type": 1,
                "code": "HKD"
              },
              "price": "17000.0000",
              "create_time": "2024-08-12 16:35:33"
            }
          ]
        }
      }

      // // 处理Offer History
      // if (offerHistoryRes && +offerHistoryRes.code === 0) {
      //   const {data} = offerHistoryRes;
      //   if (data.count) {
      //     offerHistoryList.value = data.results;
      //   }
      // }

      // 处理Trading History
      if (TradingHistoryRes && +TradingHistoryRes.code === 0) {
        const {data} = TradingHistoryRes;
        if (data.count) {
          tradingHistoryData.value = data.results;
          let chartData = tradingHistoryData.value
            .map((m) => ({
              date: m["create_time"],
              price: +m["price"],
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
          !tradingChart && initCharts(chartData);
        }
      }

      // 处理Item Activity
      if (activityRes && +activityRes.code === 0) {
        const {data} = activityRes;
        if (data.count) {
          activityList.value = [
            {
              "id": 169,
              "nft": {
                "id": 588,
                "image": "bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku",
                "thumbnail": "https://lemon-nft-image.oss-cn-hongkong.aliyuncs.com/barrel10/10.jpg",
                "preview_url": "https://lemon-nft-image.oss-cn-hongkong.aliyuncs.com/a0d295ea-b8dd-403c-b748-48d6bd607f70.png",
                "title": "RI Collection Barrel Number 13 #10",
                "description": "<div class=\"row\">\r\n<div class=\"col-lg-4\" style=\"padding-left: 1%; padding-right: 1%;\"><img src=\"https://lemon-nft-image.oss-cn-hongkong.aliyuncs.com/whiskyplus/MC718-Certificate.jpg\" alt=\"\" width=\"100%\"></div>\r\n<div class=\"col-lg-4\" style=\"padding-left: 1%; padding-right: 1%;\"><img src=\"https://lemon-nft-image.oss-cn-hongkong.aliyuncs.com/whiskyplus/box_floral_1-02-02.png\" alt=\"\" width=\"100%\"></div>\r\n<div class=\"col-lg-4\" style=\"padding-left: 1%; padding-right: 1%;\"><img src=\"https://lemon-nft-image.oss-cn-hongkong.aliyuncs.com/whiskyplus/bottle_floral_1-02.png\" alt=\"\" width=\"100%\"></div>\r\n</div>"
              },
              "from_user": null,
              "to_user": {
                "id": 14,
                "full_name": "RI Collection",
                "username": "ricollection",
                "email": "hkter01@yahoo.com.hk",
                "avatar": "https://nft-marketplace-avatar.oss-cn-hongkong.aliyuncs.com/5016d554-579f-4a00-9405-ecaf5e86b956.png"
              },
              "payment_method": {
                "id": 1,
                "type": 1,
                "code": "HKD"
              },
              "amount": "17000.0000",
              "quantity": 1,
              "type": 1,
              "tx_id": "35e4153ee732f23fb99eeac7fc2d915fe9cde6fd53294fb087aa9b0b792382cd",
              "create_time": "2024-08-12 16:36:02"
            }
          ];
          activityTotal.value = 1;
        }
      }
    })
    .catch((err) => {
      ElMessage.error(err.message ?? err);
    })
    .finally(() => {
      isLoading.value = false;
    });
};

/**
 * 查询当前进行中的Vote
 * @param id
 */
const queryVoteInfo = (id) => {
  apis.nft
    .queryCurrentVoteCollection(id)
    .then((res) => {
      if (res && +res["code"] === 0) {
        const {data, time} = res;
        currentVoteInfo.value = data;
        serverTime.value = time
      }
    })
};

/**
 * 查询投票历史
 * @param id
 */
const queryVoteHistory = (id) => {
  apis.nft.queryVoteHistory(id).then(res => {
    if (res && +res["code"] === 0) {
      const {data} = res;
      if (data.count) {
        voteList.value = data.results;
      }
    }
  })
}

/**
 * 获取当前用户拥有的酒樽数量
 * @param id
 */
const queryCurrentUserVoteCount = (id) => {
  apis.nft.queryVoteCount(id).then(res => {
    if (res && +res["code"] === 0) {
      const {data} = res;
      currentUserVoteCount.value = data.count;

      queryVoteInfo(productDetail.value["collection"]?.id);
      queryVoteHistory(productDetail.value["collection"]?.id);
    }
  })
}

/**
 * 购买者提交
 */
const buyerConfirmSuccess = () => {
  window.location.reload();
};

// 动态设置3D模型高度
const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    vue3dLoaderHeight.value = entry.contentRect.height;
  }
});

onMounted(() => {
  getPageData();

  resizeObserver.observe(imgRef.value);
});

onUnmounted(() => {
  resizeObserver.disconnect();
});

const description = `<div class="row">
<div class="col-lg-4" style="padding-left: 1%; padding-right: 1%;"><img src="https://lemon-nft-image.oss-cn-hongkong.aliyuncs.com/whiskyplus/MC718-Certificate.jpg" alt="" width="100%"></div>
<div class="col-lg-4" style="padding-left: 1%; padding-right: 1%;"><img src="https://lemon-nft-image.oss-cn-hongkong.aliyuncs.com/whiskyplus/box_floral_1-02-02.png" alt="" width="100%"></div>
<div class="col-lg-4" style="padding-left: 1%; padding-right: 1%;"><img src="https://lemon-nft-image.oss-cn-hongkong.aliyuncs.com/whiskyplus/bottle_floral_1-02.png" alt="" width="100%"></div>
</div>`
</script>

<template>
  <div v-loading.fullscreen.lock="isLoading" class="page-wrap" element-loading-text="R I Collection">
    <!-- header  -->
    <header class="header-section has-header-main bg-gradient">
      <HeaderSection></HeaderSection>
    </header>
    <div class="whisky-container">
      <!--Product Info-->
      <div class="product">
        <el-card class="info">
          <!--          <div class="avatar">-->
          <!--            &lt;!&ndash;            <img :src="user.avatar" alt="" />&ndash;&gt;-->
          <!--            <img :src="user['avatar']" alt="" />-->
          <!--          </div>-->
          <div class="collection-name">
            {{ nftDetail.description }}
          </div>
          <div class="name">
            <!--            <el-tooltip :content="productDetail.title" effect="dark" placement="top-start">-->
            <!--              {{ productDetail.title }}-->
            <!--            </el-tooltip>-->
            {{ nftDetail.name }}
          </div>
          <div class="bottle-info mt-[40px]">
            <div class="bottle-info-name">bottle status</div>
            <div class="bottle-info-value">Sealed</div>
          </div>
          <div class="bottle-info">
            <div class="bottle-info-name">location</div>
            <div class="bottle-info-value">In Warehouse</div>
          </div>
          <br/>
          <div class="mt-[100px]">
            <item-detail-buy-button :itemDetailData="productDetail"></item-detail-buy-button>
          </div>
          <template v-if="productDetail.method !== 2 && productDetail['is_publish']">
            <div class="price">
              <div class="number">
                <el-tooltip :content="isHKDPrice ? hkdPrice : ethPrice" effect="dark" placement="top-start">
                  {{ isHKDPrice ? hkdPrice : ethPrice }}
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-card>
        <div ref="imgRef" class="image">
          <template v-if="nftDetail.image">
            <img alt="image" :src="nftDetail.image"/>
          </template>
          <template v-else-if="(!productDetail['sale_count'] && !productDetail['is_piece'])
                           || (productDetail['is_piece'] && !productDetail['vote_withdraw']) ">
            <img alt="blind" src="@/assets/images/whisky/blind.png"/>
          </template>
          <template v-else-if="/\.(mp4)$/.test(productDetail['thumbnail'])">
            <video controls muted>
              <source :src="productDetail['thumbnail']"/>
              Your browser does not support the video tag.
            </video>
          </template>
          <template v-else-if="/\.(mp3)$/.test(productDetail['thumbnail'])">
            <div class="audio-container">
              <el-icon :size="80">
                <Headset/>
              </el-icon>
              <audio controls muted>
                <source :src="productDetail['thumbnail']"/>
                Your browser does not support the audio element.
              </audio>
            </div>
          </template>
          <!-- <template v-else-if="/\.(glb)$/.test(productDetail['thumbnail'])">
            <vue3dLoader
              :key="vue3dLoaderHeight"
              :filePath="productDetail['thumbnail']"
              :height="vue3dLoaderHeight"
            ></vue3dLoader>
          </template> -->
          <template v-else>
            <img :src="productDetail['thumbnail'] || productDetail['image']" alt=""/>
          </template>
        </div>
      </div>
      <!--/Product Info-->
      <!--Product Description-->
      <div class="description">
        <el-card class="info">
          <!--          <div class="title">{{ productDetail.title }}</div>-->
          <div class="detail" v-html="description"></div>
        </el-card>
        <el-card class="history">
          <el-collapse :model-value="productDetail.method === 2 ? 'bidding' : 'listing'" accordion>
            <el-collapse-item v-if="productDetail.method === 2" name="bidding" title="Bidding History">
              <el-table :data="biddingHistoryList" class="mt-4" max-height="400px" style="width: 100%">
                <el-table-column align="center" label="To" prop="user.id">
                  <template #default="scope">
                    {{ scope.row.user.username }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="Price" prop="price">
                  <template #default="scope">
                    <span>
                      {{ scope.row.payment_method.code }}
                      {{ scope.row.price }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="Bid Time" prop="create_time"/>
              </el-table>
            </el-collapse-item>
            <el-collapse-item name="trading" title="Trading History">
              <div v-show="tradingHistoryData.length" id="charts"></div>
              <div v-show="!tradingHistoryData.length" class="chart-empty">No Data</div>
            </el-collapse-item>
            <el-collapse-item name="listing" title="Listing History">
              <el-table :data="listingHistoryList" class="mt-4" max-height="400px" style="width: 100%">
                <el-table-column align="center" label="Price" prop="price">
                  <template #default="scope">
                    <span>
                      {{ scope.row.payment_method.code }}
                      {{ scope.row.price }}
                    </span>
                  </template>
                </el-table-column>

                <el-table-column align="center" label="From" prop="user.id">
                  <template #default="scope">
                    {{ scope.row.user.username }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="Listing Time" prop="create_time"/>
              </el-table>
            </el-collapse-item>
            <!-- <el-collapse-item name="offer" title="Offer History">
              <el-table :data="offerHistoryList" class="mt-4" max-height="400px" style="width: 100%">
                <el-table-column align="center" label="From" prop="target_user.id">
                  <template #default="scope">
                    {{ scope.row.from_user.username }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="Price" prop="price">
                  <template #default="scope">
                    <span>
                      {{ scope.row.payment_method.code }}
                      {{ scope.row.offer_price }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="Trade Time" prop="create_time"/>
              </el-table>
            </el-collapse-item> -->
          </el-collapse>
        </el-card>
      </div>
      <!--/Product Description-->
      <el-card class="activity">
        <el-collapse model-value="activity">
          <el-collapse-item name="activity">
            <template #title>
              <el-icon>
                <Sort/>
              </el-icon>
              <span>Item Activity</span>
            </template>
            <el-table :data="activityList" stripe>
              <el-table-column align="left" label="Event" min-width="140">
                <template #default="{ row }">
                  {{ formatEventLabel(row.type) }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="Payment Type" min-width="130">
                <!-- <template #default="{ row }">
                  {{ row.type !== 3 ? row.payment_method.code : "-" }}
                </template> -->
              </el-table-column>
              <el-table-column align="center" label="Unit Price" min-width="140">
                <template #default="{ row }">
                  {{ row.type !== 3 ? row.amount : "-" }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="From" min-width="140">
                <template #default="{ row }">
                  {{ (row.from_user && row.from_user.full_name) || "-" }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="To" min-width="140">
                <template #default="{ row }">
                  {{ (row.to_user && row.to_user.full_name) || "-" }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="Date" min-width="160">
                <!-- <template #default="{ row }">
                  {{ getTimeGap(row["create_time"]) }}
                </template> -->
              </el-table-column>
              <el-table-column align="left" label="Transaction ID" min-width="140" show-overflow-tooltip>
                <template #default="{ row }">
                  <a v-if="row['tx_id']" :href="`${rChainUrl}/transaction/${row['tx_id']}`" target="_blank">
                    {{ row["tx_id"] }}
                  </a>
                  <span v-else>-</span>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :current-page="activityPageIndex"
              :page-size="activityPageSize"
              :pager-count="5"
              :total="activityTotal"
              layout="prev,pager,next,total"
              @current-change="queryActivityList"
            ></el-pagination>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <!-- <VoteInfo
        v-if="voteList && voteList.length>0"
        :vote-list="voteList"
        class="vote-info"
        @is-voting="getDetailData"
      /> -->
      <!-- <template v-else></template> -->
      <!--Product Detail-->
      <!-- <el-card class="detail">
        <el-tabs stretch>
          <el-tab-pane label="Additional DETAIL">
            <el-form :label-position="labelPosition" label-suffix=" :" label-width="auto">
              <el-form-item label="Transaction ID">
                <span class="detail-info">{{ productDetail["transaction_id"] }}</span>
              </el-form-item>
              <el-form-item label="Smart Contract ID">
                <span class="detail-info">{{ productDetail["smart_contract_id"] }}</span>
              </el-form-item>
              <el-form-item label="Smart Contract Address">
                <a
                  v-if="productDetail['smart_contract_address'] && productDetail['smart_contract_address'].length>0"
                  :href="`https://sepolia.etherscan.io/tx/${productDetail['smart_contract_address']}`"
                  class="detail-info"
                  target="_blank"
                >
                  {{ productDetail["smart_contract_address"] }}
                </a>
                <span v-else class="detail-info">-</span>
              </el-form-item>
              <el-form-item :class="{ 'form-item-inline': labelPosition === 'top' }" label="Token ID">
                <span class="detail-info">{{ productDetail["token_id"] }}</span>
              </el-form-item>
              <el-form-item :class="{ 'form-item-inline': labelPosition === 'top' }" label="Token Standard">
                <span class="detail-info">ERC721</span>
              </el-form-item>
              <el-form-item :class="{ 'form-item-inline': labelPosition === 'top' }" label="Blockchain">
                <span class="detail-info">R Chain & Ethereum</span>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="ENDORSEMENT">
            <el-form
              v-if="productDetail['meta_data']"
              :label-position="labelPosition"
              label-suffix=" :"
              label-width="auto"
            >
              <el-form-item label="Endorser Information">
                <span class="detail-info">{{ productDetail["meta_data"]["lawyer_name"] }}</span>
              </el-form-item>
              <el-form-item label="Endorsement Link">
                <a :href="productDetail['meta_data']['link']" class="detail-info" target="_blank">
                  {{ productDetail["meta_data"]["link"] }}
                </a>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card> -->
      <!--/Product Detail-->
    </div>
    <!-- Footer  -->
    <!-- <Footer></Footer> -->
  </div>
</template>

<style lang="scss" scoped>
$detail-text-color: #5e5e5e;

.page-wrap {
  height: 100%;
  min-height: 100vh;
  background-color: #eeeeee;

  .whisky-container {
    margin: 0 auto;
    padding: 10px 60px;

    //基本信息
    .product {
      width: 100%;
      height: 750px;
      display: flex;

      .info {
        position: relative;
        left: 100px;
        width: 450px;
        min-width: 450px;
        min-height: 220px;
        background-color: #fff;
        margin: auto 0;
        //transform: translateX(100px);
        padding-bottom: 10px;

        .avatar {
          width: 68px;
          height: 68px;
          background-color: transparent;
          margin: 40px auto 0;
          border-color: transparent;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .collection-name {
          position: relative;
          font-size: 16px;
          line-height: 28px;
          letter-spacing: 0.5px;
          text-align: left;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: break-all;
          overflow: hidden;
          color: $detail-text-color;
        }

        .name {
          position: relative;
          font-size: 30px;
          line-height: 38px;
          letter-spacing: 0.5px;
          text-align: left;
          text-transform: uppercase;
          //text-overflow: ellipsis;
          //white-space: nowrap;
          //word-break: break-all;
          //overflow: hidden;
          word-break: break-word;
          color: $detail-text-color;
          border-bottom: 1px solid #ccc;
        }

        .card-media,
        :deep(.card-media) {
          border-color: transparent;
          padding-bottom: 0;
        }

        .bottle-info {
          line-height: 28px;
          font-size: 20px;

          &-name {
            text-transform: uppercase;
            color: #c3c3c3;
            display: inline-block;

            &::after {
              content: ":";
            }
          }

          &-value {
            margin-left: 10px;
            font-size: 18px;
            color: var(--el-text-color-primary);
            display: inline-block;
          }
        }

        .price {
          //height: 38px;
          height: 24px;
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 10px;

          .coin,
          .eth {
            width: 35.76px;
            height: 38px;
            background-image: url("~@/assets/images/coin.png");
            background-repeat: no-repeat;
            background-size: cover;
            vertical-align: bottom;
            flex: 0 0 auto;
          }

          .number {
            //font-size: 24px;
            //line-height: 38px;
            font-size: 18px;
            line-height: 24px;
            font-weight: normal;
            letter-spacing: 0.5px;
            color: #5e5e5e;
            word-break: break-all;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: center;

            &:after {
              content: "+";
              margin-left: 5px;
            }
          }
        }

        .rate-price {
          font-size: 20px;
          line-height: 36px;
          margin-top: 10px;
          color: #909399;
          letter-spacing: 0;
          display: flex;
          justify-content: center;
          gap: 10px;

          &:before {
            content: "(~";
            flex: 0 0 auto;
          }

          &:after {
            content: ")";
            flex: 0 0 auto;
          }

          > div {
            display: inline-block;
          }

          .eth,
          .coin {
            width: 26.41px;
            height: 36px;
            background-image: url("~@/assets/images/eth.svg");
            background-repeat: no-repeat;
            background-size: contain;
            vertical-align: bottom;
            flex: 0 0 auto;
          }

          .number {
            word-break: break-all;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        }

        .creator {
          margin-top: 40px;
          //transform: scale(0.85);
          border-top: 1px solid #ccc;
          border-bottom: 1px solid #ccc;

          :deep(.card-media) {
            a:not(.btn-primary),
            p {
              color: $detail-text-color;
            }

            a:hover {
              color: #c2c2c2;
            }
          }
        }

        .actions {
          margin-top: 50px;

          :deep(h3) {
            color: $detail-text-color;
          }
        }
      }

      .image {
        width: 100%;
        min-width: 400px;
        height: 100%;
        float: right;

        img,
        video,
        audio {
          width: 100%;
          height: 100%;
        }

        img {
          object-fit: cover;
        }

        .audio-container {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          background-color: #f8f8f8;
          border-radius: 10px;

          .el-icon {
            flex: 1;
          }

          audio {
            height: 30px;
            flex: 0 0 auto;
          }
        }
      }
    }

    //简介 及 历史记录
    .description {
      margin-top: 30px;
      display: grid;
      grid-template-rows: 1fr;
      grid-template-columns: repeat(2, 1fr);
      grid-column-gap: 50px;

      .info {
        color: $detail-text-color;

        .title {
          font-size: 36px;
          line-height: 52px;
          font-weight: normal;
          letter-spacing: 0;
        }

        .detail {
          //margin-top: 20px;
          font-size: 14px;
          line-height: 20px;
          font-weight: normal;
          letter-spacing: 0;
        }
      }

      .history {
        --el-card-padding: 0;

        background-color: #fff;
        padding: 0;

        :deep(.el-collapse) {
          --el-collapse-border-color: #ccc;
          --el-collapse-header-font-size: 16px;
          --el-collapse-header-text-color: #5e5e5e;
          --el-collapse-content-bg-color: #fff;
          --el-collapse-content-text-color: #5e5e5e;

          border-top: none;

          .el-collapse-item__header {
            padding-left: 50px;
            padding-right: 30px;
          }

          .el-collapse-item__wrap {
            padding: 0 20px;
          }

          .el-table {
            --el-table-bg-color: #fff;
            --el-table-tr-bg-color: #fff;
            --el-table-header-bg-color: #fff;
            --el-table-row-hover-bg-color: rgba(255, 255, 255, 0.12);
            --el-table-current-row-bg-color: #fff;
            --el-table-header-text-color: #5e5e5e;
            --el-table-text-color: #5e5e5e;

            a {
              color: #c2c2c2;

              &:hover {
                color: darken(#c2c2c2, 30%);
              }
            }
          }

          .chart-empty {
            background-color: #fff;
            color: var(--el-text-color-secondary);
            text-align: center;
            font-size: 14px;
            line-height: 16px;
          }
        }
      }
    }

    // 交易信息
    .activity {
      margin-top: 30px;

      :deep(.el-card__body) {
        padding: 0;

        .el-collapse {
          border: none;

          .el-collapse-item__header {
            padding-left: 20px;
            font-size: 20px;
            line-height: 30px;
            color: $detail-text-color;
            font-weight: normal;
            letter-spacing: 0;

            .el-icon {
              margin-right: 20px;
            }
          }

          .el-collapse-item__content {
            padding: 20px;

            .el-pagination {
              margin-top: 20px;
              justify-content: center;

              .el-pagination__total {
                margin-left: 10px;
              }
            }
          }
        }
      }
    }

    .vote-info {
      margin-top: 30px;
    }

    // 详情
    > .detail {
      margin-top: 30px;

      :deep(.el-tabs__nav) {
        --el-color-primary: #5e5e5e;
      }

      :deep(.el-tabs__item) {
        --el-text-color-primary: #c2c2c2;

        font-size: 18px;
        text-transform: uppercase;
      }

      :deep(.el-tab-pane) {
        min-height: 300px;
        padding-top: 30px;

        .el-form-item {
          --font-size: 17px;
          margin-bottom: 0;
          border-bottom: 1px solid #ccc;

          &:nth-of-type(end) {
            border-bottom: none;
          }

          &.form-item-inline {
            display: flex;

            > label {
              margin-bottom: 0;
              line-height: 32px;
            }
          }

          .detail-info {
            white-space: break-spaces;
            word-break: break-word;
            color: $detail-text-color;
            font-family: Arial, serif;
          }
        }
      }
    }

    @media (max-width: 1280px) {
      .product {
        height: auto;

        .image {
          min-width: 350px;
        }
      }
    }

    @media (max-width: 1240px) {
      .product {
        min-height: 450px;
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 50px;

        .info {
          width: auto;
          min-width: auto;
          left: 0;
          grid-area: 1 / 2;
          margin: 0;
        }
      }
    }

    @media (max-width: 950px) {
      & {
        padding-left: 20px;
        padding-right: 20px;
      }

      .product {
        height: auto;
        display: flex;
        flex-direction: column-reverse;
        gap: 30px;

        .info {
          width: auto;
          height: auto;
          min-width: auto;
          left: 0;

          .price {
            height: auto;
          }

          .price,
          .rate-price {
            .number {
              word-break: break-all;
              white-space: break-spaces;
              overflow: visible;
            }
          }
        }

        .image {
          min-width: auto;
          height: 300px;
        }
      }

      .description {
        margin-top: 30px;
        display: flex;
        flex-direction: column-reverse;
        gap: 30px;
      }
    }
  }
}
</style>
