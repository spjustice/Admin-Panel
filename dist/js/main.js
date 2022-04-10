function testWebP(callback) {

   var webP = new Image();
   webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
   };
   webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {
   if (support == true) {
      document.querySelector('body').classList.add('webp');
   } else {
      document.querySelector('body').classList.add('no-webp');
   }
});

$(document).ready(function () {
   $('.select__head').on('click', function () {
      let btn = $(this);
      let block = btn.closest('.select');
      let blockBody = block.find('.select__body');

      if (!block.hasClass('active')) {
         block.find('.select__wrap').width(block.find('.select__main').css('width'));
         block.find('.select__wrap').height(block.find('.select__main').css('height'));
         // $('select').find('.select__body').slideUp();
         $('.select').removeClass('active');
         block.addClass('active');
         // blockBody.slideDown();
      } else {
         // blockBody.slideUp();
         block.removeClass('active')
      }

   })
   $('.select__item').on('click', function () {
      let btn = $(this);
      let block = btn.closest('.select');
      let btnText = btn.text()

      block.find('.select__head-item').text(btnText);
      block.removeClass('active');
   })
   $(document).on('click', function (e) {
      if (!e.target.closest('.select')) {
         $('.select').removeClass('active');
      }
   })
})