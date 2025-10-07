// Fade in the static Flow logo when the animation is complete.

/**
 * On very small screens (< 428px), fades in the static header logo after the animation completes.
 * @returns {void}
 */
function showStaticLogoAfterAnimation() {
  let isSmallScreen = window.matchMedia('(max-width: 428px)').matches;
  if (!isSmallScreen) { return; }
  let staticLogo = document.querySelector('.header-logo .logo-static');
  if (!staticLogo) { return; }
  setTimeout(function(){
    staticLogo.classList.add('is-visible');
  }, 2000);
}

/**
 * On very small screens, removes the light (intro) logo after the splash fade.
 * @returns {void}
 */
function removeLightLogoAfterSplash() {
    let isSmallScreen = window.matchMedia('(max-width: 428px)').matches;
    if (!isSmallScreen) { return; }

    let lightLogo = document.querySelector('.logo--light');
    if (!lightLogo) { return; }

    setTimeout(function(){
      lightLogo.remove();
    }, 700);
  }

/**
 * On very small screens, removes the dark fixed logo after the animation ends.
 * @returns {void}
 */
function removeDarkFixedLogoAfterAnimation() {
  let isSmallScreen = window.matchMedia('(max-width: 428px)').matches;
  if (!isSmallScreen) { return; }
  let darkLogo = document.querySelector('.logo--dark');
  if (!darkLogo) { return; }

  setTimeout(function(){
    darkLogo.remove();
  }, 2000);
}

/**
 * Coordinates the smooth handover from animated logos to the static header logo
 * (fades in the static logo, then removes the animated variants).
 * @returns {void}
 */
function smoothLogoHandover() {
  let isSmallScreen = window.matchMedia('(max-width: 428px)').matches;
  if (!isSmallScreen) { return; }
  let staticLogo = document.querySelector('.header-logo .logo-static');
  if (staticLogo) {
    setTimeout(function () {
      staticLogo.classList.add('is-visible');
    }, 1800); 
  }
  let animatedLogos = document.querySelectorAll('.logo_signup_page');
  if (animatedLogos && animatedLogos.length > 0) {
    setTimeout(function () {
      for (let i = 0; i < animatedLogos.length; i++) {
        animatedLogos[i].remove();
      }
    }, 2100);
  }
}

showStaticLogoAfterAnimation();
removeLightLogoAfterSplash();
removeDarkFixedLogoAfterAnimation();
smoothLogoHandover();

/**
 * Initializes responsive logo behavior based on the media query (≤ 428px).
 * Registers a listener and switches between animated and static logos as needed.
 */
document.addEventListener('DOMContentLoaded', function () {
  /**
   * MediaQueryList for very small screens.
   * @type {MediaQueryList}
   */
  const mq = window.matchMedia('(max-width: 428px)');

  /**
   * Static header logo element.
   * @type {HTMLImageElement|null}
   */
  const staticLogo = document.querySelector('.header-logo .logo-static');

  /**
   * Animated logo elements used for the intro animation.
   * @type {NodeListOf<HTMLElement>}
   */
  const animatedLogos = document.querySelectorAll('.logo_signup_page');

  /**
   * Timer for delayed fade-in of the static logo.
   * @type {number|null}
   */
  let showTimer = null;

  /**
   * Timer for delayed hiding/removal of animated logos.
   * @type {number|null}
   */
  let hideTimer = null;

  /**
   * Clears both timers to avoid race conditions when the MQ toggles quickly.
   * @returns {void}
   */
  function clearTimers() {
    if (showTimer) { clearTimeout(showTimer); showTimer = null; }
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
  }

  /**
   * Applies the UI state for mobile mode (≤ 428px):
   * - Shows the static logo (faded in with delay)
   * - Hides/removes animated logos after the handover
   * @returns {void}
   */
  function enterMobile() {
    clearTimers();
    if (staticLogo) {
      staticLogo.style.display = 'block';      // exists on mobile
      staticLogo.classList.remove('is-visible'); // starts invisible (CSS fades in)
    }
    animatedLogos.forEach(el => { el.style.display = ''; });
    showTimer = setTimeout(() => {
      staticLogo && staticLogo.classList.add('is-visible');
    }, 1800);
    hideTimer = setTimeout(() => {
      animatedLogos.forEach(el => { el.style.display = 'none'; });
    }, 2100);
  }

  /**
   * Applies the UI state for desktop mode (> 428px):
   * - Hides the static logo
   * - Shows animated logos (if they were hidden before)
   * @returns {void}
   */
  function enterDesktop() {
    clearTimers();
    if (staticLogo) {
      staticLogo.classList.remove('is-visible');
      staticLogo.style.display = 'none';
    }
    animatedLogos.forEach(el => { el.style.display = ''; });
  }

  /**
   * Handles media query changes and switches between mobile and desktop states.
   * @param {MediaQueryListEvent|MediaQueryList} e - MQ change event or initial MQ list.
   * @returns {void}
   */
  function handleChange(e) {
    if (e.matches) {
      enterMobile();
    } else {
      enterDesktop();
    }
  }

  mq.addEventListener('change', handleChange);
  handleChange(mq);
});