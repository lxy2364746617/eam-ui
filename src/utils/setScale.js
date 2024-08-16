// * 默认缩放值
const scale = {
  width: "1",
  height: "1",
};

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
  const { boxRef, relativeRef } = props;

  const setScale = () => {
    const scale = getScale();
    if (boxRef?.style) {
      boxRef.style.width = "1920px";
      boxRef.style.height = "1080px";
      boxRef.style.transform = `scale(${scale},  ${scale}) translate(-50%, -50%)`;
    }
  };

  const getScale = () => {
    let scale_width;
    let scale_height;
    if (relativeRef) {
      // 相对父级元素定位时 计算父级宽高（暂时写死）
      scale_width = (window.innerWidth - 206) / baseWidth;
      scale_height = (window.innerHeight - 111) / baseHeight;
    } else {
      scale_width = window.innerWidth / baseWidth;
      scale_height = window.innerHeight / baseHeight;
    }
    return Math.min(scale_width, scale_height).toFixed(6);
  };

  const debounce = (fn, delay = 150) => {
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
