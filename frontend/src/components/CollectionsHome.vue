<template>
  <div class="page-wrap">
    <!-- account section -->
    <section class="user-panel-section">
      <!-- end gap -->
      <div class="row g-gs">
        <div
          class="col-xl-3 col-lg-4 col-sm-6"
          v-for="item in userCollectionsItems"
          :key="item.id"
        >
          <div class="card card-full" style="height: 345px;">
            <div
              class="card-image card-image-bg"
              :style="{
                'background-image': `url(${item.featured_image}), url('@/assets/images/loading.gif')`,
                'background-position': `center center`,
              }"
              @click="toCollectionDetail"
            ></div>
            <div class="card-body p-4">
              <h5
                class="card-title text-truncate mb-0"
                @click="toCollectionDetail"
              >
                {{ item.name }}
              </h5>
              <div class="card-author mb-1 d-flex align-items-center" v-if="item.user.id">
                <span class="me-1 card-author-by">Created By</span>
                <div class="custom-tooltip-wrap">
                  <!-- <router-link
                    :to="{ name: 'author', query: { id: item.user.id } }"
                    class="custom-tooltip author-link"
                    style="color: #c1c1c1;"
                    >@{{ item.user.username }}
                  </router-link> -->
                </div>
                <!-- end custom-tooltip-wrap -->
              </div>
            </div>
            <!-- end card-body -->
          </div>
          <!-- end card -->
        </div>
      </div>
    </section>
    <!-- end user-panel-section -->
  </div>
  <!-- end page-wrap -->
</template>
<script>
import apis from '@/x/server';
export default {
  data() {
    return {
      userCollectionsItems: [
        {
          id:1,
          user:{}
        },
        {
          id:2,
          user:{}
        },
        {
          id:3,
          user:{}
        },
        {
          id:4,
          user:{}
        },
        {
          id:5,
          user:{}
        },
        {
          id:6,
          user:{}
        },
        {
          id:7,
          user:{}
        },
        {
          id:8,
          user:{}
        }
      ],
    };
  },
  created() {
    this.queryCollectionList();
  },
  methods: {
    async queryCollectionList() {
      const { code, data } = await apis.nft.queryCollectionListFilter({
        limit: 8,
        offset: 0,
      });
      console.error(code, data)
      if (!code) {
        this.userCollectionsItems = data.results;
        this.total = data.count;
      }
    },
    toCollectionDetail() {
      this.$router.push({
        name: "buyerNftDetail"
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.card-image {
  height: 240px;
  overflow: hidden;
}
.btns-group {
  margin-top: 0;
}
.card {
  &:hover {
    cursor: pointer;
  }
}

.details {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
</style>
