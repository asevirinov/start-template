'use strict';

$(() => { // jQuery ready

  /* Smooth scroll */
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

  /* Phone mask */
  $('input[type="tel"]').inputmask({
    alias: 'phoneru',
    clearIncomplete: true,
  });

  /* Validation form */
  let validation = form => {
    let fields = form.find('input, select, textarea'),
        check = [];

    $.each(fields, (_, item) => {
      if ($(item).is(':required') && !$(item).is(':disabled')) {
        check.push(item.checkValidity());
      }
      else if ($(item).attr('type') === 'checkbox' && $(item).is(':checked')) {
        check.push(item.checkValidity());
      }
    });
    // show error fields
    form.addClass('was-validated');
    let isValid = item => item === true;
    if (check.every(isValid)) {
      form.removeClass('was-validated');
    }

    return check.every(isValid);
  };

  /* Form processing */
  $(document).on('submit', 'form', e => {
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

      $.post('./mail.php', formData).done(json => {
        if (json.status === 'success') {
          setTimeout(() => {
            alert('OK!');
          }, 300);
        } else {
          alert(
              'Что-то пошло не так! Обновите страницу и попробуйте ещё раз!');
        }
      }, 'json');

      setTimeout(() => {
        $submitBtn.removeClass('disabled');
        $form[0].reset();
      }, 1000);

      console.log(formData); // debug only
    }

    e.preventDefault();
  });
});