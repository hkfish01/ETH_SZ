<script setup>
import {ref, toRefs, defineOptions, defineProps, defineEmits } from "vue";
import apis from "@/x/server";
import ModalSection from "@/components/ModalSection.vue";
import store from "@/x/store"
defineOptions({
  name: "BottleWithdraw",
})

const props = defineProps({
  withdrawItem: {
    type: Object,
  },
  hasWithdrawedIds: {
    type: Array
  },
  opened: {
    type: Boolean
  }
})

const { withdrawItem } = toRefs(props);

const emits = defineEmits(["queryUserItems"]);

const bottleWithdrawForm = ref({});
const bottleWithdrawModal = ref(false);
const bottleWithdrawFormRef = ref(null);

const bottleWithdrawClick = () => {
  bottleWithdrawForm.value = {};
  bottleWithdrawModal.value = true;
}

const bottleWithdrawConfirm = () => {
  bottleWithdrawFormRef.value.validate(async (isValid) => {
    if (isValid) {
      const { code } = await apis.nft.createNftDetail({
        tokenid: withdrawItem.value.tokenId,
        userId: store.state.buyerToken,
        ...bottleWithdrawForm.value
      })
      if(code === 200) {
        bottleWithdrawModal.value = false;
        bottleWithdrawForm.value = {};
        emits("queryUserItems")
      }
    }
  });
}


</script>

<template>
  <li>
    <button class="btn btn-sm btn-primary" type="button" v-if="opened" disabled>
      Has Opened
    </button>
    <button class="btn btn-sm btn-primary" type="button"  @click="bottleWithdrawClick()" v-else-if="!hasWithdrawedIds.includes(withdrawItem.tokenId)">
      Withdraw
    </button>
    <button class="btn btn-sm btn-primary" type="button" disabled v-else>
      Delivered
    </button>
    <ModalSection v-model="bottleWithdrawModal" style="z-index: 1000" title="" @confirm="bottleWithdrawConfirm">
      <div class="modal-content">
        <div class="modal-body text-center">
          <h4 class="modal-tilte mb-2">Please confirm you want to withdraw this Bottle</h4>
          <div class="card-image">
            <img
              :src="withdrawItem.raw.metadata.image"
              alt="art image"
              class="card-img-top"
            />
          </div>
          <div class="mb-2">
            <el-form ref="bottleWithdrawFormRef" :model="bottleWithdrawForm" label-position="top">
              <el-form-item
                :rules="{ required: true, message: 'Please enter name', trigger: 'blur' }"
                label="name"
                prop="recipientName"
              >
                <el-input v-model="bottleWithdrawForm.recipientName" clearable placeholder="Enter your name"></el-input>
              </el-form-item>
              <el-form-item
                :rules="{ required: true, message: 'Please enter address', trigger: 'blur' }"
                label="address"
                prop="recipientAddress"
              >
                <el-input v-model="bottleWithdrawForm.recipientAddress" clearable placeholder="Enter your address"></el-input>
              </el-form-item>
              <el-form-item
                :rules="{ required: true, message: 'Please enter tel', trigger: 'blur' }"
                label="tel"
                prop="recipientPhone"
              >
                <el-input v-model="bottleWithdrawForm.recipientPhone" clearable placeholder="Enter your tel"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </ModalSection>
  </li>
</template>

<style lang="scss" scoped>
.btn {
  position: relative;
  z-index: 2;
}
</style>