
$(document).ready(function () {

  "use strict";

  var lightboxOpen = false;
  var sending = false;

  var exitIntentHtml = '<div class="exit-intent-lightbox"><div class="ei-lb-inner ei-lb-front"><button type="button" class="ei-lb-close" data-dismiss="modal" aria-label="Close"></button><div class="ei-lb-content"><form role="form" class="ei-lb-form"><input type="email" placeholder="Enter your email" class="ei-lb-input"/><button type="submit" class="ei-lb-submit-btn invalid">GET MY DISCOUNT</button></form></div></div></div>';
  var thanksHtml = '<div class="ei-lb-continue-cont"><button class="ei-lb-submit-btn ei-lb-continue">CONTINUE</button></div>';

  var sensitivity = 20,
    timer = 1000,
    delay = 0,
    _delayTimer = null,
    _html = document.documentElement;

  var $backdrop = $('<div class="exit-intent-backdrop"></div>'),
        $body = $('body');

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
      if(sending || !valid) { return; }

      var val = e.target.querySelector('input').value;
      self.$button.addClass('ei-lb-sending');
      self.$button.html('Sending . . .');
      sending = true;

      $.ajax({
        context : self,
        method : 'POST',
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
  }

  function setDefaultCookieExpire() {
    var ms = 14*24*60*60*1000;

    var date = new Date();
    date.setTime(date.getTime() + ms);

    return "; expires=" + date.toUTCString();
  }

  function fire() {

    if(lightboxOpen) { return; }

    $body.addClass('exit-intent-open');
    lightboxOpen = true;

    new Lightbox(exitIntentHtml);
  }

  function handleMouseleave(e) {
    if (e.clientY > sensitivity) { return; }
    _delayTimer = setTimeout(fire, delay);
  }

  function handleMouseenter() {
    if (_delayTimer) {
      clearTimeout(_delayTimer);
      _delayTimer = null;
    }
  }

  function appendPopup() {
    _html.addEventListener('mouseleave', handleMouseleave);
    _html.addEventListener('mouseenter', handleMouseenter);
  }

  setTimeout(appendPopup, timer);

  $body.append($backdrop);

  var $imgContainer = $('<span />').css('display', 'none');

  var images = [
    '/img/back.png',
    '/img/front.png'
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

});