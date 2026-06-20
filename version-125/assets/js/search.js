(function() {
    if (!window.MOVIES && typeof MOVIES === 'undefined') {
        return;
    }
    var data = typeof MOVIES !== 'undefined' ? MOVIES : window.MOVIES;
    var form = document.querySelector('[data-search-page-form]');
    var input = form ? form.querySelector('input[name="q"]') : null;
    var results = document.querySelector('[data-search-results]');
    var status = document.querySelector('[data-search-status]');
    var filters = Array.prototype.slice.call(document.querySelectorAll('[data-search-filter]'));
    if (!form || !input || !results) {
        return;
    }
    function getParam(name) {
        return new URLSearchParams(window.location.search).get(name) || '';
    }
    function unique(key) {
        var list = [];
        data.forEach(function(item) {
            if (item[key] && list.indexOf(item[key]) === -1) {
                list.push(item[key]);
            }
        });
        return list.sort().reverse().slice(0, 80);
    }
    filters.forEach(function(select) {
        var key = select.getAttribute('data-search-filter');
        unique(key).forEach(function(value) {
            var option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });
        select.addEventListener('change', render);
    });
    function card(item) {
        var tags = (item.tags || []).slice(0, 3).map(function(tag) {
            return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');
        return '<article class="movie-card">' +
            '<a class="movie-link" href="' + item.url + '">' +
            '<div class="poster-frame"><img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy" onerror="this.style.display=\'none\'"><div class="poster-shade"></div><div class="poster-play">▶</div><div class="poster-badges"><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.year) + '</span></div></div>' +
            '<div class="movie-body"><h2>' + escapeHtml(item.title) + '</h2><p>' + escapeHtml(item.oneLine) + '</p><div class="movie-meta"><span>' + escapeHtml(item.type) + '</span><span>' + escapeHtml(item.region) + '</span></div><div class="movie-tags">' + tags + '</div></div>' +
            '</a></article>';
    }
    function escapeHtml(value) {
        return String(value).replace(/[&<>"]/g, function(character) {
            return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[character]);
        });
    }
    function render(event) {
        if (event) {
            event.preventDefault();
        }
        var query = input.value.trim().toLowerCase();
        var selected = {};
        filters.forEach(function(select) {
            selected[select.getAttribute('data-search-filter')] = select.value;
        });
        var matched = data.filter(function(item) {
            var text = [item.title, item.region, item.type, item.year, item.genre, (item.tags || []).join(' '), item.oneLine].join(' ').toLowerCase();
            var ok = !query || text.indexOf(query) !== -1;
            Object.keys(selected).forEach(function(key) {
                if (selected[key] && item[key] !== selected[key]) {
                    ok = false;
                }
            });
            return ok;
        }).slice(0, 120);
        if (!query && !selected.region && !selected.type && !selected.year) {
            matched = data.slice(0, 24);
            if (status) {
                status.textContent = '热门推荐';
            }
        } else if (status) {
            status.textContent = matched.length ? '搜索结果' : '暂无匹配内容';
        }
        results.innerHTML = matched.map(card).join('');
    }
    input.value = getParam('q');
    form.addEventListener('submit', render);
    render();
})();
