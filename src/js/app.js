import $ from 'jquery';
import 'popper.js';
import 'bootstrap';
import Inputmask from 'inputmask';
import CustomFileInput from 'bs-custom-file-input';
import LazyLoad from 'vanilla-lazyload';

const lazyLoadInstance = new LazyLoad({
  elements_selector: '.lazy',
});

$(() => {

  // Smooth scroll
  $('a[href*="#"]').
      not('[href="#"]').
      not('[href="#0"]').
      not('[data-toggle="collapse"]').
      not('[role="tab"]').
      click(e => {
        $('html,body').stop().animate({
          scrollTop: $(e.currentTarget.hash).offset().top,
        }, 1000);
        e.preventDefault();
      });

  // Animate custom file input for bootstrap4
  CustomFileInput.init();

  // Inputmask for phone fields
  Inputmask({
    mask: ['+38(999)999-99-99', '+7(999)999-99-99'],
    clearIncomplete: true,
    showMaskOnHover: false,
  }).mask($('input[type="tel"]'));

  // Validation form
  let validation = form => {
    let fields = form.find('input, select'),
        check = [];

    $.each(fields, (_, item) => {
      if ($(item).is(':required') && !$(item).is(':disabled')) {
        check.push(item.checkValidity());
      }
    });
    form.addClass('was-validated');
    let isValid = item => item === true;
    if (check.every(isValid)) {
      form.removeClass('was-validated');
    }
    return check.every(isValid);
  };

  // Form processing
  $(document).on('submit', '.needs-validation', e => {
    let $form = $(e.currentTarget),
        $submitBtn = $form.find('[type="submit"]'),
        formData = {};

    $.each($form.serializeArray(), (_, item) => {
      if (item.name !== 'agree') {
        formData[item.name] = item.value;
      }
    });

    if (validation($form)) {
      $submitBtn.addClass('disabled');

      // $.post('./mail.php', formData).done(json => {
      //   if (json.status === 'success') {
      //     setTimeout(() => {
      //       console.log('Data successfully sent');
      //     }, 300);
      //   } else {
      //     console.error('Something wrong...');
      //   }
      // }, 'json');

      setTimeout(() => {
        $submitBtn.removeClass('disabled');
        $form[0].reset();
      }, 2000);
    }

    e.preventDefault();
  });

  lazyLoadInstance.update();
});
