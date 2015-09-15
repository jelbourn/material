angular.module('material.core').service('$$mdAriaLive', MdAriaLive);



/**
 * Utility for making announcements for screen-reader users with a global aria-live element.
 *
 * @ngInject @constructor
 */
function MdAriaLive($timeout) {
  /** @final {!angular.$timeout} */
  this.$timeout = $timeout;

  /** @type {Element} The global aria-live element. */
  this.liveElement = this.createLiveRegionElement_();
}

/**
 * Creates the aria-live element and appends it to the document.
 * @private
 * @returns {Element}
 */
MdAriaLive.prototype.createLiveRegionElement_ = function() {
  var element = document.createElement('div');
  element.classList.add('md-visually-hidden');
  element.setAttribute('aria-live', 'polite');
  element.setAttribute('aria-atomic', 'true');
  document.body.appendChild(element);

  return element;
};

/**
 * Makes an aria-live announcement.
 * @param {string} message
 * @param {string=} opt_politeness The politeness of the message. Defaults to 'polite'.
 */
MdAriaLive.prototype.announce = function(message, opt_politeness) {
  if (!message) {
    return;
  }

  var liveElement = this.liveElement;

  var politeness = opt_politeness || 'polite';
  liveElement.setAttribute('aria-live', politeness);

  // Clear any previous message so that repeated (identical) messages are
  liveElement.textContent = '';

  // This 100ms timeout is necessary for some browser + screen-reader combinations:
  // - Both JAWS and NVDA over IE11 will not announce anything without a non-zero timeout.
  // - With Chrome and IE11 with NVDA or JAWS, a repeated (identical) message won't be read a
  //   second time without clearing and then using a non-zero delay.
  // (using JAWS 17 at time of this writing).
  this.$timeout(function() {
    liveElement.textContent = message;
  }, 100, false);
};
