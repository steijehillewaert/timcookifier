import countDown from "./lib/countDown";
import takePhoto from "./lib/takePhoto";

{
  const $canvas = document.querySelector(".card"),
    $video = document.querySelector(`.video`),
    $tim = document.querySelector(".tim"),
    $button = document.querySelector(".button");

  const SPACE = 32;

  const init = () => {

    $button.addEventListener(`mousedown`, handleClickButton);

    showAlbum();

    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: 640,
          height: 480
        },
        audio: false
      })
      .then(stream => {
        $video.srcObject = stream;
        $canvas.width = $video.width;
        $canvas.height = $video.height;
        render();
      });

    document.addEventListener(`keydown`, handleKeydown);
  };

  const handleClickButton = e => {
    console.log("click");

    e.preventDefault();
    if ($video.paused) {
      $video.play();
    } else {
      countDown()
        .then(() => takePhoto($video))
        .then(() => handlePhoto($canvas));
    }
  }

  const handleKeydown = e => {
    if (e.keyCode === SPACE) {
      e.preventDefault();
      if ($video.paused) {
        $video.play();
      } else {
        countDown()
          .then(() => takePhoto($video))
          .then(() => handlePhoto($canvas));
      }
    }
  };

  const render = () => {
    const ctx = $canvas.getContext("2d");
    requestAnimationFrame(render);
    ctx.clearRect(0, 0, $canvas.width, $canvas.height);

    ctx.save();
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-$video.width, 0);
    ctx.drawImage($video, -140, 130);
    ctx.restore();
    ctx.drawImage($tim, 0, 0);
    ctx.restore();
  };

  const handlePhoto = $canvas => {
    const data = $canvas.toDataURL("image/jpeg");
    createThumb(data);
    saveThumb(data);
  };

  const createThumb = data => {
    const $link = document.createElement("a");
    $link.href = data;
    $link.classList.add("thumb");
    $link.setAttribute("download", "timcookifier");
    $link.innerHTML = `<img src="${data}" alt="timcookifier" class="photo" />`;

    $link.addEventListener(`click`, e => {
      if (e.target.classList.contains("thumb")) {
        e.preventDefault();
        handleRemoveThumb(e.target);
      }
    });

    const $photos = document.querySelector(`main`);
    $photos.appendChild($link);
  };

  const handleRemoveThumb = $link => {
    removeFromAlbum($link);
    removeThumb($link);
  };

  const removeThumb = $thumb => {
    $thumb.classList.add(`removeThumb`);
    $thumb.addEventListener(`animationend`, e => {
      e.currentTarget.remove();
    });
  };

  const saveThumb = data => {
    const album = getAlbum();
    album.push(data);
    saveAlbum(album);
  };

  const getAlbum = () => {
    const album = localStorage.getItem(`album`);
    if (album) {
      return JSON.parse(album);
    }
    return [];
  };

  const saveAlbum = album => {
    localStorage.setItem(`album`, JSON.stringify(album));
  };

  const showAlbum = () => {
    const album = getAlbum();
    album.forEach(createThumb);
  };

  const removeFromAlbum = $link => {
    const album = getAlbum();
    saveAlbum(album.filter(fotoString => $link != fotoString)); //$link.toString() === $link.href
  };

  init();
}
