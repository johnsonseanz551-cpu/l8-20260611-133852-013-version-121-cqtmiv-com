(function() {
    function bySelector(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');
    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function() {
            mobilePanel.classList.toggle('open');
        });
    }

    bySelector('[data-search-form]').forEach(function(form) {
        form.addEventListener('submit', function(event) {
            var input = form.querySelector('input[name="q"]');
            if (input && input.value.trim()) {
                event.preventDefault();
                window.location.href = 'search.html?q=' + encodeURIComponent(input.value.trim());
            }
        });
    });

    var slider = document.querySelector('[data-hero-slider]');
    if (slider) {
        var slides = bySelector('[data-hero-slide]', slider);
        var dots = bySelector('[data-hero-dot]', slider);
        var current = 0;
        function showSlide(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function(slide, i) {
                slide.classList.toggle('active', i === current);
            });
            dots.forEach(function(dot, i) {
                dot.classList.toggle('active', i === current);
            });
        }
        dots.forEach(function(dot, i) {
            dot.addEventListener('click', function() {
                showSlide(i);
            });
        });
        if (slides.length > 1) {
            setInterval(function() {
                showSlide(current + 1);
            }, 5600);
        }
    }

    bySelector('[data-auto-options]').forEach(function(grid) {
        ['region', 'type', 'year'].forEach(function(key) {
            var select = document.querySelector('[data-filter-select="' + key + '"]');
            if (!select) {
                return;
            }
            var values = [];
            bySelector('[data-movie-card]', grid).forEach(function(card) {
                var value = card.getAttribute('data-' + key);
                if (value && values.indexOf(value) === -1) {
                    values.push(value);
                }
            });
            values.sort().reverse().slice(0, 80).forEach(function(value) {
                var option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                select.appendChild(option);
            });
        });
    });

    var filterGrid = document.querySelector('[data-filter-grid]');
    if (filterGrid) {
        var input = document.querySelector('[data-filter-input]');
        var selects = bySelector('[data-filter-select]');
        var cards = bySelector('[data-movie-card]', filterGrid);
        function applyFilters() {
            var query = input ? input.value.trim().toLowerCase() : '';
            var selected = {};
            selects.forEach(function(select) {
                selected[select.getAttribute('data-filter-select')] = select.value;
            });
            cards.forEach(function(card) {
                var text = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-tags')
                ].join(' ').toLowerCase();
                var visible = !query || text.indexOf(query) !== -1;
                Object.keys(selected).forEach(function(key) {
                    if (selected[key] && card.getAttribute('data-' + key) !== selected[key]) {
                        visible = false;
                    }
                });
                card.style.display = visible ? '' : 'none';
            });
        }
        if (input) {
            input.addEventListener('input', applyFilters);
        }
        selects.forEach(function(select) {
            select.addEventListener('change', applyFilters);
        });
    }
})();
