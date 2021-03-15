import React, { useState, useLayoutEffect, useRef } from "react";
import { createUseStyles } from "react-jss";

import carouselStyles from "../styles/CarouselStyles";

const useStyles = createUseStyles(carouselStyles);

const Carousel = ({
  children,
  crop = true,
  infinite = false,
  width = "400",
  height = width
}) => {
  const [origin, setOrigin] = useState(0);
  const [scrolling, toggleScrolling] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);
  const [curEl, setCurEl] = useState(0);
  const [realSize, setRealSize] = useState({
    width,
    height
  });
  const carousel = useRef();
  const carouselContent = infinite ? [...children, children[0]] : children;
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
    updateRealWidth();
    return () => window.removeEventListener("resize", updateRealWidth);
  }, []);

  useLayoutEffect(() => {
    const checkForOuterScrolling = e => {
      let curSize = carousel.current.getBoundingClientRect();
      if (
        e.clientX <= curSize.left ||
        e.clientX >= curSize.right ||
        e.clientY <= curSize.top ||
        e.clientY >= curSize.bottom
      )
        handleTouchEnd(e);
    };
    window.addEventListener("mousemove", checkForOuterScrolling);

    return () =>
      window.removeEventListener("mousemove", checkForOuterScrolling);
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

  const handleMouseMove = e => {
    if (
      !scrolling ||
      (origin - e.clientX < 0 && curEl == 0) ||
      (origin - e.clientX > 0 &&
        curEl == carouselContent.length - 1 &&
        !infinite)
    )
      return;

    setScrollPos(origin - e.clientX);
  };

  return (
    <div className={style.wrapper} ref={carousel}>
      <div
        className={style.carousel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleTouchEnd}
      >
        {carouselContent.map((el, i) => (
          <div
            key={i}
            className={style.block}
          >
            {React.cloneElement(el, {
              className: crop ? style.croppedStyle : style.fullStyle
            })}
          </div>
        ))}
      </div>
      <div className={style.select}>
        {children.map((el, i) => (
          <div
            key={i}
            className={
              i == curEl ? style.selectCircleSelected : style.selectCircle
            }
            onClick={() => i != curEl && setCurEl(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
