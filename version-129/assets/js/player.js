import { H as Hls } from './hls.js';

function getMessage(shell) {
  return shell.querySelector('[data-player-message]');
}

function setMessage(shell, text) {
  var message = getMessage(shell);
  if (message) {
    message.textContent = text || '';
  }
}

function attachHls(video, source, shell) {
  if (!source) {
    setMessage(shell, '未找到播放地址。');
    return Promise.reject(new Error('Missing video source'));
  }

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
    return video.play();
  }

  if (Hls && Hls.isSupported()) {
    var hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90
    });

    hls.loadSource(source);
    hls.attachMedia(video);
    video._hlsInstance = hls;

    return new Promise(function (resolve, reject) {
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play().then(resolve).catch(reject);
      });

      hls.on(Hls.Events.ERROR, function (eventName, data) {
        if (data && data.fatal) {
          setMessage(shell, '视频加载失败，请稍后重试。');
          reject(new Error(data.details || 'HLS fatal error'));
        }
      });
    });
  }

  setMessage(shell, '当前浏览器不支持 HLS 播放。');
  return Promise.reject(new Error('HLS is not supported'));
}

function setupPlayer(shell) {
  var video = shell.querySelector('[data-hls-video]');
  var button = shell.querySelector('[data-play-button]');

  if (!video || !button) {
    return;
  }

  button.addEventListener('click', function () {
    var source = video.getAttribute('data-src');

    button.classList.add('is-hidden');
    setMessage(shell, '正在初始化高清播放源...');

    attachHls(video, source, shell)
      .then(function () {
        setMessage(shell, '');
      })
      .catch(function () {
        button.classList.remove('is-hidden');
      });
  });

  video.addEventListener('play', function () {
    button.classList.add('is-hidden');
  });
}

document.querySelectorAll('[data-player-shell]').forEach(setupPlayer);
