<script setup>
import { computed, getCurrentInstance } from "vue";
import { useRouter, useRoute } from "vue-router";
import SectionData from "@/libs/store";

import DefaultAvatar from "@/assets/images/whisky/logo-black.png";

const router = useRouter();
const route = useRoute();

// 设置用户菜单弹出层样式
const avatarPopperOptions = {
  modifiers: [
    {
      name: "arrow",
      enabled: true,
      fn: ({state}) => {
        const {arrow} = state.elements;
        arrow.style.setProperty("display", "none");
      },
    },
  ],
};

const _this = getCurrentInstance().appContext.config.globalProperties;
// 是否已经登陆
const isLogin = computed(() => _this.$store.getters.isLogin);
// 用户头像
const avatar = computed(() => {
  return `https://nft-marketplace-avatar.oss-cn-hongkong.aliyuncs.com/1b75ba13-9338-4a3a-bd1b-20154068c577.png`
});

/**
 * 登陆
 */
const login = () => {
  router.push({ path: "/login", query: { backUrl: encodeURIComponent(route.fullPath) }});
};

/**
 * 注销
 * @returns {Promise<void>}
 */
const logout = async () => {
  _this.$store.dispatch("logout");
  // router.push({path: "/buyerDashboard"});
};

</script>

<template>
  <div class="header-avatar">
    <!--Wallet-->
    <!-- <el-button :icon="Wallet" circle class="btn-wallet"></el-button> -->
    <!--/Wallet-->
    <template v-if="isLogin">
      <!--Avatar-->
      <el-dropdown :popper-options="avatarPopperOptions" placement="bottom-end" trigger="click">
        <el-avatar :src="avatar" class="user-avatar" size="large"></el-avatar>
        <template #dropdown>
          <div class="user-action">
            <h6 class="dropdown-header">Hello John!</h6>
            <el-dropdown-menu>
              <el-dropdown-item v-for="list in SectionData.authorNav" :key="list.id">
                <router-link :to="list.path" class="dropdown-item card-generic-item">
                  <em :class="list.icon" class="ni me-2"></em>{{ list.title }}
                </router-link>
              </el-dropdown-item>
              <el-divider></el-divider>
              <el-dropdown-item>
                <router-link class="dropdown-item card-generic-item" to="/" @click="logout">
                  <em class="ni ni-power me-2"></em>Logout
                </router-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </div>
        </template>
      </el-dropdown>
    </template>
    <template v-else>
      <el-button-group>
        <el-button class="btn-login" @click="login">Login</el-button>
      </el-button-group>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";

.search-input {
  --el-bg-color: transparent;
  --el-color-info: var(--el-color-primary);
  --el-border-radius-base: 4px;
  --el-input-hover-border-color: var(--el-color-primary);
  --el-input-bg-color: #eee;

  flex: 0 0 auto;
  width: 215px;

  :deep(input) {
    text-transform: none;
  }

  :deep(.el-input-group__append) {
    box-shadow: none;
  }

  :deep(.el-button) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    background-color: var(--el-button-bg-color, #343a47);

    &:hover {
      background-color: var(--el-color-primary, #343a47);
      color: #fff;
    }
  }
}

.header-avatar {
  --el-bg-color: var(--el-button-bg-color, #343a47);

  position: relative;
  top: 0;
  height: 40px;
  float: right;
  pointer-events: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0 0 25px;
  background-color: transparent;
  gap: 10px;

  .user-avatar {
    //width: 3.125rem;
    //height: 3.125rem;
    width: 40px;
    height: 40px;
    border: 3px solid #eee;
    border-radius: 50%;
    background-color: #eee;
    cursor: pointer;
  }

  .btn-login {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  .btn-register {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  .btn-mobile-search,
  .btn-wallet {
    // display: none;
  }

  .btn-search,
  .btn-wallet,
  .btn-login,
  .btn-register {
    --el-button-text-color: var(--el-color-primary);
    --el-button-hover-text-color: #fff;
  }

  @media (max-width: 1169px) {
    .search-input {
      display: none;
    }

    .btn-mobile-search,
    .btn-wallet {
      display: flex;
    }
  }

  @media (max-width: 1024px) {
    margin-left: 0;
    margin-right: 20px;
    float: none;
    // position: absolute;
    // right: 140px;

    .over-white-section & {
      display: none;
    }

    .user-avatar {
      width: 33px;
      height: 33px;
    }

    .btn-login,
    .btn-register {
      //display: none;
    }
  }

  @media only screen and (max-width: 767px) {
    right: 60px;
    gap: 5px;
  }
}

.user-action {
  @apply min-w-[150px];
  padding: 10px 10px 0 10px;
  background-color: $white;
  border-radius: var(--el-popper-border-radius);

  .el-dropdown-menu {
    background-color: transparent;

    :deep(.el-dropdown-menu__item) {
      &:nth-of-type(odd) {
        padding: 0 0.4rem;
      }

      &:not(.is-disabled):focus {
        background-color: transparent;
        color: transparent;
      }

      padding: 5px 0.4rem;
      border-radius: 0.25rem;
    }

    .dropdown-item {
      &:hover,
      &.active {
        background-color: #fff;
        color: $primary;
      }
    }
  }

  .el-divider {
    margin: 5px 0 0;
    width: auto;
  }

  .dark-mode & {
    background-color: $black-3;

    .el-dropdown-menu {
      color: $white;

      .dropdown-item {
        color: $white;

        &:hover {
          color: $white;
          background-color: $black-4;
        }

        &.active {
          background-color: $white-2;
          color: $dark2;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.el-dropdown__popper.el-popper[role="tooltip"].header-btn-mobile-search-popper {
  --el-color-white: #eee;
  border-radius: 30px;
  background: #eee;
  border-color: transparent;

  .el-input__inner {
    box-shadow: none;
  }
}
</style>