<template>
  <div class="section-head !pb-[10px] text-center">
    <div class="header-shape"></div>
    <div class="section-header style-4">
      <h3 :class="isMargin" v-html="text"></h3>
      <p>{{ content }}</p>
    </div>
  </div>
  <!-- end section-head -->
</template>
<script>
import SectionData from "@/libs/store.js";

export default {
  name: "SectionHeading",
  props: ["text", "content", "isMargin"],
  data() {
    return {
      SectionData,
    };
  },
};
</script>

<style lang="scss" scoped>
.section-head {
  width: 100%;
  max-width: 100%;
}

.section-header {
  //border: 1px solid rgba(81, 56, 238, 0.2);
  //box-shadow: 0 0 10px rgb(3 0 16 / 20%);
  padding: 10px 0;
  gap: 20px;
  border-radius: 3px;
  background: #eee;
  justify-content: space-between;
  flex-wrap: wrap;
  box-sizing: border-box;
}

.section-header .header-title {
  gap: 10px;
}

.section-header .header-title h3 {
  text-transform: uppercase;
}

.section-header .style-4 {
  border: none;
  box-shadow: none;
  padding: 0;
  background: transparent;
  border-radius: unset;
  display: inherit;
  text-align: center;
  margin-bottom: 40px;
  position: relative;
}

.section-header.style-4 .header-shape {
  /* top: 50%; */
  left: 0;
  transform: translateY(-50%);
  width: 100%;
  position: relative;
  content: "";
  margin-left: 0px;
  margin-top: 0px;
  display: inline-block;
  box-sizing: border-box;
  text-align: center;
}

.section-header.style-4 .header-shape span {
  background: #ffffff;
  height: 1px;
  display: block;
  box-sizing: border-box;
  text-align: center;
}

.header-shape {
  content: "";
  width: 5%;
  /* left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); */
  height: 11px;
  /* border-top: 2px solid transparent; */
  border-bottom: 2px solid transparent;
  border-image: linear-gradient(125deg, #0d7867 0%, #6fd0c6 37%, #ffbe3c 100%);
  border-image-slice: 1;
  position: relative;
  box-sizing: border-box;
  text-align: left;
}

.section-header.style-4 h3 {
  position: relative;
  z-index: 1;
  background-color: #eee;
  text-transform: uppercase;
  display: inline-block;
  width: 100%;
  text-align: left;
  font-weight: 500;
}

.section-header.style-4 p {
  text-align: left !important;
}

.dark-mode {
  .section-header {
    background-color: #000;

    &.style-4 h3 {
      background-color: #000;
    }
  }
}

</style>
