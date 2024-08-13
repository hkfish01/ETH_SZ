<!------------------------------------------- template ------------------------------------------->
<template>
  <div>
    <ul class="btns-group d-flex">
      <li class="flex-grow-1">
        <span class="btn btn-primary d-block" href="#" @click="actionMint">Buy Now</span>
      </li>
    </ul>
  </div>
</template>

<!-------------------------------------------- script -------------------------------------------->
<script setup>
import { isMobileBrowser } from "@/x/tools"
import web3Util from "@/x/utils/web3"
import { ElMessage } from 'element-plus'
// import { ethers } from "ethers"
import { ref } from "vue";
import MintCls from "@/x/utils/mint"
// import BigNumberjs from "bignumber.js";
const MintClsInstance = MintCls.instance
import { ElLoading } from 'element-plus'
import { useRouter } from "vue-router"
const router = useRouter()

// const hasFinished = ref(false);
const txId = ref("")
const tokenId = ref("")

async function actionMint() {
  if(!web3Util.web3) {
    if(isMobileBrowser()) {
      location.href = `https://metamask.app.link/dapp/${location.href.replace(/http:\/\/|https:\/\//, '')}`
    } else {
      location.href = `https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn`
    }
    return false
  }
  const chainId = await window.ethereum.request({ method: 'eth_chainId' })
  console.error(chainId)
  if(chainId !== '0xaa36a7') {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }]
      })
    } catch (error) {
    }
  }
  let loadingInstance1 = null
  try {
    const accounts = await web3Util.web3.eth.getAccounts();
    const account = accounts[0];
    console.error("mint account", account)
    const mintCost = await MintClsInstance.methods.cost().call()
    MintClsInstance.methods.mint(1).send({
      from: account,
      value: mintCost
    }).on("transactionHash", (hash) => {
      txId.value = hash
      loadingInstance1 = ElLoading.service({ fullscreen: true })
    }).on("receipt", async (res) => {
      console.error(res)
      const encodeTokenId = res.logs[0].topics.pop()
      tokenId.value = window.web3.eth.abi.decodeParameter('uint256', encodeTokenId);
      // hasFinished.value = true
      loadingInstance1.close()
      router.push({ name: 'buyerProfile' })
    }).on("error", (error) => {
      const rejected = "User denied transaction signature.";
      if (error.message && error.message.includes(rejected)) {
        ElMessage.error('We can\'t take your money without your permission.')
        return false;
      }
      if (error) {
        ElMessage.error('There was an issue, please try again.')
        return false;
      }
    });
  } catch (error) {
    console.error(error)
  }
}
</script>

<!-------------------------------------------- style -------------------------------------------->
<style lang="scss" scoped>
.paymentBtn {
  flex: 1;
  height: initial;
  background-color: #ffffff;
}

.paymentBtn:hover {
  background-color: #fed03d;
}
</style>
