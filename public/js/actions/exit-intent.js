
(function () {

  "use strict";

  var lightboxOpen = false;
  var sending = false;

  var exitIntentHtml = '<div class="exit-intent-lightbox"><div class="ei-lb-inner ei-lb-front"><button type="button" class="ei-lb-close" data-dismiss="modal" aria-label="Close"></button><div class="ei-lb-content"><form role="form" class="ei-lb-form"><input type="email" placeholder="Enter your email" class="ei-lb-input"/><button type="submit" class="ei-lb-submit-btn invalid">GET MY DISCOUNT</button></form></div></div></div>';
  var thanksHtml = '<div class="ei-lb-continue-cont"><div class="voucher-code"></div><button class="ei-lb-submit-btn ei-lb-continue">CONTINUE</button></div>';

  var sensitivity = 20,
    initialTimer = 8,
    cookieExpire = 28,
    tempDelay = 15,
    delay = 0,
    _html = document.documentElement;

  var $body = $('body'),
        $backdrop = $('<div class="exit-intent-backdrop"></div>');

  function Lightbox (template) {

    var valid = false;

    var self = this;
    this.$el = $(template);
    this.$form = this.$el.find('form');
    this.$close = this.$el.find('.ei-lb-close');
    this.$content = this.$el.find('.ei-lb-content');
    this.$inner = this.$el.find('.ei-lb-inner');
    this.$button = this.$el.find('.ei-lb-submit-btn');
    this.$input = this.$el.find('.ei-lb-input');

    function done (data, status, xhr) {
      self.$inner.removeClass('ei-lb-front');
      self.$inner.addClass('ei-lb-back');
      self.$content.html(thanksHtml);
      self.$content.find('.voucher-code').html(data.voucher);
      createCookie("goldsmiths_shown", "true", cookieExpire);
      sending = false;
    }

    function close () {
      $body.addClass('exit-intent-closing');
      setTimeout(function () {
        $body.removeClass('exit-intent-open exit-intent-closing');
        self.$el.off().remove();
        lightboxOpen = false;
      }, 400);
    }

    function makeValid () {
      self.$button.removeClass('invalid');
      valid = true;
    }

    function makeInvalid () {
      self.$button.addClass('invalid');
      valid = false;
    }

    function submit (e) {
      e.preventDefault();
      e.stopPropagation();
      if(sending || !valid) { return; }

      var val = e.target.querySelector('input').value;
      self.$button.addClass('ei-lb-sending');
      self.$button.html('Sending . . .');
      sending = true;

      $.ajax({
        context : self,
        type : 'POST',
        url : 'https://mailify-production.herokuapp.com/api/1.0/subscriptions/',
        crossDomain : true,
        data : { email : val },
        success : done,
        error : done
      });
    }

    this.$content.on('click', function (e) {
      if(e.target.className.indexOf('ei-lb-continue') !== -1) {
        close();
      }
    });

    function validate (e) {
      if(e.target.value.indexOf('@') === -1 ? false : true) {
        return makeValid();
      }
      makeInvalid();
    }

    this.$close.on('click', close);
    this.$form.on('submit', submit);
    this.$input.on('keyup', validate);

    $body.append(this.$el);

    this.$el.on('click', function (e) {
      if(e.target.className === 'exit-intent-lightbox') {
        close();
      }
    });

    return close;
  }

  function getCookie (name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");

    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }

    return null;
  }

  function createCookie (name, value, days, temp) {

    var expires = "";

    if(days) {
      var date = new Date();
      if(temp) {
        date.setTime(date.getTime() + (temp * 60 * 1000));
      } else {
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      }
      expires = "; expires=" + date.toUTCString();
    }

    document.cookie = name + "=" + value + expires + "; path=/";

  }

  function fire() {
    if(lightboxOpen || getCookie("goldsmiths_shown") || getCookie("goldsmiths_delay")) { return; }

    $body.addClass('exit-intent-open');
    lightboxOpen = true;

    new Lightbox(exitIntentHtml);

    createCookie("goldsmiths_delay", "true", 0.05, tempDelay);

  }

  function handleMouseleave(e) {
    if (e.clientY > sensitivity) { return; }
    setTimeout(fire, delay);
  }

  function setListeners() {
    _html.addEventListener('mouseleave', handleMouseleave);
  }

  function preLoadImages () {
    var $imgContainer = $('<span />').css('display', 'none');

    var images = [
      'http://sb.monetate.net/img/1/669/573814.png', // front
      'http://sb.monetate.net/img/1/669/573812.png', // back
      'http://sb.monetate.net/img/1/669/568232.png'
    ];

    function getImage (src) {
      var image = new Image();
      image.src = src;

      image.onload = function () {
        $imgContainer.append(image);
      };
    }

    for(var i = 0; i < images.length; i++) {
      getImage(images[i]);
    }
  }

  if(getCookie() === "true") {
    return;
  }

  preLoadImages();
  $body.append($backdrop);
  setTimeout(setListeners, initialTimer * 1000);

})();