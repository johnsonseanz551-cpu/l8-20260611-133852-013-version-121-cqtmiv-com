function setupMoviePlayer(streamUrl) {
    var video = document.querySelector('.movie-video');
    var cover = document.querySelector('.play-cover');
    var hlsInstance = null;
    var bound = false;

    if (!video || !streamUrl) {
        return;
    }

    function bind() {
        if (bound) {
            return;
        }

        bound = true;

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hlsInstance.loadSource(streamUrl);
            hlsInstance.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = streamUrl;
        } else {
            video.src = streamUrl;
        }
    }

    function play() {
        bind();
        if (cover) {
            cover.classList.add('hidden');
        }
        var action = video.play();
        if (action && typeof action.catch === 'function') {
            action.catch(function () {});
        }
    }

    if (cover) {
        cover.addEventListener('click', play);
    }

    video.addEventListener('click', function () {
        if (video.paused) {
            play();
        }
    });

    video.addEventListener('play', function () {
        if (cover) {
            cover.classList.add('hidden');
        }
    });

    window.addEventListener('pagehide', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
            hlsInstance = null;
        }
    });
}
