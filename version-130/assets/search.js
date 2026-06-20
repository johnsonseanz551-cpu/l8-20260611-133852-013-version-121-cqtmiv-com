(function () {
    var input = document.getElementById('searchInput');
    var results = document.getElementById('searchResults');
    var status = document.getElementById('searchStatus');
    var params = new URLSearchParams(window.location.search);
    var keyword = params.get('q') || '';

    if (!input || !results || !status || !window.SEARCH_MOVIES) {
        return;
    }

    input.value = keyword;

    function createCard(movie) {
        var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
            return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');

        return [
            '<article class="movie-card">',
            '<a href="' + escapeHtml(movie.url) + '" class="poster-link" aria-label="观看' + escapeHtml(movie.title) + '">',
            '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '<span class="score-badge">' + escapeHtml(movie.score) + '</span>',
            '<span class="poster-play">▶</span>',
            '</a>',
            '<div class="movie-card-body">',
            '<a href="' + escapeHtml(movie.url) + '" class="movie-title">' + escapeHtml(movie.title) + '</a>',
            '<p>' + escapeHtml(movie.line) + '</p>',
            '<div class="movie-meta"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.type) + '</span></div>',
            '<div class="pill-row">' + tags + '</div>',
            '</div>',
            '</article>'
        ].join('');
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function render() {
        var q = (input.value || '').trim().toLowerCase();
        var list = window.SEARCH_MOVIES.filter(function (movie) {
            if (!q) {
                return true;
            }
            return [
                movie.title,
                movie.region,
                movie.type,
                movie.year,
                movie.genre,
                (movie.tags || []).join(' '),
                movie.line
            ].join(' ').toLowerCase().indexOf(q) !== -1;
        }).slice(0, 120);

        status.textContent = q ? '搜索结果：' + list.length + ' 部相关影片' : '热门影片推荐';
        results.innerHTML = list.length ? list.map(createCard).join('') : '<div class="no-results">没有找到匹配的影片</div>';
    }

    input.addEventListener('input', render);
    render();
})();
