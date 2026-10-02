document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('videoLightbox');
  const media = document.getElementById('videoLightboxMedia');
  if (!lightbox || !media) return;

  const HOVER_DELAY = 350; // ms — avoids loading a preview on a quick mouse pass

  let current = null;

  function renderPoster(wrap) {
    const posterSrc = wrap.querySelector('.hobby-video-poster').src;
    media.innerHTML = `
      <img class="hobby-video-poster" src="${posterSrc}" alt="">
      <button class="hobby-play" aria-label="Play video">
        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      </button>
    `;
    media.querySelector('.hobby-play').addEventListener('click', playCurrent);
  }

  function playCurrent() {
    if (!current) return;
    const ytId = current.dataset.yt;
    const ytStart = current.dataset.ytStart || 0;
    const src = current.dataset.src;

    if (ytId) {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&start=${ytStart}`;
      iframe.title = 'YouTube video player';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      media.innerHTML = '';
      media.appendChild(iframe);
      return;
    }

    if (!src) return;
    const video = document.createElement('video');
    video.src = src;
    video.controls = true;
    video.playsInline = true;
    media.innerHTML = '';
    media.appendChild(video);
    video.play();
  }

  function openLightbox(wrap) {
    current = wrap;
    renderPoster(wrap);

    const caption = document.getElementById('videoLightboxCaption');
    const text = wrap.dataset.caption;
    caption.innerHTML = text ? `<p>${text}</p>` : '';

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
  }

  function closeLightbox() {
    media.innerHTML = '';
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    current = null;
  }

  lightbox.querySelectorAll('[data-lightbox-close]').forEach((el) => {
    el.addEventListener('click', closeLightbox);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });

  // ---- thumbnail hover preview (muted, silent) ----
  document.querySelectorAll('.hobby-video').forEach((wrap) => {
    wrap.addEventListener('click', () => openLightbox(wrap));

    let hoverTimer = null;
    let previewEl = null;

    const startPreview = () => {
      if (previewEl) return;
      const ytId = wrap.dataset.yt;
      const ytStart = wrap.dataset.ytStart || 0;
      const src = wrap.dataset.src;

      if (ytId) {
        const iframe = document.createElement('iframe');
        iframe.className = 'hobby-preview-layer';
        iframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&modestbranding=1&start=${ytStart}`;
        iframe.allow = 'autoplay; encrypted-media';
        iframe.setAttribute('tabindex', '-1');
        wrap.appendChild(iframe);
        previewEl = iframe;
      } else if (src) {
        const video = document.createElement('video');
        video.className = 'hobby-preview-layer';
        video.src = src;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.setAttribute('tabindex', '-1');
        wrap.appendChild(video);
        video.play().catch(() => {});
        previewEl = video;
      } else {
        return;
      }

      requestAnimationFrame(() => previewEl && previewEl.classList.add('is-visible'));
    };

    const stopPreview = () => {
      clearTimeout(hoverTimer);
      if (previewEl) {
        previewEl.remove();
        previewEl = null;
      }
    };

    wrap.addEventListener('mouseenter', () => {
      hoverTimer = setTimeout(startPreview, HOVER_DELAY);
    });
    wrap.addEventListener('mouseleave', stopPreview);
  });
});