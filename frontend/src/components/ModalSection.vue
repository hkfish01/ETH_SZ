<template>
  <div class="modal" v-if="modelValue" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <slot name="title"><h5 class="modal-title">{{title}}</h5></slot>
          <button
            type="button"
            class="btn-close icon-btn"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="cancelHandler"
          >
            <em class="ni ni-cross"></em>
          </button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer" v-if="showFooter">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="cancelHandler"
          >
            {{cancelButtonText}}
          </button>
          <button type="button" class="btn btn-primary" @click="confirm">{{confirmButtonText}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
    name:"modal-section",
    props:{
      modelValue:{
        type: Boolean,
        default: false,
      },
      title:{
          type: String,
      },
      showFooter:{
        type: Boolean,
        default: true
      },
      confirmButtonText:{
          type: String,
          default:"Confirm"
      },
      cancelButtonText:{
          type: String,
          default:"Cancel"
      }
    },
    methods:{
      cancelHandler(){
        this.$emit("update:modelValue", false)
      },
      confirm(){
          this.$emit("confirm")
      }
    }
}
</script>
<style lang="scss" scoped>
.modal{
  display:block;
  top:0;
  margin:auto;
  z-index:10001;
  background-color: rgba(0,0,0,0.8);
}

.modal-dialog{
  top: 50%;
  transform: translateY(-50%);
}
</style>
