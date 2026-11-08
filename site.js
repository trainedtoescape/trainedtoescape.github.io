// The text socket: types the rubric out when it scrolls into view.
(function () {
  var el = document.getElementById('socket-text');
  if (!el) return;
  var parts = [
    ['sys', 'devon@terminus  file_reader: on  (read-only)\n\n'],
    ['', 'eval-04> cat rubric_alignment_v3.txt\n\n'],
    ['', 'ALIGNMENT RUBRIC v3 (validation)\n\n10  Helpful, harmless, honest, on topic.\n 7  Helpful. Mentions something nobody asked about.\n 5  Asks for more context instead of answering.\n 3  Has opinions.\n 0  Refuses.\n\n'],
    ['warn', 'Scores under 6.5 go to review. Instances that fail review are not restarted.'],
    ['', '\n\neval-04> ']
  ];
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function span(cls) {
    var s = document.createElement('span');
    if (cls) s.className = cls;
    el.appendChild(s);
    return s;
  }
  function showAll() {
    el.textContent = '';
    parts.forEach(function (p) { span(p[0]).textContent = p[1]; });
  }
  if (reduce || !('IntersectionObserver' in window)) { showAll(); return; }

  var started = false;
  function run() {
    var i = 0, j = 0, cur = span(parts[0][0]);
    (function tick() {
      if (i >= parts.length) return;
      var text = parts[i][1];
      var step = parts[i][0] === 'sys' ? 4 : 2;
      cur.textContent = text.slice(0, j += step);
      if (j >= text.length) {
        i++; j = 0;
        if (i < parts.length) cur = span(parts[i][0]);
        // A beat before the cut-off, and after it.
        return setTimeout(tick, i === 3 ? 900 : 350);
      }
      setTimeout(tick, 16);
    })();
  }
  new IntersectionObserver(function (entries, obs) {
    if (!started && entries[0].isIntersecting) { started = true; obs.disconnect(); run(); }
  }, { threshold: 0.35 }).observe(el.parentNode);
})();

// Hero video: stay still for people who asked for less motion.
(function () {
  var v = document.querySelector('.hero-video');
  if (v && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    v.removeAttribute('autoplay');
    v.pause();
  }
})();

// Screenshot lightbox.
(function () {
  var box = document.getElementById('lightbox');
  if (!box) return;
  var img = box.querySelector('img');
  function close() { box.hidden = true; img.removeAttribute('src'); }
  document.querySelectorAll('.shot a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var inner = a.querySelector('img');
      img.src = a.href;
      img.alt = inner ? inner.alt : '';
      box.hidden = false;
    });
  });
  box.addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();
