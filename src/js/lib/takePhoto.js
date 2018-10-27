const createFlash = () => {

  const $flash = document.createElement(`div`);
  $flash.classList.add(`flash`);

  document.body.appendChild($flash);

  return $flash;

};

const removeFlash = $flash =>
  $flash.parentNode.removeChild($flash);

export default $video => {
    
    return new Promise(resolve => {
      const $flash = createFlash();
    
      $flash.addEventListener(`animationend`, e => {
        removeFlash(e.currentTarget);
        resolve();
      });
      
      $video.pause();
      setInterval(() => {$video.play()}, 2500);
    
    });
};
