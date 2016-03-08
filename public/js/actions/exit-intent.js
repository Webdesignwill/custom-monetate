(function () {

  "use strict";

  var config = {},
    sensitivity = 20,
    timer = 1000,
    delay = 0,
    _delayTimer = null,
    _html = document.documentElement;

  function setDefaultCookieExpire() {
    var ms = 14*24*60*60*1000;

    var date = new Date();
    date.setTime(date.getTime() + ms);

    return "; expires=" + date.toUTCString();
  }

  function fire() {
    console.log('User is trying to leave');
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

})();
