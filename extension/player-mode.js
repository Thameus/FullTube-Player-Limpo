'use strict';

// This script intentionally works only with HTMLMediaElement. It never reads
// cookies, extracts a media URL, or reaches into cross-origin iframes.
(function () {
  if (globalThis.__multiTubePlayerMode) return;
  globalThis.__multiTubePlayerMode = true;
  const POPUP_PARAM = 'multiTubePopup';
  const isPopup = new URL(location.href).searchParams.get(POPUP_PARAM) === '1';
  let activeIndex = -1;
  let toggleTheater = null;

  function videos() {
    return Array.from(document.querySelectorAll('video')).filter(video => {
      // CSS and layout visibility are checked explicitly instead of relying on
      // elementFromPoint: native controls and legitimate overlays can cover a
      // rendered player without making the player an invalid candidate.
      let current = video;
      while (current && current.nodeType === Node.ELEMENT_NODE) {
        const style = getComputedStyle(current);
        const opacity = Number.parseFloat(style.opacity);
        if (style.display === 'none' ||
            style.visibility === 'hidden' || style.visibility === 'collapse' ||
            !Number.isFinite(opacity) || opacity <= 0) {
          return false;
        }
        if (current === document.body) break;
        current = current.parentElement;
      }

      if (typeof video.checkVisibility === 'function') {
        try {
          if (!video.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) return false;
        } catch (_) {
          // Older implementations may expose the method but reject options.
          try {
            if (!video.checkVisibility()) return false;
          } catch (_) {
            // The computed-style and geometry checks above are the safe fallback.
          }
        }
      }

      const rect = video.getBoundingClientRect();
      const validRect = [rect.left, rect.top, rect.right, rect.bottom, rect.width, rect.height]
        .every(Number.isFinite);
      return validRect && rect.width > 0 && rect.height > 0 &&
        rect.right > rect.left && rect.bottom > rect.top &&
        rect.right > 0 && rect.bottom > 0 &&
        rect.left < innerWidth && rect.top < innerHeight;
    });
  }

  function score(video, index) {
    const rect = video.getBoundingClientRect();
    const visible = Math.max(0, Math.min(innerWidth, rect.right) - Math.max(0, rect.left)) *
      Math.max(0, Math.min(innerHeight, rect.bottom) - Math.max(0, rect.top));
    const playing = !video.paused && !video.ended && video.readyState >= 2;
    const audible = !video.muted && video.volume > 0;
    return { video, index, visible, playing, audible };
  }

  function chooseVideo() {
    const candidates = videos().map(score);
    if (!candidates.length) return null;
    const by = predicate => candidates.filter(predicate).sort((a, b) => b.visible - a.visible)[0];
    return by(v => v.audible && v.playing) || by(v => v.playing) ||
      candidates.sort((a, b) => b.visible - a.visible)[0] || candidates[0];
  }

  function adapter() {
    const host = location.hostname.replace(/^www\./, '');
    if (host === 'youtube.com' || host.endsWith('.youtube.com')) return 'youtube';
    if (host === 'twitch.tv' || host.endsWith('.twitch.tv')) return 'twitch';
    if (host === 'vimeo.com' || host.endsWith('.vimeo.com')) return 'vimeo';
    return 'generic';
  }

  function candidate() {
    const selected = chooseVideo();
    if (!selected) return null;
    activeIndex = selected.index;
    return {
      index: selected.index,
      currentTime: Number.isFinite(selected.video.currentTime) ? selected.video.currentTime : 0,
      autoplay: selected.playing,
      muted: selected.video.muted,
      volume: selected.video.volume,
      adapter: adapter(),
      url: location.href
    };
  }

  function notify(text) {
    let box = document.getElementById('multi-tube-message');
    if (!box) {
      box = document.createElement('div');
      box.id = 'multi-tube-message';
      box.style.cssText = 'position:fixed;z-index:2147483647;left:16px;bottom:16px;max-width:460px;padding:8px 11px;background:#20242bdd;color:#fff;border:1px solid #586273;border-radius:5px;font:12px Segoe UI,system-ui,sans-serif;box-shadow:0 3px 12px #0006';
      (document.body || document.documentElement).appendChild(box);
    }
    box.textContent = text;
  }

  function messageHandler(message, _sender, sendResponse) {
    if (message?.type === 'detect-player') {
      const result = candidate();
      sendResponse(result ? { ok: true, player: result } : { ok: false, error: chrome.i18n.getMessage('errNoPlayer') });
      return true;
    }
    if (message?.type === 'pause-source') {
      const selected = videos()[Number.isInteger(message.index) ? message.index : activeIndex];
      if (selected) selected.pause();
      sendResponse({ ok: Boolean(selected) });
      return true;
    }
    if (message?.type === 'toggle-theater') {
      if (toggleTheater) toggleTheater();
      sendResponse({ ok: Boolean(toggleTheater) });
      return true;
    }
    return false;
  }
  chrome.runtime.onMessage.addListener(messageHandler);

  function waitForVideo(timeoutMs = 12000) {
    const started = Date.now();
    return new Promise(resolve => {
      const check = () => {
        const selected = chooseVideo();
        if (selected || Date.now() - started >= timeoutMs) {
          resolve(selected || null);
          return;
        }
        setTimeout(check, 250);
      };
      check();
    });
  }

  function waitForMetadata(video, timeoutMs = 4000) {
    if (video.readyState >= 1) return Promise.resolve(true);
    return new Promise(resolve => {
      let settled = false;
      const finish = value => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        video.removeEventListener('loadedmetadata', onMetadata);
        resolve(value);
      };
      const onMetadata = () => finish(true);
      const timeout = setTimeout(() => finish(false), timeoutMs);
      video.addEventListener('loadedmetadata', onMetadata, { once: true });
    });
  }

  async function installPopupMode() {
    const selected = await waitForVideo();
    if (!selected) {
      notify(chrome.i18n.getMessage('popupNoPlayer'));
      return;
    }
    activeIndex = selected.index;
    document.querySelectorAll('.multi-tube-selected-video').forEach(video => video.classList.remove('multi-tube-selected-video'));
    selected.video.classList.add('multi-tube-selected-video');
    const site = adapter();
    if (site === 'youtube') cleanYouTubePopup(selected.video);
    else {
      cleanPageAroundPlayer(selected.video);
      if (site === 'twitch') cleanTwitchPopup(selected.video);
    }
    const style = document.createElement('style');
    style.id = 'multi-tube-popup-style';
    style.textContent = `
      html, body { margin:0 !important; width:100vw !important; height:100vh !important; overflow:hidden !important; background:#000 !important; }
      .multi-tube-selected-video { display:block !important; width:100% !important; height:100% !important; max-width:none !important; max-height:none !important; object-fit:contain !important; }
    `;
    (document.head || document.documentElement).appendChild(style);
    const params = new URL(location.href).searchParams;
    const time = Number(params.get('multiTubeTime'));
    selected.video.muted = params.get('multiTubeMuted') === '1';
    const volume = Number(params.get('multiTubeVolume'));
    if (Number.isFinite(volume)) selected.video.volume = Math.max(0, Math.min(1, volume));

    await waitForMetadata(selected.video);
    if (Number.isFinite(time) && time >= 0) {
      try { selected.video.currentTime = time; } catch (_) { /* media may not be seekable */ }
    }
    if (params.get('multiTubeAutoplay') === '1') {
      try {
        await selected.video.play();
      } catch (_) {
        if (site === 'twitch' || site === 'generic') selected.video.controls = true;
        notify(chrome.i18n.getMessage('popupAutoplayBlocked'));
      }
    }
    if (site === 'twitch' || site === 'generic') selected.video.controls = true;
    selected.video.focus?.({ preventScroll: true });
    installShortcuts(selected.video);
    chrome.runtime.sendMessage({ type: 'popup-ready', index: activeIndex }).catch(() => {});
  }

  function installYouTubeTheaterMode() {
    if (adapter() !== 'youtube' || document.getElementById('multi-tube-theater-style')) return;

    const style = document.createElement('style');
    style.id = 'multi-tube-theater-style';
    style.textContent = `
      html.multi-tube-theater-active, html.multi-tube-theater-active body {
        overflow: hidden !important; background: #000 !important;
      }
      html.multi-tube-theater-active #masthead-container,
      html.multi-tube-theater-active ytd-masthead,
      html.multi-tube-theater-active #guide,
      html.multi-tube-theater-active ytd-mini-guide-renderer,
      html.multi-tube-theater-active #secondary,
      html.multi-tube-theater-active #related,
      html.multi-tube-theater-active #comments,
      html.multi-tube-theater-active ytd-comments,
      html.multi-tube-theater-active #chat,
      html.multi-tube-theater-active #chat-container,
      html.multi-tube-theater-active ytd-live-chat-frame,
      html.multi-tube-theater-active #below,
      html.multi-tube-theater-active #below-the-fold,
      html.multi-tube-theater-active ytd-watch-metadata,
      html.multi-tube-theater-active #info,
      html.multi-tube-theater-active #info-contents,
      html.multi-tube-theater-active #owner,
      html.multi-tube-theater-active #actions,
      html.multi-tube-theater-active #panels,
      html.multi-tube-theater-active ytd-watch-next-secondary-results-renderer {
        display: none !important;
      }
      html.multi-tube-theater-active #player-container,
      html.multi-tube-theater-active #player,
      html.multi-tube-theater-active #movie_player {
        position: fixed !important; inset: 0 !important; z-index: 2147483640 !important;
        width: 100vw !important; height: 100vh !important; max-width: none !important;
        max-height: none !important; margin: 0 !important; padding: 0 !important;
        background: #000 !important;
      }
      html.multi-tube-theater-active #movie_player video {
        width: 100% !important; height: 100% !important; object-fit: contain !important;
      }
      html.multi-tube-theater-active #movie_player .html5-video-container,
      html.multi-tube-theater-active #movie_player .html5-video-player,
      html.multi-tube-theater-active #movie_player .html5-main-video,
      html.multi-tube-theater-active #movie_player .video-stream {
        width: 100% !important; height: 100% !important;
      }
      html.multi-tube-theater-active #movie_player .html5-video-container {
        position: absolute !important; inset: 0 !important; overflow: hidden !important;
      }
      html.multi-tube-theater-active #movie_player .html5-main-video,
      html.multi-tube-theater-active #movie_player .video-stream {
        position: absolute !important; inset: 0 !important;
        max-width: 100% !important; max-height: 100% !important;
        object-fit: contain !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);

    let active = false;
    const setActive = value => {
      active = value;
      document.documentElement.classList.toggle('multi-tube-theater-active', active);
      if (!active) {
        // YouTube recalculates its responsive player on resize. Removing the
        // class restores the CSS, then these events make the native layout
        // recalculate instead of retaining the theater dimensions.
        requestAnimationFrame(() => {
          window.dispatchEvent(new Event('resize'));
          requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
        });
      }
    };
    // Both the manifest command and the in-page Alt+T handler can fire for the
    // same key press; a second toggle within 300 ms is ignored.
    let lastToggle = 0;
    toggleTheater = () => {
      const now = Date.now();
      if (now - lastToggle < 300) return;
      lastToggle = now;
      setActive(!active);
    };
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && active) {
        event.preventDefault();
        event.stopPropagation();
        setActive(false);
      } else if (event.altKey && event.key.toLowerCase() === 't') {
        event.preventDefault();
        toggleTheater();
      }
    }, true);

  }

  function cleanPageAroundPlayer(video) {
    const knownContainer = video.closest('#movie_player, #player, .video-player, .video-container, .vp-video, #html5video, #html5video_base');
    const container = knownContainer || video.parentElement || video;
    const preservesPlayerUi = element => {
      if (element.matches?.('video') || element.querySelector?.('video')) return true;
      const identity = `${element.id || ''} ${element.className || ''}`;
      if (/player|video|control|overlay|progress|volume|fullscreen|caption|subtitle|play|pause/i.test(identity)) return true;
      const label = element.getAttribute?.('aria-label') || element.getAttribute?.('title') || '';
      return /play|pause|volume|mute|fullscreen|progress|caption|subtitle/i.test(label);
    };

    const hideOutsidePlayer = () => {
      let current = container;
      while (current && current !== document.body && current !== document.documentElement) {
        current.style.position = 'fixed';
        current.style.inset = '0';
        current.style.width = '100vw';
        current.style.height = '100vh';
        current.style.maxWidth = 'none';
        current.style.maxHeight = 'none';
        current.style.overflow = 'hidden';
        current.style.background = '#000';

        const parent = current.parentElement;
        if (parent) {
          Array.from(parent.children).forEach(sibling => {
            if (sibling !== current && sibling.tagName !== 'SCRIPT' && sibling.tagName !== 'STYLE' && !preservesPlayerUi(sibling)) {
              sibling.style.setProperty('display', 'none', 'important');
            }
          });
        }

        current = parent;
      }
    };

    // Walk all ancestors so generic sites lose navigation, sidebars and
    // metadata even when those elements are several levels above the video.
    hideOutsidePlayer();
    const observer = new MutationObserver(hideOutsidePlayer);
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  function cleanYouTubePopup(video) {
    const youtubeRoot = document.documentElement;
    youtubeRoot.classList.add('multi-tube-youtube-popup');
    const selectors = [
      '#masthead-container',
      'ytd-masthead',
      '#guide',
      'ytd-mini-guide-renderer',
      '#secondary',
      '#related',
      '#comments',
      'ytd-comments',
      '#chat',
      '#chat-container',
      'ytd-live-chat-frame',
      '#below',
      '#below-the-fold',
      'ytd-watch-metadata',
      'ytd-video-primary-info-renderer',
      'ytd-video-secondary-info-renderer',
      '#info',
      '#info-contents',
      '#owner',
      '#actions',
      '#panels',
      '#endscreen',
      'ytd-watch-next-secondary-results-renderer'
    ];
    const selector = selectors.join(',');
    const isPlayerOrPlayerAncestor = element =>
      element === video || element.contains(video) || video.contains(element);
    const hideOutsidePlayer = () => {
      document.querySelectorAll(selector).forEach(element => {
        // The player, its overlays, and its native .ytp-* controls are never
        // hidden. An ancestor containing the player is also left untouched.
        if (!isPlayerOrPlayerAncestor(element)) element.style.setProperty('display', 'none', 'important');
      });
    };

    hideOutsidePlayer();
    const observer = new MutationObserver(() => hideOutsidePlayer());
    observer.observe(document.documentElement, { childList: true, subtree: true });

    const style = document.createElement('style');
    style.id = 'multi-tube-youtube-popup-style';
    style.textContent = `
      html.multi-tube-youtube-popup #player-container,
      html.multi-tube-youtube-popup #player,
      html.multi-tube-youtube-popup #movie_player {
        position:fixed !important; inset:0 !important; width:100vw !important;
        height:100vh !important; max-width:none !important; max-height:none !important;
        margin:0 !important; padding:0 !important; overflow:hidden !important;
        background:#000 !important;
      }
      html.multi-tube-youtube-popup body
      :where(#masthead-container, ytd-masthead, #guide, ytd-mini-guide-renderer,
        #secondary, #related, #comments, ytd-comments, #chat, #chat-container,
        ytd-live-chat-frame, #below, #below-the-fold, ytd-watch-metadata,
        ytd-video-primary-info-renderer, ytd-video-secondary-info-renderer,
        #info, #info-contents, #owner, #actions, #panels, #endscreen,
        ytd-watch-next-secondary-results-renderer)
      :not(#movie_player):not(#movie_player *) {
        display: none !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  function cleanTwitchPopup(video) {
    document.documentElement.classList.add('multi-tube-twitch-popup');
    const selectors = [
      'header',
      'nav',
      '.top-nav',
      '.side-nav',
      '[data-a-target="chat-room-component-layout"]',
      '.channel-root__right-column',
      '.channel-root__info',
      '.channel-root__upper-content',
      '.channel-root__lower-content',
      '.channel-root__ad-banner',
      '.persistent-player',
      '.stream-chat',
      '#channel-player__right-column'
    ];
    const selector = selectors.join(',');
    const hideOutsidePlayer = () => {
      document.querySelectorAll(selector).forEach(element => {
        if (element !== video && !element.contains(video) && !video.contains(element)) {
          element.style.setProperty('display', 'none', 'important');
        }
      });
    };

    hideOutsidePlayer();
    const observer = new MutationObserver(hideOutsidePlayer);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    const style = document.createElement('style');
    style.id = 'multi-tube-twitch-popup-style';
    style.textContent = `
      html.multi-tube-twitch-popup body { overflow:hidden !important; background:#000 !important; }
      html.multi-tube-twitch-popup :where(
        .channel-root__right-column,
        .channel-root__info,
        .channel-root__upper-content,
        .channel-root__lower-content,
        .channel-root__ad-banner,
        [data-a-target="chat-room-component-layout"],
        .stream-chat,
        #channel-player__right-column
      ) { display:none !important; }
      html.multi-tube-twitch-popup :where(
        .channel-root__player,
        .video-player,
        .video-player__container,
        [data-a-target="video-player"]
      ) {
        position:fixed !important;
        inset:0 !important;
        width:100vw !important;
        height:100vh !important;
        max-width:none !important;
        max-height:none !important;
        background:#000 !important;
      }
      html.multi-tube-twitch-popup .multi-tube-selected-video {
        width:100% !important;
        height:100% !important;
        object-fit:contain !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  function installShortcuts(video) {
    document.addEventListener('keydown', event => {
      const target = event.target;
      if (target?.isContentEditable || target?.closest?.('input, textarea, select, button, a, [role="button"], [role="link"], [role="menuitem"], [contenteditable="true"]')) return;
      if (event.key === ' ') { event.preventDefault(); video.paused ? video.play().catch(() => {}) : video.pause(); }
      else if (event.key.toLowerCase() === 'f') { event.preventDefault(); video.requestFullscreen?.().catch(() => {}); }
      else if (event.key.toLowerCase() === 'm') { event.preventDefault(); video.muted = !video.muted; }
    }, true);
  }

  if (isPopup) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', installPopupMode, { once: true });
    else installPopupMode();
  } else if (adapter() === 'youtube') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', installYouTubeTheaterMode, { once: true });
    else installYouTubeTheaterMode();
  }
})();
