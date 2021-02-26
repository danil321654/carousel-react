import React from "react";
import Carousel from "./components/Carousel";
import {createUseStyles} from "react-jss";

const useStyles = createUseStyles({
  item: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  }
});

const App = () => {
  const style = useStyles();
  return (
    <div className={style.item}>
      <Carousel crop={true}
        content={[
          `<div >hello</div>`,
          `<video>
              <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4" />
            </video>`,
          `<img src="https://leesburgvetblog.files.wordpress.com/2014/02/tri-color-guinea-pig.jpg" alt="альтернативный текст"/>`,
          `<img src="https://images.wallpaperscraft.ru/image/fotoapparat_pirs_pesok_128809_1350x2400.jpg" alt="альтернативный текст"/>`
        ]}
      />
    </div>
  );
};

export default App;
