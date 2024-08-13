<template>
  <div class="page-wrap">
    <!-- header  -->
    <header class="header-section has-header-main bg-gradient">
      <HeaderSection></HeaderSection>
      <Hero></Hero>
    </header>
    <!-- collection-section  -->
    <section class="section-space trending-section">
      <div class="container">
        <!-- section heading -->
        <SectionHeading
          :content="collection_home.content"
          :text="collection_home.title"
          isMargin="mb-3"
        ></SectionHeading>
        <!-- product -->
        <CollectionsHome></CollectionsHome>
        <!-- <div class="text-center mt-5">
          <ButtonLink
            :link="collection_home.btnLink"
            :text="collection_home.btnText"
            classname="btn-link"
          />
        </div> -->
      </div>
      <!-- .container -->
    </section>
    <!-- Blog  -->
    <section class="section-space-b blog-section">
      <div class="container">
        <!-- section heading -->
        <SectionHeading
          :content="SectionData.blogData.content"
          :text="SectionData.blogData.title"
          isMargin="mb-3"
        ></SectionHeading>
        <!-- blog section -->
        <BlogSectionSlider></BlogSectionSlider>
        <!-- <div class="text-center mt-5">
          <ButtonLink :text="SectionData.blogData.btnText" classname="btn-link" link="/blog"></ButtonLink>
        </div> -->
      </div>
      <!-- .container -->
    </section>
    <!-- end blog-section -->
    <!-- Promotion  -->
    <section id="promotion" class="section-space-b promotion-section">
      <div class="container">
        <!-- section heading -->
        <SectionHeading isMargin="mb-3" text="Promotion"></SectionHeading>
        <!-- Promotion section -->
        <el-carousel :interval="10000" class="promotion-carousel" indicator-position="outside">
          <el-carousel-item>
            <img alt="" src="@/assets/images/whisky/ads_01.png"/>
          </el-carousel-item>
          <el-carousel-item>
            <img alt="" src="@/assets/images/whisky/ads_02.png"/>
          </el-carousel-item>
          <el-carousel-item>
            <img alt="" src="@/assets/images/whisky/ads_03.png"/>
          </el-carousel-item>
        </el-carousel>
      </div>
    </section>
    <!-- Newsletter  -->
    <!-- <Newsletter></Newsletter> -->
    <!-- Footer  -->
    <!-- <Footer></Footer> -->
  </div>
  <!-- end page-wrap -->
</template>

<script>
// Import component data. You can change the data in the store to reflect in all component
import SectionData from "@/libs/store.js";
import HeaderSection from "@/components/HeaderSection.vue";
import SectionHeading from '@/components/SectionHeading.vue';
import CollectionsHome from "@/components/CollectionsHome.vue";
// import ButtonLink from "@/components/ButtonLink.vue"
import BlogSectionSlider from "@/components/BlogSectionSlider.vue"
import Hero from "@/components/Hero.vue";
import("@/libs/js/scripts");

export default {
  name: "Home-v3",
  components: {
    HeaderSection,
    SectionHeading,
    CollectionsHome,
    // ButtonLink,
    BlogSectionSlider,
    Hero
  },
  data() {
    return {
      SectionData,
      collection_home: {
        title: "SALE NFTS",
        content: "nfts for sale",
        btnText: "View all collection",
        btnLink: "",
      },
      howItWorkData_home: {
        titleTwo: "Mint, Buy and Sell or Just Launch Your Own NFT Store",
        content: "Create and sell your NFTs by just few click",
      },
    };
  },
  mounted() {
  },
};
</script>

<style lang="scss" scoped>
.page-wrap {

}
@media (min-width: 768px) {
  .section-space-t,
  .section-space {
    padding-top: 0;
  }
}

.promotion-carousel {
  width: 100%;

  :deep(.el-carousel__container) {
    height: 800px;

    @media only screen and (max-width: 1466px) {
      height: 600px;
    }

    @media only screen and (max-width: 1000px) {
      height: 300px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
</style>
