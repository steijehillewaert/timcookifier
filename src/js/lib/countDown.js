const step = ({ resolve, count, value, interval, $shutter, $beep }) => {
  if (value === count) {
    $shutter.play();

    clearInterval(interval); // niet vergeten interval te clearen

    resolve(); // klaar! resolve Promise
  } else {
    $beep.play();
  }
};

export default ({ count = 4, intervalTime = 500 } = {}) => {
  const $shutter = document.querySelector(`.shutter`);
  const $beep = document.querySelector(`.beep`);

  let value = 0;

  return new Promise(resolve => {
    const interval = setInterval(() => {
      ++value; // eerst optellen en dan doorgeven.. ≠ val++

      // waarden doorgeven als object
      step({
        resolve, // resolve doorgeven, nodig in step
        count,
        value,
        interval,
        $shutter,
        $beep
      });
    }, intervalTime);
  });
};
