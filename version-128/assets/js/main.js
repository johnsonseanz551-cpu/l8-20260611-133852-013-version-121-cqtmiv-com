
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function setupNav() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var next = hero.querySelector('[data-hero-next]');
    var prev = hero.querySelector('[data-hero-prev]');
    var index = 0;
    var timer = null;

    function show(target) {
      if (!slides.length) {
        return;
      }
      index = (target + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle('is-active', itemIndex === index);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle('is-active', itemIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }
    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }
    dots.forEach(function (dot, itemIndex) {
      dot.addEventListener('click', function () {
        show(itemIndex);
        start();
      });
    });
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function textOf(card) {
    return [
      card.getAttribute('data-title') || '',
      card.getAttribute('data-category') || '',
      card.getAttribute('data-region') || '',
      card.getAttribute('data-genre') || '',
      card.getAttribute('data-year') || '',
      card.getAttribute('data-keywords') || ''
    ].join(' ').toLowerCase();
  }

  function setupFilters() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));
    scopes.forEach(function (scope) {
      var input = scope.querySelector('[data-filter-text]');
      var year = scope.querySelector('[data-filter-year]');
      var category = scope.querySelector('[data-filter-category]');
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
      var empty = scope.querySelector('[data-empty]');

      if (scope.hasAttribute('data-query-from-url') && input) {
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');
        if (q) {
          input.value = q;
        }
      }

      function apply() {
        var query = input ? input.value.trim().toLowerCase() : '';
        var yearValue = year ? year.value : '';
        var categoryValue = category ? category.value : '';
        var visible = 0;

        cards.forEach(function (card) {
          var matchesText = !query || textOf(card).indexOf(query) !== -1;
          var matchesYear = !yearValue || card.getAttribute('data-year') === yearValue;
          var matchesCategory = !categoryValue || card.getAttribute('data-category') === categoryValue;
          var matched = matchesText && matchesYear && matchesCategory;
          card.hidden = !matched;
          if (matched) {
            visible += 1;
          }
        });

        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      if (input) {
        input.addEventListener('input', apply);
      }
      if (year) {
        year.addEventListener('change', apply);
      }
      if (category) {
        category.addEventListener('change', apply);
      }
      apply();
    });
  }

  function attachStream(video, url) {
    if (!video || !url || video.getAttribute('data-ready') === '1') {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(url);
      hls.attachMedia(video);
      video.hlsInstance = hls;
    } else {
      video.src = url;
    }

    video.setAttribute('data-ready', '1');
  }

  function setupPlayers() {
    var frames = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
    frames.forEach(function (frame) {
      var video = frame.querySelector('video');
      var button = frame.querySelector('.player-start');
      var stream = frame.getAttribute('data-stream');

      function start() {
        attachStream(video, stream);
        frame.classList.add('is-playing');
        video.controls = true;
        var playResult = video.play();
        if (playResult && typeof playResult.catch === 'function') {
          playResult.catch(function () {});
        }
      }

      if (button) {
        button.addEventListener('click', start);
      }
      if (video) {
        video.addEventListener('click', function () {
          if (video.paused) {
            start();
          } else {
            video.pause();
          }
        });
        video.addEventListener('play', function () {
          frame.classList.add('is-playing');
        });
      }
    });
  }

  ready(function () {
    setupNav();
    setupHero();
    setupFilters();
    setupPlayers();
  });
}());
