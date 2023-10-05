async function load() {
  let { Swiper } = await import('https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.mjs');
  const reactionSwiper = new Swiper('.swiper', {
    freeMode: true,
    slidesPerView: 'auto',
    spaceBetween: 8,
  });
  const cardSwiper = new Swiper(".cardSwiper", {
    spaceBetween: 10,
    initialSlide: 2,
    slidesPerView: 'auto',
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    centeredSlides: true,
    breakpoints: {
      700: {
        spaceBetween: 8,
      },
    },
  });
}

load();