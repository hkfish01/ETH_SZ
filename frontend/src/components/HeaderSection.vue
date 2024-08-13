<template>
  <div class="is-sticky bg-white">
    <div class="container flex items-center">
      <router-link to="/" class="logo-link">
        <img class="logo-dark logo-img" :src="require('@/assets/images/whisky/logo-black.png')" alt="logo" />
      </router-link>
      <div class="header-wrap ml-auto">
        <Avatar class=""/>
      </div>
    </div>
  </div>
</template>
<script>
import Avatar from "./Avatar.vue";

export default {
  components: {
    Avatar,
  },
  name: "HeaderSection",
  computed: {
    isLogin() {
      return this.$store.getters.isLogin;
    },
  },
};
</script>
<style scoped lang="scss">
.test-msg {
  width: 100%;
  // height:30px;
  background-color: #fed03d;
  color: #000000;
  text-align: center;
}

.ethPriceClass {
  width: 100%;
  color: #222;
  font-weight: bold;
}

.ethPriceClass ul {
  list-style: none;
}

.ethPriceClass ul li {
  margin-left: 10px;
  margin-right: 20px;
  display: inline-block;
}

.ethPriceClass ul li span {
  color: #fed03d;
}
</style>
