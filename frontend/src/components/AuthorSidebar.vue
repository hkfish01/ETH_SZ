<template>
  <div>
    <div class="sidebar mb-5 mb-xl-0 row">
      <div class="sidebar-hero mt-4 flex flex-col items-center">
        <img class="sidebar-avatar" :src="userInfo.avatar || require('@/assets/images/default_avatar.jpg')" />
        <h4 class="mt-3" style="font-size: 24px">
          {{ userInfo.full_name }}
        </h4>
        <p class="mt-2" style="font-size: 18px; color: #fff">@{{ userInfo.username }}</p>
      </div>
      <div class="col-md-6 col-lg-6 col-xl-12 sidebar-widget">
        <!-- <h3 class="mb-3">
          {{ SectionData.authorSidebarData.sidebarWidget.title }}
        </h3> -->
        <p class="sidebar-text mt-4 mb-3" style="text-align: center; font-size: 15px">{{ content }}</p>

        <slot name="button"></slot>
        <!-- <button class="btn btn-primary mt-4 mb-4 fw-bold" style="display: block;width: 100%;">Follow</button> -->

        <div class="sidebar-text text-dark-gray" style="font-size: 15px">
          <el-row class="mt-2" justify="space-between">
            {{ followingtext }}
            <strong>{{ followingnum }}</strong>
          </el-row>
          <el-row class="mt-2" justify="space-between">
            {{ followertext }}
            <strong>{{ followernum }}</strong>
          </el-row>
        </div>
        <!-- <div class="follow-wrap mt-3">
          <p class="mb-2 text-black fw-semibold">
            {{ SectionData.authorSidebarData.sidebarWidget.followText }}
          </p>
          <AvatarGroupSection>
            <div class="btn btn-link" style="padding: 5px 20px; height: 36px" @click="showFollowModal">
              {{ SectionData.authorSidebarData.sidebarWidget.btnText }}
            </div>
          </AvatarGroupSection>
        </div> -->
      </div>
      <!-- end col -->
      <div class="col-md-6 col-lg-6 col-xl-12 sidebar-widget">
        <h3 class="mb-3" v-if="showLinks">
          {{ SectionData.authorSidebarData.sidebarWidgetTwo.title }}
        </h3>
        <ul class="social-links">
          <li v-for="link in links" :key="link.path" v-show="link.path">
            <a :href="link.path" style="border-radius: 20px">
              <img class="icon" style="width: 18px; height: auto" :src="link.icon" />{{ link.title }}
            </a>
          </li>
        </ul>
      </div>
      <!-- end col -->
      <div class="col-md-6 col-lg-6 col-xl-12 mb-5 sidebar-widget">
        <h3 class="mb-2">
          {{ SectionData.authorSidebarData.sidebarWidgetThree.title }}
        </h3>
        <p class="sidebar-text">{{ datetext }}</p>
      </div>
      <!-- end col -->
    </div>
    <!-- end sidebar -->
    <!-- Modal -->
    <ModalSection v-model="followVisible" :show-footer="false">
      <template #title>
        <div class="follow-tab-nav-bar">
          <span
            class="follow-tab-nav"
            :class="{ active: currentTab === 'FollowingSection' }"
            @click="changeTab('FollowingSection')"
            >Following</span
          >
          <span
            class="follow-tab-nav"
            :class="{ active: currentTab === 'FollowersSection' }"
            @click="changeTab('FollowersSection')"
            >Followers</span
          >
        </div>
      </template>
      <slot>
        <keep-alive>
          <component :is="currentTab"></component>
        </keep-alive>
        <!-- <div class="follow-tab-content">
            <FollowingSection v-if="currentTab === 'following'"></FollowingSection>
            <FollowersSection v-if="currentTab === 'followers'"></FollowersSection>
          </div> -->
      </slot>
    </ModalSection>
    <!-- <div
      class="modal fade"
      id="followersModal"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <ul
              class="nav nav-tabs nav-tabs-s1 nav-tabs--s1"
              id="myTabTwo"
              role="tablist"
            >
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  id="following-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#following"
                  type="button"
                  role="tab"
                  aria-controls="following"
                  aria-selected="false"
                >
                  {{ SectionData.followersModal.btnText }}
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link active"
                  id="followers-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#followers"
                  type="button"
                  role="tab"
                  aria-controls="followers"
                  aria-selected="true"
                >
                  {{ SectionData.followersModal.btnTextTwo }}
                </button>
              </li>
            </ul>
            <button
              type="button"
              class="btn-close icon-btn"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <em class="ni ni-cross"></em>
            </button>
          </div>
          <div class="modal-body">
            <div class="tab-content" id="myTabContentTwo">
              <div
                class="tab-pane fade"
                id="following"
                role="tabpanel"
                aria-labelledby="following-tab"
              >
                <div class="item-detail-tab-wrap">
                  <div
                    class="card-follow d-flex align-items-center justify-content-between mb-3"
                    v-for="item in SectionData.followersModal.followingList"
                    :key="item.id"
                  >
                    <div class="d-flex align-items-center">
                      <a :href="item.path" class="avatar flex-shrink-0 me-2">
                        <img :src="item.avatar" alt="avatar" />
                      </a>
                      <div class="flex-grow-1">
                        <p class="fw-semibold fs-14 lh">
                          <a :href="item.path" class="text-black">{{
                            item.title
                          }}</a>
                        </p>
                        <span class="d-block fw-medium fs-15">{{
                          item.userName
                        }}</span>
                      </div>
                    </div>
                    <button type="button" class="btn btn-sm btn-light btn-show">
                      {{ item.btnText }}
                    </button>
                    <button type="button" class="btn btn-sm btn-light btn-hide">
                      <em class="ni ni-user-add"></em>
                    </button>
                  </div>

                </div>

              </div>

              <div
                class="tab-pane fade show active"
                id="followers"
                role="tabpanel"
                aria-labelledby="followers-tab"
              >
                <div class="item-detail-tab-wrap">
                  <div
                    class="card-follow d-flex align-items-center justify-content-between mb-3"
                    v-for="item in SectionData.followersModal.followerList"
                    :key="item.id"
                  >
                    <div class="d-flex align-items-center">
                      <a :href="item.path" class="avatar flex-shrink-0 me-2">
                        <img :src="item.avatar" alt="avatar" />
                      </a>
                      <div class="flex-grow-1">
                        <p class="fw-semibold fs-14 lh">
                          <a :href="item.path" class="text-black">{{
                            item.title
                          }}</a>
                        </p>
                        <span class="d-block fw-medium fs-15">{{
                          item.userName
                        }}</span>
                      </div>
                    </div>
                    <button type="button" class="btn btn-sm btn-light btn-show">
                      {{ item.btnText }}
                    </button>
                    <button type="button" class="btn btn-sm btn-light btn-hide">
                      <em class="ni ni-user-add"></em>
                    </button>
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>

      </div>

    </div> -->
    <!-- end modal-->
  </div>
