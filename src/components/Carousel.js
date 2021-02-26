import React, {useState, useLayoutEffect, useRef} from "react";
import {createUseStyles} from "react-jss";

const useStyles = createUseStyles({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  carousel: {
    height: props =>
      `${+props.height % 2 == 0 ? +props.height + 1 : props.height}px`,
    width: props =>
      `${+props.width % 2 == 0 ? +props.width + 1 : props.width}px`,

    maxWidth: "80vw",
    maxHeight: "80vw",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    boxSizing: "border-box",
    border: "1px solid black",
    overflowX: "hidden"
  },

  selectedBlock: {
    marginLeft: props => `-${props.scrollPos}px`,
    marginRight: props => `${props.scrollPos}px`,
    transition: props => (props.scrolling ? "none" : "margin .3s ease-out"),
    height: "100%",
    minWidth: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    boxSizing: "border-box",
    alignItems: "center",
    overflowX: "hidden",
    overflowY: "hidden"
  },
  block: {
    marginLeft: props => `-${props.scrollPos}px`,
    marginRight: props => `${props.scrollPos}px`,
    transition: props => (props.scrolling ? "none" : "margin .3s ease-out"),
    height: "100%",
    minWidth: "100%",
    display: props => (props.scrolling ? "flex" : "none"),
    flexDirection: "column",
    justifyContent: "center",
    boxSizing: "border-box",
    alignItems: "center",
    overflowX: "hidden",
    overflowY: "hidden",
    clip: "rect(auto, auto, auto, auto)"
  },
  select: {
    width: "5vh",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "5px"
  },
  selectCircle: {
    borderRadius: "50%",
    border: "1px solid black",
    width: "10px",
    height: "10px",
    boxSizing: "border-box"
  },
  selectCircleSelected: {
    borderRadius: "50%",
    border: "1px solid black",
    width: "10px",
    height: "10px",
    backgroundColor: "black",
    boxSizing: "border-box"
  }
});

const Carousel = ({
  content,
  crop = false,
  infinite = false,
  autoplay = true,
  width = "400",
  height = "400",
  styles = {}
}) => {
  const [origin, setOrigin] = useState(0);
  const [scrolling, toggleScrolling] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);
  const [curEl, setCurEl] = useState(0);
  const [realSize, setRealSize] = useState({width});
  const carousel = useRef();

  let innerContent = content.map(el => {
    return {
      __html: el.replace(
        /<[^\/> ]*[^ >\/]/gm,
        crop
          ? `$& style="object-fit: cover; min-width: 100%; min-height: 100%; max-height: 100%;"`
          : `$& style="object-fit: cover; width: auto; max-width: 100%; height: auto; max-height: 100%;"`
      )
    };
  });

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
    console.log(carousel.current.getBoundingClientRect());
    return () => window.removeEventListener("resize", updateRealWidth);
  }, []);

  const handleMouseDown = e => {
    console.log(e.changedTouches[0].clientX);
    toggleScrolling(true);
    setOrigin(scrollPos + e.changedTouches["0"].clientX);
  };

  const handleMouseMove = e => {
    if (
      !scrolling ||
      (origin - e.changedTouches["0"].clientX < 0 && curEl == 0)
    ) {
      return;
    }
    console.log(e.changedTouches["0"].clientX, curEl);
    console.log(e.changedTouches["0"].clientX);
    setScrollPos(origin - e.changedTouches["0"].clientX);
  };

  const handleMouseUp = e => {
    toggleScrolling(false);

    if (scrollPos > 0.3 * realSize.width) setCurEl(curEl + 1);
    else if (-scrollPos >= 0.3 * realSize.width && curEl != 0)
      setCurEl(curEl - 1);
    else if (origin <= +realSize.x + realSize.width * 0.2 && curEl != 0) setCurEl(curEl - 1);
    else if (origin >= +realSize.x + realSize.width * 0.8) setCurEl(curEl + 1);

    console.log(scrollPos, origin);
    console.log(realSize);
    setOrigin(0);
    setScrollPos(0);
  };

  return (
    <div className={style.wrapper} ref={carousel}>
      <div
        className={style.carousel}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        {innerContent.map((el, i) => (
          <div className={style.selectedBlock} dangerouslySetInnerHTML={el} />
        ))}
      </div>
      <div className={style.select}>
        {[...Array(content.length).keys()].map(el => (
          <div
            className={
              el == curEl ? style.selectCircleSelected : style.selectCircle
            }
            onClick={() => el != curEl && setCurEl(el)}
          />
        ))}
      </div>{" "}
    </div>
  );
};

export default Carousel;
