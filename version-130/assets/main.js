(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    var toggle = qs('.menu-toggle');
    var panel = qs('.mobile-panel');

    if (toggle && panel) {
        toggle.addEventListener('click', function () {
            var opened = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', opened ? 'false' : 'true');
            panel.hidden = opened;
        });
    }

    qsa('[data-hero-carousel]').forEach(function (carousel) {
        var slides = qsa('.hero-slide', carousel);
        var dots = qsa('.hero-dot', carousel);
        var prev = qs('.hero-prev', carousel);
        var next = qs('.hero-next', carousel);
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, pos) {
                slide.classList.toggle('active', pos === current);
            });
            dots.forEach(function (dot, pos) {
                dot.classList.toggle('active', pos === current);
            });
        }

        function move(step) {
            show(current + step);
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                move(1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-slide')) || 0);
                start();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                move(-1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                move(1);
                start();
            });
        }

        carousel.addEventListener('mouseenter', stop);
        carousel.addEventListener('mouseleave', start);
        show(0);
        start();
    });

    qsa('[data-filter-form]').forEach(function (form) {
        var input = qs('input', form);
        var grid = qs('.filter-target');
        var cards = qsa('.movie-card', grid);

        function applyFilter() {
            var keyword = (input.value || '').trim().toLowerCase();
            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute('data-title') || '',
                    card.getAttribute('data-tags') || '',
                    card.getAttribute('data-year') || '',
                    card.getAttribute('data-region') || ''
                ].join(' ').toLowerCase();
                card.style.display = haystack.indexOf(keyword) === -1 ? 'none' : '';
            });
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            applyFilter();
        });

        input.addEventListener('input', applyFilter);
    });
})();
