/* GarageHub website: language switching, small motion touches, placeholder guard.
   Loaded in <head> without defer so the right language shows before first paint. */
(function () {
  var root = document.documentElement;
  var KEY = 'garagehub-lang';
  root.classList.add('js');

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function store(lang) {
    try { localStorage.setItem(KEY, lang); } catch (e) { /* private mode: fine */ }
  }
  function initialLang() {
    var match = /[?&]lang=(ar|en)\b/.exec(location.search);
    if (match) return match[1];
    var saved = stored();
    if (saved === 'ar' || saved === 'en') return saved;
    var prefs = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < prefs.length; i++) {
      var p = String(prefs[i]).toLowerCase();
      if (p.indexOf('ar') === 0) return 'ar';
      if (p.indexOf('en') === 0) return 'en';
    }
    return 'en';
  }

  function apply(lang) {
    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    root.setAttribute('data-lang', lang);
    var title = root.getAttribute('data-title-' + lang);
    if (title) document.title = title;
    var buttons = document.querySelectorAll('[data-set-lang]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', buttons[i].getAttribute('data-set-lang') === lang ? 'true' : 'false');
    }
  }

  apply(initialLang());

  document.addEventListener('DOMContentLoaded', function () {
    apply(root.getAttribute('data-lang'));

    document.addEventListener('click', function (event) {
      var button = event.target.closest && event.target.closest('[data-set-lang]');
      if (!button) return;
      var lang = button.getAttribute('data-set-lang');
      store(lang);
      apply(lang);
    });

    var year = document.querySelectorAll('[data-year]');
    for (var y = 0; y < year.length; y++) year[y].textContent = String(new Date().getFullYear());

    // Placeholder guard: if any {{FIELD}} is still in the page, say so loudly.
    if (/\{\{[A-Z_]+\}\}/.test(document.body.innerHTML)) {
      var banner = document.createElement('div');
      banner.className = 'unfilled-banner';
      banner.setAttribute('role', 'alert');
      banner.innerHTML = '<span data-l="en" lang="en">Draft: highlighted details are not filled in yet. Do not submit this page to App Store Connect.</span>' +
        '<span data-l="ar" lang="ar">مسودة: البيانات المظللة لم تُعبّأ بعد. لا تستخدم هذه الصفحة في App Store Connect.</span>';
      document.body.insertBefore(banner, document.body.firstChild);
      highlightPlaceholders(document.body);
    }

    // Reveal on scroll.
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var reveals = document.querySelectorAll('.reveal, .lifebar');
    if ('IntersectionObserver' in window && !reduce) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add(entry.target.classList.contains('lifebar') ? 'on' : 'in');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add('in', 'on'); });
    }

    // Highlight the current section in a page's table of contents.
    var tocLinks = document.querySelectorAll('.toc a[href^="#"]');
    if (tocLinks.length && 'IntersectionObserver' in window) {
      var byId = {};
      tocLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = byId[a.getAttribute('href').slice(1)] || []; byId[a.getAttribute('href').slice(1)].push(a); });
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          tocLinks.forEach(function (a) { a.classList.remove('active'); });
          (byId[entry.target.id] || []).forEach(function (a) { a.classList.add('active'); });
        });
      }, { rootMargin: '-20% 0px -70% 0px' });
      Object.keys(byId).forEach(function (id) {
        var section = document.getElementById(id);
        if (section) spy.observe(section);
      });
    }
  });

  function highlightPlaceholders(node) {
    var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
    var hits = [];
    while (walker.nextNode()) if (/\{\{[A-Z_]+\}\}/.test(walker.currentNode.nodeValue)) hits.push(walker.currentNode);
    hits.forEach(function (text) {
      var span = document.createElement('span');
      span.innerHTML = text.nodeValue.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; })
        .replace(/\{\{([A-Z_]+)\}\}/g, '<mark class="fill">{{$1}}</mark>');
      text.parentNode.replaceChild(span, text);
    });
  }
})();
