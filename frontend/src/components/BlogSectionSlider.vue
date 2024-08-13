<template>
  <swiper
    :modules="modules"
    :slides-per-view="2"
    :breakpoints="{
      0: {
        slidesPerView: 1,
      },
      767: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 2,
      },
    }"
    :pagination="{ clickable: true }"
  >
    <swiper-slide v-for="item in blogList" :key="item.id">
      <div class="card card-full card-blog pb-3">
        <router-link
          :to="{ name: 'buyerDashboard' }"
          class="d-block card-image"
        >
          <img :src="item.image" class="card-img-top" alt="" />
        </router-link>
        <div class="card-body card-body-s1" style="height: 141px">
          <div class="d-flex align-items-center card-author mb-3">
            <div
              class="flex-shrink-0 avatar avatar-2"
            >
              <img :src="item.author.avatar || require('@/assets/images/default_avatar.jpg')" alt="" class="rounded-circle" />
            </div>
            <div class="flex-grow-1 ms-2 text-white">
              <span>{{ item.author.username }}</span>
            </div>
          </div>
          <h4 class="card-title mb-3">
            <router-link
              :to="{ name: 'buyerDashboard' }"
              style="line-height: 29px"
              >{{ item.title }}</router-link
            >
          </h4>
        </div>
        <hr class="my-0" />
        <div class="card-body card-body-s1 py-3">
          <div class="card-action-info" v-if="item.create_time">
            <span
              ><em class="ni ni-calender-date me-1"></em
              >{{ item.create_time }}</span
            >
            <span>
              <span  class="me-3">
                <img style="margin-right: 4px;margin-bottom: 2px;width: 14px; height: auto;" :src="require('@/assets/images/heart.png')" />{{ item.like_count }}
              </span>
              <span>
                <img style="margin-right: 4px;margin-bottom: 2px;width: 14px; height: auto;" :src="require('@/assets/images/comments.png')" />{{ item.comment_count }}</span
              >
            </span>
          </div>
        </div>
        <router-link
          class="details"
          :to="{
            name: 'buyerDashboard',
            query: { id: item.id },
          }"
        >
        </router-link>
      </div>
    </swiper-slide>
  </swiper>
  <div>

  </div>
</template>
<script>
// Import component data. You can change the data in the store to reflect in all component
import SectionData from "@/libs/store.js";

// core version + navigation, pagination modules:
import SwiperCore, { Pagination } from "swiper";

// configure Swiper to use modules
SwiperCore.use([Pagination]);

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";
import apis from '@/x/server';

export default {
  name: "BlogSectionSlider",
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      // SectionData.blogData.blogList
      SectionData,
      blogList: [
        { id: 1, author: {} },
        { id: 2, author: {} },
        { id: 3, author: {} },
      ],
      // blogImages: [
      //   "https://images.complex.com/complex/images/c_fill,dpr_auto,f_auto,q_auto,w_1400/fl_lossy,pg_1/n2hmckwbs6piochnt4og/ye?fimg-ssr-default",
      //   "https://images.complex.com/complex/images/c_fill,dpr_2.0,f_auto,q_auto,w_1400/fl_lossy,pg_1/x5xkfgwbyssiplwbcjrl/birkin?fimg-ssr",
      //   "https://images.complex.com/complex/images/c_fill,dpr_2.0,f_auto,q_auto,w_1400/fl_lossy,pg_1/ayol5dxylngm35aggrnd/balmain?fimg-ssr"
      // ]
    };
  },
  created() {
    this.queryBlogList();
  },
  setup() {
    return {
      // modules: [Pagination],
    };
  },
  methods: {
    async queryBlogList() {
      const { code, data } = await apis.blog.queryBlogList({
        limit: 6,
        offset: 0,
      });
      if (!code) {
        this.blogList = data.results;
      }
    },
  },
};
</script>

<style lang="css" scoped>
.details {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.card-image {
  height: 202px;
  overflow: hidden;
}
</style>
