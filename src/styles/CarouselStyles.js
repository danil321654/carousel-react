export default {
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

  block: {
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
  },
  croppedStyle: {
    objectFit: "cover",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    userSelect: "none"
  },
  fullStyle: {
    objectFit: "cover",
    width: "auto",
    maxWidth: "100%",
    height: "auto",
    maxHeight: "100%",
    pointerEvents: "none",
    userSelect: "none"
  }
};
