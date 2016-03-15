
$(document).ready(function () {

  "use strict";

  var exitIntentHtml = '<div class="exit-intent-lightbox"><div class="ei-lb-inner"><button type="button" class="ei-lb-close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><div class="ei-lb-content"><h3>Lightbox</h3><p>Some nice lightbox content for the Goldsmiths site</p><form role="form"><input type="email" placeholder="Enter your email" /><button type="submit">Save Email</button></form></div></div></div>';
  var thanksHtml = '<h3>Lightbox</h3><p>Thanks loads! Loved it</p>';

  var sensitivity = 20,
    timer = 1000,
    delay = 0,
    _delayTimer = null,
    _html = document.documentElement;

  var $backdrop = $('<div class="exit-intent-backdrop"></div>'),
        $body = $('body');

  function Lightbox (template) {
    var self = this;
    this.$el = $(template);
    this.$form = this.$el.find('form');
    this.$close = this.$el.find('.ei-lb-close');
    this.$content = this.$el.find('.ei-lb-content');

    function close () {
      $body.addClass('exit-intent-closing');
      setTimeout(function () {
        $body.removeClass('exit-intent-open exit-intent-closing');
        self.$el.off().remove();
      }, 400);
    }

    function submit (e) {
      e.preventDefault();
      var val = e.target.querySelector('input').value;

      $.ajax({
        context : self,
        method : 'POST',
        url : 'https://mailify-production.herokuapp.com/api/1.0/subscriptions/',
        crossDomain : true,
        data : { email : val },
        success : function () {
          self.$content.html(thanksHtml);
        },
        error : function () {
          self.$content.html(thanksHtml);
        }
      });
    }

    this.$close.on('click', close);
    this.$form.on('submit', submit);

    $body.append(this.$el);
  }

  function setDefaultCookieExpire() {
    var ms = 14*24*60*60*1000;

    var date = new Date();
    date.setTime(date.getTime() + ms);

    return "; expires=" + date.toUTCString();
  }

  function fire() {
    $body.addClass('exit-intent-open');
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

});