new Swiper('.swiper-container', {
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  // allowSlidePrev: true,
  // allowSlideNext: true,
  grabCursor: true,
  slidesPerView: 3,
  spaceBetween: 31,
  // centeredSlides: true,
  loop: false, //infinity
  freeMode: true,
  autoplay: {
    delay: 3000,
    stopOnLastSlide: false,
    disableOnInteraction: false,
  },
  speed: 500,
  breakpoints: {
    50: {
      slidesPerView: 1,
    },
    769: {
      slidesPerView: 2,
    },
    1401: {
      slidesPerView: 3,
    }
  },


});