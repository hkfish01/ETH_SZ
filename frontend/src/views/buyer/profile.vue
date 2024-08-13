<template>
  <div class="page-wrap">
    <!-- header  -->
    <header class="header-section has-header-main bg-pattern-3">
      <!-- Header main -->
      <HeaderSection></HeaderSection>
    </header>
    <!-- Author section  -->
    <ProfileSection>
      <template #left>
        <AuthorSidebar
          :userInfo="userInfo"
          :content="userInfo.bio"
          :followingnum="userInfo.following_count"
          :followingtext="SectionData.authorSidebarData.sidebarWidget.followingText"
          :followernum="userInfo.follower_count"
          :followertext="SectionData.authorSidebarData.sidebarWidget.followerText"
          :avatars="SectionData.authorSidebarData.sidebarWidget.followersAvatar"
          :links="links"
          :datetext="userInfo.create_time"
        ></AuthorSidebar>
      </template>
    </ProfileSection>
    <!-- Footer  -->
    <!-- <Footer></Footer> -->
  </div>
  <!-- end page-wrap -->
</template>

<script>
// Import component data. You can change the data in the store to reflect in all component
import SectionData from "@/libs/store.js";
import HeaderSection from "@/components/HeaderSection.vue";
import ProfileSection from '@/components/ProfileSection.vue';
import AuthorSidebar from '@/components/AuthorSidebar.vue';

export default {
  name: "Profile",
  data() {
    return {
      SectionData,
    };
  },
  components: { HeaderSection, ProfileSection, AuthorSidebar },
  computed: {
    userInfo() {
      return {
        "id": 16,
        "username": "Wu",
        "tel": null,
        "full_name": "John",
        "token": "ae662e29e709ac58d5fa91b802c690b336ece77b",
        "status": "1",
        "status_display": "Active",
        "type": "1",
        "type_display": "NormalUser",
        "balance": "112200.0000",
        "wallet_id": "0x79b40dc13ac5f00323912de45df60c65fb579046",
        "bank_info": null,
        "create_time": "2024-03-30 23:21:15",
        "update_time": "2024-08-12 20:19:59",
        "email": "hkter33@yahoo.com",
        "avatar": "https://nft-marketplace-avatar.oss-cn-hongkong.aliyuncs.com/1b75ba13-9338-4a3a-bd1b-20154068c577.png",
        "bio": null,
        "facebook_link": null,
        "twitter_link": null,
        "instagram_link": null,
        "web_link": null,
        "nft_count": 8,
        "follower_count": 0,
        "following_count": 0,
        "hold_on_amount": "0.0000",
        "notification_types": [
          3,
          2,
          5,
          1,
          6,
          7,
          10,
          9,
          8,
          4
        ],
        "meta_data": {
          "link": "https://ipfs.io/ipfs/bafkreifp6aratdqvi4ztegug4zyzr4u57vwhaa3muafkog2m264fvuo77a",
          "lawyer_name": "陳你張黃何律師樓",
          "lawyer_public_key": "9312309183918akljdlakakjld0ijd01j4od1809jdoq12"
        }
      }
    },
    links() {
      return [
        {
          class: "ni-globe",
          title: "Web site",
          icon: require("@/assets/images/pinterest@3x.png"),
          path: this.userInfo.web_link,
        },
        {
          class: "ni-facebook-f",
          title: "Facebook",
          icon: require("@/assets/images/facebook@3x.png"),
          path: this.userInfo.facebook_link,
        },
        {
          class: "ni-twitter",
          title: "Twitter",
          icon: require("@/assets/images/Twitter@3x.png"),
          path: this.userInfo.twitter_link,
        },
        {
          class: "ni-instagram",
          title: "Instagram",
          icon: require("@/assets/images/Instagram@3x.png"),
          path: this.userInfo.instagram_link,
        },
      ];
    },
  },
  methods: {},
  mounted() {
  },
};
</script>
