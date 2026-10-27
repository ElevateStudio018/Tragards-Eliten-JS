/*
 * Liten växlare mellan designförslagen. Tas bort när ett förslag är valt.
 * Dölj den med ?ren i adressen, t.ex. forslag-1/?ren
 */
(function () {
  if (/[?&]ren\b/.test(location.search)) return;
  var current = (location.pathname.match(/forslag-(\d)/) || [])[1];
  var names = ['Klassisk', 'Fullbild', 'Mörk', 'Mjuk', 'Lime'];
  var bar = document.createElement('nav');
  bar.setAttribute('aria-label', 'Designförslag');
  bar.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:9999;display:flex;gap:2px;align-items:center;' +
    'padding:4px;background:#111;color:#fff;border-radius:999px;font:500 12px/1 system-ui,sans-serif;' +
    'box-shadow:0 4px 18px rgba(0,0,0,.25)';
  var html = '<a href="../" style="color:#bbb;text-decoration:none;padding:7px 10px">Alla förslag</a>';
  names.forEach(function (n, i) {
    var no = String(i + 1);
    var on = no === current;
    html += '<a href="../forslag-' + no + '/" title="' + n + '"' + (on ? ' aria-current="page"' : '') +
      ' style="text-decoration:none;padding:7px 10px;border-radius:999px;' +
      (on ? 'background:#fff;color:#111' : 'color:#fff') + '">' + no + '</a>';
  });
  html += '<button type="button" aria-label="Dölj" style="all:unset;cursor:pointer;color:#888;padding:7px 10px">×</button>';
  bar.innerHTML = html;
  bar.querySelector('button').onclick = function () { bar.remove(); };
  document.addEventListener('DOMContentLoaded', function () { document.body.appendChild(bar); });
})();
