/*
  http://clearhead.me/a-new-monetate-polling-pattern-emerges/
*/

// We wrap the entire thing in an IIFE to ensure we don't leak any variables
(function() {
  // Define the sigil uptop in the case that jQuery doesn't yet exist at time of script firing
  var $;

  // Add class whether or not jQuery has been loaded
  document.documentElement.classList.add('specific-experiment-class');

  // Quick check for the existence of jQuery
  (function pollForjQuery() {
    if ($ = window.jQuery) init(); // jshint ignore:line
    else setTimeout(pollForjQuery, 25);
  })();

  // code runs when jQuery exists
  function init() {
    when('#body.page-signin h1.sectionTitle', function($this) {
      $this.text('Change Text of H1');
    }, 25);

    // Add goal link when ready
    $('document').ready(function(){
      $('a.goal-link').click(function(){
        window.monetateQ = window.monetateQ || [];
        window.monetateQ.push(['trackEvent', ['goal-link-clickers']]);
      });
      this.removeClass('specific-experiment-class');
    });
  }

  // Polling function takes three arguments
  function when(selector, callback, optTimeout) {
    var $this = $(selector);
    // If selector doesn't have a length (so we assume it doesn't exist), set a timeout which recursively calls function
    return $this.length ? callback($this) : setTimeout(
      when.bind(null, selector, callback, optTimeout),
      optTimeout || 50
    );
  }

})();
