/* ============================================================
   app.js — Logique principale du lecteur
   ============================================================ */

(function () {
  'use strict';

  /* ── ÉLÉMENTS DOM ─────────────────────────────────────────── */
  const audio         = document.getElementById('audioPlayer');
  const trackList     = document.getElementById('trackList');
  const trackTitle    = document.getElementById('trackTitle');
  const trackSubtitle = document.getElementById('trackSubtitle');
  const albumImg      = document.getElementById('albumImg');
  const albumPH       = document.getElementById('albumPlaceholder');
  const synopsisBox   = document.getElementById('synopsisBox');
  const synopsisText  = document.getElementById('synopsisText');
  const progressFill  = document.getElementById('progressFill');
  const progressThumb = document.getElementById('progressThumb');
  const progressBar   = document.getElementById('progressBar');
  const currentTimeEl = document.getElementById('currentTime');
  const totalTimeEl   = document.getElementById('totalTime');
  const btnPlay       = document.getElementById('btnPlay');
  const btnPrev       = document.getElementById('btnPrev');
  const btnNext       = document.getElementById('btnNext');
  const btnShuffle    = document.getElementById('btnShuffle');
  const btnRepeat     = document.getElementById('btnRepeat');
  const btnDownload   = document.getElementById('btnDownload');
  const btnLyrics     = document.getElementById('btnLyrics');
  const lyricsPanel   = document.getElementById('lyricsPanel');
  const lyricsContent = document.getElementById('lyricsContent');
  const closeLyrics   = document.getElementById('closeLyrics');
  const volumeSlider  = document.getElementById('volumeSlider');
  const searchInput   = document.getElementById('searchInput');
  const filterBtns    = document.querySelectorAll('.filter-btn');
  const sidebar       = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const openSidebar   = document.getElementById('openSidebar');
  const canvas        = document.getElementById('visualizer');
  const ctx2d         = canvas.getContext('2d');

  /* ── STATE ────────────────────────────────────────────────── */
  let currentIndex = -1;
  let isPlaying    = false;
  let isShuffle    = false;
  let isRepeat     = false;
  let currentFilter = 'all';
  let filteredTracks = [...TRACKS];

  /* ── WEB AUDIO ────────────────────────────────────────────── */
  let audioCtx, analyser, source, dataArray, bufferLength;

  function initAudio() {
    if (audioCtx) return;
    audioCtx   = new (window.AudioContext || window.webkitAudioContext)();
    analyser   = audioCtx.createAnalyser();
    source     = audioCtx.createMediaElementSource(audio);
    analyser.fftSize = 256;
    bufferLength = analyser.frequencyBinCount;
    dataArray    = new Uint8Array(bufferLength);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    drawVisualizer();
  }

  /* ── VISUALIZER ───────────────────────────────────────────── */
  function resizeCanvas() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);
    if (!analyser) {
      drawIdle();
      return;
    }
    analyser.getByteFrequencyData(dataArray);
    ctx2d.clearRect(0, 0, canvas.width, canvas.height);

    const W = canvas.width, H = canvas.height;
    const barCount = bufferLength;
    const barW  = (W / barCount) * 1.4;
    const gap   = 1.5;

    for (let i = 0; i < barCount; i++) {
      const val    = dataArray[i] / 255;
      const barH   = val * H * 0.85;
      const x      = i * (barW + gap) + (W - barCount * (barW + gap)) / 2;

      // gradient per bar
      const grad = ctx2d.createLinearGradient(0, H - barH, 0, H);
      const hue  = 100 + (i / barCount) * 100; // green → cyan
      grad.addColorStop(0, `hsla(${hue}, 100%, 65%, ${0.2 + val * 0.8})`);
      grad.addColorStop(1, `hsla(${hue}, 100%, 40%, 0.05)`);

      ctx2d.fillStyle = grad;
      ctx2d.beginPath();
      ctx2d.roundRect
        ? ctx2d.roundRect(x, H - barH, barW, barH, 2)
        : ctx2d.rect(x, H - barH, barW, barH);
      ctx2d.fill();

      // reflection
      ctx2d.fillStyle = `hsla(${hue}, 100%, 65%, ${val * 0.08})`;
      ctx2d.beginPath();
      ctx2d.rect(x, H, barW, barH * 0.25);
      ctx2d.fill();
    }
  }

  function drawIdle() {
    const W = canvas.width, H = canvas.height;
    ctx2d.clearRect(0, 0, W, H);
    const barCount = 64;
    const barW = (W / barCount) * 1.4;
    const gap  = 1.5;
    const now  = Date.now() / 1000;
    for (let i = 0; i < barCount; i++) {
      const val  = (Math.sin(now * 1.2 + i * 0.3) + 1) / 2 * 0.08 + 0.02;
      const barH = val * H * 0.85;
      const x    = i * (barW + gap) + (W - barCount * (barW + gap)) / 2;
      ctx2d.fillStyle = `rgba(87, 200, 255, ${val})`;
      ctx2d.fillRect(x, H - barH, barW, barH);
    }
  }

  /* ── RENDER TRACKLIST ─────────────────────────────────────── */
  function renderTrackList(tracks) {
    trackList.innerHTML = '';
    tracks.forEach((track, idx) => {
      const li = document.createElement('li');
      li.className = 'track-item' + (track._origIdx === currentIndex ? ' active' + (isPlaying ? ' is-playing' : '') : '');
      li.dataset.idx = track._origIdx;

      const thumb = track.cover
        ? `<div class="track-item-thumb"><img src="${track.cover}" alt="" loading="lazy" onerror="this.style.display='none'" /></div>`
        : `<div class="track-item-thumb">◈</div>`;

      li.innerHTML = `
        ${thumb}
        <div class="track-item-info">
          <div class="track-item-name">${track.title}</div>
          <div class="track-item-meta">${track.genre}</div>
        </div>
        <div class="track-item-num">
          <span class="num-label">${track.id}</span>
          <span class="playing-bars"><span></span><span></span><span></span></span>
        </div>
      `;
      li.addEventListener('click', () => loadTrack(track._origIdx, true));
      trackList.appendChild(li);
    });
  }

  function prepTracks(arr) {
    return arr.map((t, i) => ({ ...t, _origIdx: i }));
  }

  function applyFilter() {
    const q = searchInput.value.trim().toLowerCase();
    filteredTracks = prepTracks(TRACKS).filter(t => {
      const matchGenre = currentFilter === 'all'
        || t.genre.toLowerCase().includes(currentFilter.replace('genre1','ambient').replace('genre2','electronic').replace('genre3','cinematic'));
      const matchSearch = !q || t.title.toLowerCase().includes(q) || t.genre.toLowerCase().includes(q) || (t.synopsis && t.synopsis.toLowerCase().includes(q));
      return matchGenre && matchSearch;
    });
    renderTrackList(filteredTracks);
  }

  /* ── LOAD TRACK ───────────────────────────────────────────── */
  function loadTrack(origIdx, autoplay = false) {
    currentIndex = origIdx;
    const track  = TRACKS[origIdx];

    // Audio
    audio.src = track.src;
    audio.volume = parseFloat(volumeSlider.value);

    // UI — info
    trackTitle.textContent    = track.title;
    trackSubtitle.textContent = track.genre;

    // Cover
    if (track.cover) {
      albumImg.src = track.cover;
      albumImg.onload  = () => { albumImg.classList.add('loaded'); albumPH.style.display = 'none'; };
      albumImg.onerror = () => { albumImg.classList.remove('loaded'); albumPH.style.display = ''; };
    } else {
      albumImg.classList.remove('loaded');
      albumPH.style.display = '';
    }

    // Synopsis
    if (track.synopsis) {
      synopsisText.textContent = track.synopsis;
      synopsisBox.classList.add('visible');
    } else {
      synopsisBox.classList.remove('visible');
    }

    // Lyrics panel
    if (lyricsPanel.classList.contains('open')) {
      displayLyrics(track);
    }

    // Update list
    applyFilter();

    if (autoplay) playAudio();
  }

  /* ── PLAYBACK ─────────────────────────────────────────────── */
  function playAudio() {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    audio.play().then(() => {
      isPlaying = true;
      btnPlay.textContent = '⏸';
      updateActiveItem();
    }).catch(() => {});
  }

  function pauseAudio() {
    audio.pause();
    isPlaying = false;
    btnPlay.textContent = '▶';
    updateActiveItem();
  }

  function togglePlay() {
    if (currentIndex === -1) { loadTrack(0, true); return; }
    isPlaying ? pauseAudio() : playAudio();
  }

  function nextTrack() {
    if (!TRACKS.length) return;
    let next;
    if (isShuffle) {
      next = Math.floor(Math.random() * TRACKS.length);
    } else {
      next = (currentIndex + 1) % TRACKS.length;
    }
    loadTrack(next, true);
  }

  function prevTrack() {
    if (audio.currentTime > 3) { audio.currentTime = 0; return; }
    const prev = (currentIndex - 1 + TRACKS.length) % TRACKS.length;
    loadTrack(prev, true);
  }

  function updateActiveItem() {
    document.querySelectorAll('.track-item').forEach(el => {
      const idx = parseInt(el.dataset.idx);
      el.classList.toggle('active', idx === currentIndex);
      el.classList.toggle('is-playing', idx === currentIndex && isPlaying);
    });
  }

  /* ── PROGRESS ─────────────────────────────────────────────── */
  function formatTime(s) {
    if (isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width  = pct + '%';
    progressThumb.style.left  = pct + '%';
    currentTimeEl.textContent = formatTime(audio.currentTime);
    totalTimeEl.textContent   = formatTime(audio.duration);
  });

  audio.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('ended', () => {
    if (isRepeat) { audio.currentTime = 0; playAudio(); }
    else nextTrack();
  });

  progressBar.addEventListener('click', e => {
    const rect = progressBar.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  });

  /* ── CONTROLS EVENTS ──────────────────────────────────────── */
  btnPlay.addEventListener('click', togglePlay);
  btnNext.addEventListener('click', nextTrack);
  btnPrev.addEventListener('click', prevTrack);

  btnShuffle.addEventListener('click', () => {
    isShuffle = !isShuffle;
    btnShuffle.classList.toggle('active', isShuffle);
  });
  btnRepeat.addEventListener('click', () => {
    isRepeat = !isRepeat;
    btnRepeat.classList.toggle('active', isRepeat);
  });

  volumeSlider.addEventListener('input', () => {
    audio.volume = parseFloat(volumeSlider.value);
  });

  /* ── DOWNLOAD ─────────────────────────────────────────────── */
  btnDownload.addEventListener('click', () => {
    if (currentIndex === -1) return;
    const track = TRACKS[currentIndex];
    const a = document.createElement('a');
    a.href     = track.src;
    a.download = track.title + '.mp3';
    a.click();
  });

  /* ── LYRICS ───────────────────────────────────────────────── */
  function displayLyrics(track) {
    if (track && track.lyrics) {
      lyricsContent.innerHTML = `<p>${escapeHtml(track.lyrics)}</p>`;
    } else {
      lyricsContent.innerHTML = '<p class="lyrics-placeholder">Aucune parole disponible pour ce morceau.</p>';
    }
  }

  btnLyrics.addEventListener('click', () => {
    lyricsPanel.classList.toggle('open');
    if (lyricsPanel.classList.contains('open') && currentIndex !== -1) {
      displayLyrics(TRACKS[currentIndex]);
    }
  });
  closeLyrics.addEventListener('click', () => lyricsPanel.classList.remove('open'));

  /* ── SEARCH & FILTER ──────────────────────────────────────── */
  searchInput.addEventListener('input', applyFilter);

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      applyFilter();
    });
  });

  /* ── SIDEBAR TOGGLE ───────────────────────────────────────── */
  sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  openSidebar.addEventListener('click',   () => sidebar.classList.toggle('open'));

  /* ── KEYBOARD SHORTCUTS ───────────────────────────────────── */
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    if (e.code === 'Space')       { e.preventDefault(); togglePlay(); }
    if (e.code === 'ArrowRight')  { audio.currentTime = Math.min(audio.duration, audio.currentTime + 5); }
    if (e.code === 'ArrowLeft')   { audio.currentTime = Math.max(0, audio.currentTime - 5); }
    if (e.code === 'ArrowUp')     { volumeSlider.value = Math.min(1, +volumeSlider.value + 0.05); audio.volume = volumeSlider.value; }
    if (e.code === 'ArrowDown')   { volumeSlider.value = Math.max(0, +volumeSlider.value - 0.05); audio.volume = volumeSlider.value; }
    if (e.code === 'KeyN')        nextTrack();
    if (e.code === 'KeyP')        prevTrack();
  });

  /* ── HELPERS ──────────────────────────────────────────────── */
  function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  /* ── INIT ─────────────────────────────────────────────────── */
  applyFilter();
  resizeCanvas();
  requestAnimationFrame(drawVisualizer);

  // Collapse sidebar on mobile by default
  if (window.innerWidth <= 768) {
    sidebar.classList.remove('open');
  }

})();
