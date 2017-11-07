"use strict";

$(() => {
  // Плавный скроллинг к элементу
  $('a[href*="#"]').not('[href="#"]').not('[href="#0"]').click(e => {
    $('html,body').stop().animate({
      scrollTop: $(e.currentTarget.hash).offset().top
    }, 1000);
    e.preventDefault();
  });
});