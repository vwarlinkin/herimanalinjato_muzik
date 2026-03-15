/* ============================================================
   app.js — Familia Music Player
   ============================================================ */
(function () {
  'use strict';

  /* ── DOM ───────────────────────────────────────────────────── */
  const audio        = document.getElementById('audioEl');
  const trackList    = document.getElementById('trackList');
  const trackName    = document.getElementById('trackName');
  const trackGenre   = document.getElementById('trackGenre');
  const coverImg     = document.getElementById('coverImg');
  const coverPlaceholder = document.getElementById('coverPlaceholder');
  const coverWrap    = document.getElementById('coverWrap');
  const synopsisCard = document.getElementById('synopsisCard');
  const synopsisText = document.getElementById('synopsisText');
  const progressTrack= document.getElementById('progressTrack');
  const progressFill = document.getElementById('progressFill');
  const progressDot  = document.getElementById('progressDot');
  const timeCurrent  = document.getElementById('timeCurrent');
  const timeTotal    = document.getElementById('timeTotal');
  const btnPlay      = document.getElementById('btnPlay');
  const btnPrev      = document.getElementById('btnPrev');
  const btnNext      = document.getElementById('btnNext');
  const btnShuffle   = document.getElementById('btnShuffle');
  const btnRepeat    = document.getElementById('btnRepeat');
  const btnDownload  = document.getElementById('btnDownload');
  const btnLyrics    = document.getElementById('btnLyrics');
  const volSlider    = document.getElementById('volSlider');
  const searchInput  = document.getElementById('searchInput');
  const openPlaylist = document.getElementById('openPlaylist');
  const playlistSheet= document.getElementById('playlistSheet');
  const sheetOverlay = document.getElementById('sheetOverlay');
  const lyricsModal  = document.getElementById('lyricsModal');
  const lyricsBackdrop=document.getElementById('lyricsBackdrop');
  const lyricsBody   = document.getElementById('lyricsBody');
  const lyricsSongName=document.getElementById('lyricsSongName');
  const closeLyrics  = document.getElementById('closeLyrics');
  const themeToggle  = document.getElementById('themeToggle');
  const filterChips  = document.querySelectorAll('.chip');
  const canvas       = document.getElementById('visualizer');
  const ctx2d        = canvas.getContext('2d');
  const icoPl        = btnPlay.querySelector('.ico-play');
  const icoPa        = btnPlay.querySelector('.ico-pause');

  /* ── STATE ─────────────────────────────────────────────────── */
  let currentIdx    = -1;
  let playing       = false;
  let shuffle       = false;
  let repeat        = false;
  let activeFilter  = 'all';
  let filtered      = [];

  /* ── THEME ─────────────────────────────────────────────────── */
  const savedTheme = localStorage.getItem('fm-theme') || 'dark';
  document.documentElement.dataset.theme = savedTheme;

  themeToggle.addEventListener('click', () => {
    const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = t;
    localStorage.setItem('fm-theme', t);
  });

  /* ── WEB AUDIO ─────────────────────────────────────────────── */
  let audioCtx, analyser, src, dataArr, bufLen;

  function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    bufLen   = analyser.frequencyBinCount;
    dataArr  = new Uint8Array(bufLen);
    src      = audioCtx.createMediaElementSource(audio);
    src.connect(analyser);
    analyser.connect(audioCtx.destination);
  }

  /* ── VISUALIZER ────────────────────────────────────────────── */
  function resizeCanvas() {
    canvas.width  = canvas.offsetWidth  * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
    ctx2d.scale(devicePixelRatio, devicePixelRatio);
  }
  window.addEventListener('resize', resizeCanvas);
  setTimeout(resizeCanvas, 100);

  function drawViz() {
    requestAnimationFrame(drawViz);
    const W = canvas.offsetWidth, H = canvas.offsetHeight;
    ctx2d.clearRect(0, 0, W, H);

    if (!analyser || !playing) { drawIdle(W, H); return; }

    analyser.getByteFrequencyData(dataArr);
    const count = bufLen;
    const bw    = (W / count) * 1.6;
    const gap   = 1;
    const xStart= (W - count * (bw + gap)) / 2;

    for (let i = 0; i < count; i++) {
      const v  = dataArr[i] / 255;
      const bh = v * H * 0.9;
      const x  = xStart + i * (bw + gap);
      const isDark = document.documentElement.dataset.theme === 'dark';
      const alpha  = 0.15 + v * 0.85;

      const g = ctx2d.createLinearGradient(0, H - bh, 0, H);
      if (isDark) {
        g.addColorStop(0, `rgba(10,132,255,${alpha})`);
        g.addColorStop(1, `rgba(10,132,255,0.03)`);
      } else {
        g.addColorStop(0, `rgba(0,113,227,${alpha})`);
        g.addColorStop(1, `rgba(0,113,227,0.03)`);
      }

      ctx2d.fillStyle = g;
      ctx2d.beginPath();
      if (ctx2d.roundRect) ctx2d.roundRect(x, H - bh, bw, bh, 2);
      else ctx2d.rect(x, H - bh, bw, bh);
      ctx2d.fill();
    }
  }

  function drawIdle(W, H) {
    const t = Date.now() / 1000;
    const count = 48;
    const bw = (W / count) * 1.6;
    const gap = 1;
    const xStart = (W - count * (bw + gap)) / 2;
    for (let i = 0; i < count; i++) {
      const v  = ((Math.sin(t * 1.4 + i * 0.25) + 1) / 2) * 0.06 + 0.01;
      const bh = v * H;
      const x  = xStart + i * (bw + gap);
      ctx2d.fillStyle = `rgba(142,142,147,${v * 3})`;
      ctx2d.fillRect(x, H - bh, bw, bh);
    }
  }

  drawViz();

  /* ── FILTER & RENDER ───────────────────────────────────────── */
  function buildFiltered() {
    const q = searchInput.value.trim().toLowerCase();
    filtered = TRACKS.map((t, i) => ({ ...t, _i: i })).filter(t => {
      const g = t.genre.toLowerCase();
      const matchF = activeFilter === 'all' || g.includes(activeFilter);
      const matchQ = !q || t.title.toLowerCase().includes(q) || g.includes(q);
      return matchF && matchQ;
    });
  }

  function renderList() {
    buildFiltered();
    trackList.innerHTML = '';
    filtered.forEach(t => {
      const li = document.createElement('li');
      li.className = 'track-item'
        + (t._i === currentIdx ? ' active' : '')
        + (t._i === currentIdx && playing ? ' playing' : '');
      li.dataset.i = t._i;

      const thumb = t.cover
        ? `<div class="ti-thumb"><img src="${t.cover}" loading="lazy" alt="" onerror="this.parentNode.innerHTML='♪'"/></div>`
        : `<div class="ti-thumb">♪</div>`;

      li.innerHTML = `
        ${thumb}
        <div class="ti-info">
          <div class="ti-name">${t.title}</div>
          <div class="ti-meta">${t.genre}</div>
        </div>
        <div class="ti-right">
          <span class="ti-num">${t.id}</span>
          <span class="bars"><span></span><span></span><span></span></span>
        </div>`;

      li.addEventListener('click', () => { loadTrack(t._i, true); closeSheet(); });
      trackList.appendChild(li);
    });
  }

  /* ── LOAD TRACK ────────────────────────────────────────────── */
  function loadTrack(idx, autoplay = false) {
    currentIdx = idx;
    const t    = TRACKS[idx];

    audio.src    = t.src;
    audio.volume = parseFloat(volSlider.value);

    trackName.textContent  = t.title;
    trackGenre.textContent = t.genre;

    // Cover
    if (t.cover) {
      coverImg.src = t.cover;
      coverImg.onload  = () => { coverImg.classList.add('show'); coverPlaceholder.style.display = 'none'; };
      coverImg.onerror = () => { coverImg.classList.remove('show'); coverPlaceholder.style.display = ''; };
    } else {
      coverImg.classList.remove('show');
      coverPlaceholder.style.display = '';
    }

    // Synopsis
    if (t.synopsis) {
      synopsisText.textContent = t.synopsis;
      synopsisCard.classList.add('show');
    } else {
      synopsisCard.classList.remove('show');
    }

    renderList();
    if (autoplay) play();
  }

  /* ── PLAYBACK ──────────────────────────────────────────────── */
  function play() {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    audio.play().then(() => {
      playing = true;
      icoPl.style.display = 'none';
      icoPa.style.display = '';
      btnPlay.classList.add('playing');
      coverWrap.classList.add('playing');
      renderList();
    }).catch(() => {});
  }

  function pause() {
    audio.pause();
    playing = false;
    icoPl.style.display = '';
    icoPa.style.display = 'none';
    btnPlay.classList.remove('playing');
    coverWrap.classList.remove('playing');
    renderList();
  }

  function togglePlay() {
    if (currentIdx === -1) { loadTrack(0, true); return; }
    playing ? pause() : play();
  }

  function nextTrack() {
    if (!TRACKS.length) return;
    const next = shuffle
      ? Math.floor(Math.random() * TRACKS.length)
      : (currentIdx + 1) % TRACKS.length;
    loadTrack(next, true);
  }

  function prevTrack() {
    if (audio.currentTime > 3) { audio.currentTime = 0; return; }
    loadTrack((currentIdx - 1 + TRACKS.length) % TRACKS.length, true);
  }

  /* ── PROGRESS ──────────────────────────────────────────────── */
  function fmt(s) {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2,'0')}`;
  }

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const p = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = p + '%';
    progressDot.style.left   = p + '%';
    timeCurrent.textContent  = fmt(audio.currentTime);
    timeTotal.textContent    = fmt(audio.duration);
  });

  audio.addEventListener('loadedmetadata', () => {
    timeTotal.textContent = fmt(audio.duration);
  });

  audio.addEventListener('ended', () => {
    if (repeat) { audio.currentTime = 0; play(); }
    else nextTrack();
  });

  // Progress click / drag
  let dragging = false;
  function seekTo(e) {
    const rect = progressTrack.getBoundingClientRect();
    const x    = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const p    = Math.max(0, Math.min(1, x / rect.width));
    audio.currentTime = p * audio.duration;
  }
  progressTrack.addEventListener('click',     seekTo);
  progressTrack.addEventListener('mousedown', () => dragging = true);
  progressTrack.addEventListener('touchstart', e => { dragging = true; seekTo(e); }, { passive: true });
  window.addEventListener('mousemove',  e => dragging && seekTo(e));
  window.addEventListener('touchmove',  e => dragging && seekTo(e), { passive: true });
  window.addEventListener('mouseup',    () => dragging = false);
  window.addEventListener('touchend',   () => dragging = false);

  /* ── CONTROLS ──────────────────────────────────────────────── */
  btnPlay.addEventListener('click', togglePlay);
  btnNext.addEventListener('click', nextTrack);
  btnPrev.addEventListener('click', prevTrack);

  btnShuffle.addEventListener('click', () => {
    shuffle = !shuffle;
    btnShuffle.classList.toggle('on', shuffle);
  });
  btnRepeat.addEventListener('click', () => {
    repeat = !repeat;
    btnRepeat.classList.toggle('on', repeat);
  });

  volSlider.addEventListener('input', () => { audio.volume = parseFloat(volSlider.value); });

  /* ── DOWNLOAD ──────────────────────────────────────────────── */
  btnDownload.addEventListener('click', () => {
    if (currentIdx < 0) return;
    const t = TRACKS[currentIdx];
    const a = document.createElement('a');
    a.href     = t.src;
    a.download = t.title + '.mp3';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  /* ── LYRICS ────────────────────────────────────────────────── */
  function openLyrics() {
    const t = currentIdx >= 0 ? TRACKS[currentIdx] : null;
    lyricsSongName.textContent = t ? t.title : 'Paroles';
    const lyricsText = (typeof LYRICS !== 'undefined' && t) ? LYRICS[t.id] : null;
    if (lyricsText) {
      lyricsBody.innerHTML = `<p>${lyricsText.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</p>`;
    } else {
      lyricsBody.innerHTML = '<p class="lyrics-empty">Aucune parole disponible.</p>';
    }
    lyricsModal.classList.add('show');
    lyricsBackdrop.classList.add('show');
  }
  function closeLyricsPanel() {
    lyricsModal.classList.remove('show');
    lyricsBackdrop.classList.remove('show');
  }
  btnLyrics.addEventListener('click', openLyrics);
  closeLyrics.addEventListener('click', closeLyricsPanel);
  lyricsBackdrop.addEventListener('click', closeLyricsPanel);

  /* ── PLAYLIST SHEET ────────────────────────────────────────── */
  function openSheet() {
    playlistSheet.classList.add('open');
    sheetOverlay.classList.add('visible');
  }
  function closeSheet() {
    playlistSheet.classList.remove('open');
    sheetOverlay.classList.remove('visible');
  }
  openPlaylist.addEventListener('click', openSheet);
  sheetOverlay.addEventListener('click', closeSheet);

  // Swipe down to close
  let touchStartY = 0;
  playlistSheet.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; }, { passive: true });
  playlistSheet.addEventListener('touchend',   e => {
    if (e.changedTouches[0].clientY - touchStartY > 80) closeSheet();
  }, { passive: true });

  /* ── SEARCH & FILTER ───────────────────────────────────────── */
  searchInput.addEventListener('input', renderList);
  filterChips.forEach(btn => {
    btn.addEventListener('click', () => {
      filterChips.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderList();
    });
  });

  /* ── KEYBOARD ──────────────────────────────────────────────── */
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    if (e.code === 'Space')      { e.preventDefault(); togglePlay(); }
    if (e.code === 'ArrowRight') audio.currentTime = Math.min(audio.duration||0, audio.currentTime + 5);
    if (e.code === 'ArrowLeft')  audio.currentTime = Math.max(0, audio.currentTime - 5);
    if (e.code === 'KeyN')       nextTrack();
    if (e.code === 'KeyP')       prevTrack();
  });

  /* ── INIT ──────────────────────────────────────────────────── */
  renderList();

})();
