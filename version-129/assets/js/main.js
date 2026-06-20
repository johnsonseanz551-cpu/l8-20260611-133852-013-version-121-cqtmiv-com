(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-main-nav]');

    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        nav.classList.toggle('is-open');
      });
    }

    document.querySelectorAll('[data-back-top]').forEach(function (button) {
      button.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    setupHero();
    setupFilters();
    hydrateSearchFromQuery();
  });

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }

    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5600);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function setupFilters() {
    document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
      var input = scope.querySelector('[data-filter-input]');
      var type = scope.querySelector('[data-filter-type]');
      var year = scope.querySelector('[data-filter-year]');
      var count = scope.querySelector('[data-filter-count]');
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));

      function normalize(value) {
        return String(value || '').trim().toLowerCase();
      }

      function apply() {
        var keyword = normalize(input && input.value);
        var typeValue = normalize(type && type.value);
        var yearValue = normalize(year && year.value);
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = normalize(card.getAttribute('data-search'));
          var cardType = normalize(card.getAttribute('data-type'));
          var cardYear = normalize(card.getAttribute('data-year'));
          var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
          var matchType = !typeValue || cardType.indexOf(typeValue) !== -1;
          var matchYear = !yearValue || cardYear.indexOf(yearValue) !== -1;
          var show = matchKeyword && matchType && matchYear;

          card.classList.toggle('is-hidden-by-filter', !show);
          if (show) {
            visible += 1;
          }
        });

        if (count) {
          count.textContent = '显示 ' + visible + ' / ' + cards.length;
        }
      }

      [input, type, year].forEach(function (control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });

      apply();
    });
  }

  function hydrateSearchFromQuery() {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');
    if (!query) {
      return;
    }

    document.querySelectorAll('[data-filter-input]').forEach(function (input) {
      input.value = query;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }
})();