</template>
<script>
// Import component data. You can change the data in the store to reflect in all component
import SectionData from "@/libs/store.js";

export default {
  name: "AuthorSidebar",
  props: [
    "userInfo",
    "content",
    "followingnum",
    "followingtext",
    "followernum",
    "followertext",
    "datetext",
    "avatars",
    "links",
  ],
  data() {
    return {
      SectionData,
      followVisible: false,
      currentTab: "FollowingSection",
    };
  },
  computed: {
    showLinks() {
      return this.links.some((item) => item.path);
    },
  },
  methods: {
    showFollowModal() {
      this.followVisible = true;
    },
    changeTab(name) {
      this.currentTab = name;
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar {
  padding: 16px;
  background-color: #fff;
  border-radius: 20px;

  .dark-mode & {
    background-color: #09162c;
  }

  .sidebar-widget {
    .btn-link {
      color: var(--bs-primary);
      text-decoration: none;
    }
  }
}

.sidebar-hero {
  text-align: center;
}

.sidebar-avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 2px solid #fff;
}

.btn-view-all {
  font-weight: 700;
  color: #222;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    color: #fed03d;
  }
}

.follow-tab-nav {
  margin-right: 15px;
  font-weight: 700;
  color: #222;
  cursor: pointer;
  font-size: 14px;

  .dark-mode & {
    color: #fff;
  }

  &.active,
  &:hover {
    color: #fed03d;
  }
}
</style>
