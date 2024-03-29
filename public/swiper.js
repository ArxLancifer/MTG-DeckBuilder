const swiper = new Swiper(".mySwiper", {
    effect: "cards",
    grabCursor: true,
    cardsEffect: {
        // ...
        slideShadows: false
      }
  });

  const swiperSearchedSlide = new Swiper(".swiperSearchedSlide", {
    slidesPerView: 1,
    spaceBetween: 1,
    slidesPerGroup: 1,
    lazy: true,
    observer:true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });