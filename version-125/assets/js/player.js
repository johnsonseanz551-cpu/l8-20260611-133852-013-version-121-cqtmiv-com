function setupMoviePlayer(streamUrl) {
    var video = document.getElementById('movie-video');
    var button = document.querySelector('[data-play-button]');
    if (!video || !streamUrl) {
        return;
    }
    var hlsInstance = null;
    var loaded = false;
    function attachSource() {
        if (loaded) {
            return;
        }
        loaded = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(streamUrl);
            hlsInstance.attachMedia(video);
        } else {
            video.src = streamUrl;
        }
    }
    function startPlayback() {
        attachSource();
        if (button) {
            button.classList.add('is-hidden');
        }
        var playResult = video.play();
        if (playResult && typeof playResult.catch === 'function') {
            playResult.catch(function() {});
        }
    }
    if (button) {
        button.addEventListener('click', startPlayback);
    }
    video.addEventListener('click', function() {
        if (video.paused) {
            startPlayback();
        }
    });
    video.addEventListener('play', function() {
        if (button) {
            button.classList.add('is-hidden');
        }
    });
    window.addEventListener('beforeunload', function() {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
