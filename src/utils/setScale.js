// * 设计稿尺寸（px）
const baseWidth = 1920;
const baseHeight = 1080;

// * 需保持的比例（默认16:9）
const baseProportion = parseFloat((baseWidth / baseHeight).toFixed(5));

/**
 * 根据1920*1080进行scale缩放
 * @param props
 */
const setScaleResize = (props) => {
  const { boxRef } = props;

  const setScale = () => {
    const scale = getScale();
    if (boxRef.current) {
      boxRef.current.style.width = "1920px";
      boxRef.current.style.height = "1080px";
      boxRef.current.style.transform = `scale(${scale},  ${scale}) translate(-50%, -50%)`;
    }
  };

  const getScale = () => {
    const width = 1920;
    const height = 1080;
    const scale_width = window.innerWidth / width;
    const scale_height = window.innerHeight / height;
    return Math.min(scale_width, scale_height).toFixed(6);
  };

  const debounce = (fn, delay = 50) => {
    let _this = this;
    let cancelId = null;
    return function () {
      cancelId && clearTimeout(cancelId);
      cancelId = setTimeout(() => {
        fn.apply(_this, arguments);
      }, delay);
    };
  };

  setScale();
  window.addEventListener("resize", debounce(setScale));
  return setScale;
};

export { setScaleResize };
