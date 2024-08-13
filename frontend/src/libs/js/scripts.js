'use strict';

const _navbar_fixed = 'has-fixed';

/*  =======================================================
  Sticky navbar on scroll down
========================================================== */
function stickyMenu(selector) {
  let elem = document.querySelectorAll(selector);
  if(elem.length > 0){
    elem.forEach(item => {
      let _item_offset = item.offsetTop;
      window.addEventListener("scroll", function () {
        if(window.scrollY > _item_offset){
          item.classList.add(_navbar_fixed);
        }else{
          item.classList.remove(_navbar_fixed);
        }
      });
    });
  }
}
stickyMenu('.is-sticky');
