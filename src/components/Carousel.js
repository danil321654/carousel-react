import React, {useState, useLayoutEffect, useRef} from "react";
import {createUseStyles} from "react-jss";

import carouselStyles from "../styles/CarouselStyles";

const useStyles = createUseStyles(carouselStyles);

const Carousel = ({
  content = [],
  crop = true,
  infinite = false,
  width = "400",
  height = width
}) => {
  const makeHtmlContent = cont =>
    cont.map(el => {
      return {
        __html: el.replace(
          /<[^\/> ]*[^ >\/]/gm,
          crop
            ? `$& style="object-fit: cover; min-width: 100%; min-height: 100%; max-height: 100%;"`
            : `$& style="object-fit: cover; width: auto; max-width: 100%; height: auto; max-height: 100%;"`
        )
      };
    });

  const [carouselContent, setCarouselContent] = useState(
    makeHtmlContent(infinite ? [...content, content[0]] : content)
  );
  const [origin, setOrigin] = useState(0);
  const [scrolling, toggleScrolling] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);
  const [curEl, setCurEl] = useState(0);
  const [realSize, setRealSize] = useState({width});
  const carousel = useRef();

  const style = useStyles({
    scrollPos: curEl * (realSize.width - 2) + scrollPos,
    width,
    height,
    scrolling
  });

  useLayoutEffect(() => {
    const updateRealWidth = () =>
      setRealSize(carousel.current.getBoundingClientRect());
    window.addEventListener("resize", updateRealWidth);
    updateRealWidth(carousel.current.getBoundingClientRect().width);
    return () => window.removeEventListener("resize", updateRealWidth);
  }, []);

  const handleTouchStart = e => {
    toggleScrolling(true);
    setOrigin(e.changedTouches["0"].clientX);
  };

  const handleTouchMove = e => {
    if (
      !scrolling ||
      (origin - e.changedTouches["0"].clientX < 0 && curEl == 0) ||
      (origin - e.changedTouches["0"].clientX > 0 &&
        curEl == carouselContent.length - 1 &&
        !infinite)
    )
      return;

    setScrollPos(origin - e.changedTouches["0"].clientX);
  };

  const handleTouchEnd = e => {
    toggleScrolling(false);

    if (
      scrollPos > 0.3 * realSize.width ||
      (origin >= +realSize.x + realSize.width * 0.8 &&
        curEl != carouselContent.length - 1)
    ) {
      if (infinite && curEl == carouselContent.length - 2) setCurEl(0);
      else setCurEl(curEl + 1);
    } else if (
      (-scrollPos >= 0.3 * realSize.width && curEl != 0) ||
      (origin <= +realSize.x + realSize.width * 0.2 && curEl != 0)
    )
      setCurEl(curEl - 1);

    setOrigin(0);
    setScrollPos(0);
  };
  const handleMouseDown = e => {
    toggleScrolling(true);
    setOrigin(e.clientX);
  };

  const handleMouseUp = e => {
    if (
      origin >= +realSize.x + realSize.width * 0.8 &&
      curEl != carouselContent.length - 1
    ) {
      if (infinite && curEl == carouselContent.length - 2) setCurEl(0);
      else setCurEl(curEl + 1);
    } else if (origin <= +realSize.x + realSize.width * 0.2 && curEl != 0)
      setCurEl(curEl - 1);

    setOrigin(0);
  };

  return (
    <div className={style.wrapper} ref={carousel}>
      <div
        className={style.carousel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {carouselContent.map((el, i) => (
          <div key={i} className={style.block} dangerouslySetInnerHTML={el} />
        ))}
      </div>
      <div className={style.select}>
        {[...Array(content.length).keys()].map((el, i) => (
          <div
            key={i}
            className={
              el == curEl ? style.selectCircleSelected : style.selectCircle
            }
            onClick={() => el != curEl && setCurEl(el)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
