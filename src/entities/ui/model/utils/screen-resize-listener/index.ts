import { getScreenSize } from '../sizes';
// import { logger } from 'shared/utils';
// const log = logger(`listener-rezise-screen.js`);


/** Listener on resize display */
export const screenResizeListener = (setScreenFormats: (size: number) => void) => {
  // log(`START LISTENER RESIZE`);

  // Получаем текущий размер экрана и сохраняем в store
  function actualResizeHandler() {
    const screenSize = getScreenSize();
    setScreenFormats(screenSize);
  }

  // @ts-ignore
  let resizeTimeout;
  function resizeThrottler() {
    // ignore resize events as long as an actualResizeHandler execution is in the queue
    // @ts-ignore
    if (! resizeTimeout) {
      resizeTimeout = setTimeout(() => {
        resizeTimeout = null;
        actualResizeHandler();

      // The actualResizeHandler will execute at a rate of 15fps
      }, 200);
    }
  }

  window.addEventListener('resize', resizeThrottler, false);


  // Один раз запускаем в самом начале
  actualResizeHandler();
};
