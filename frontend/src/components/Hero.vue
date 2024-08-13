<template>
  <div class="hero-wrap">
    <div class="container">
      <div class="row align-items-center justify-content-center flex-md-row-reverse">
        <div class="col-lg-6 col-sm-9 col-md-6">
          <div class="hero-image hero-image-mobile animatedBanner">
            <img src="@/assets/images/whisky/bg-header.png" alt="" class="w-100" />
          </div>
        </div>
        <div class="col-lg-6 col-md-6">
          <div class="hero-content">
            <h1 class="hero-title mb-4">Swimming into this amazing <span style="color: #c2c2c2">world</span></h1>
          </div>
          <!-- hero-content -->
        </div>
        <!-- col-lg-6 -->
      </div>
    </div>
    <!-- .container-->
  </div>
  <!-- end hero-wrap -->
</template>

<script>
// Import component data. You can change the data in the store to reflect in all component
import SectionData from "@/libs/store.js";

export default {
  name: "Hero",
  data() {
    return {
      SectionData,
    };
  },
  mounted() {
    /*  =======================================================
        Countdown
    ========================================================== */
    function countDownTimer(selector) {
      let elem = document.querySelectorAll(selector);
      if (elem.length > 0) {
        elem.forEach((item) => {
          let itemid = item.id;
          let exptime = item.dataset.expTime;
          let expMessage = item.dataset.expMessage ? item.dataset.expMessage : "Countdown Ended";
          // eslint-disable-next-line no-unused-vars
          const year = new Date().getFullYear();
          const choosenDate = new Date(exptime).getTime();

          // eslint-disable-next-line no-unused-vars
          let countdown = setInterval(function () {
            const today = new Date().getTime();
            const diff = choosenDate - today;
            let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((diff % (1000 * 60)) / 1000);

            if (choosenDate >= today) {
              if (document.getElementById(itemid) != null) {
                document.getElementById(
                  itemid
                ).innerHTML = `<div class="countdown-item"><span class="countdown-amount">${hours}</span><span class="countdown-text"> Hours</span></div>
                   <div class="countdown-item"><span class="countdown-amount">${minutes}</span><span class="countdown-text"> Minutes</span></div>
                   <div class="countdown-item"><span class="countdown-amount">${seconds}</span><span class="countdown-text"> Seconds</span></div>`;
              }
            } else {
              document.getElementById(itemid).innerHTML = `<div class="countdown-note">${expMessage}</div>`;
            }
          }, 1000);
        });
      }
    }
    countDownTimer(".countdown-timer");
  },
};
</script>

<style scoped>
.animatedBanner {
  animation: floating 5s linear infinite;
  padding: 100px 0;
}
</style>