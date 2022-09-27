import { ImageFiltering, ImageSource } from "excalibur";

//ImagesURL
import titleURL from "../assets/title.jpeg";
import btnBackgroundURL from "../assets/button.png";
import btnHoverURL from "../assets/button.png";

//Resources
const Resources: { [id: string]: ImageSource } = {
  titleBackground: new ImageSource(titleURL, false, ImageFiltering.Pixel),
  BtnBackground: new ImageSource(btnBackgroundURL, false, ImageFiltering.Pixel),
  BtnHovered: new ImageSource(btnHoverURL, false, ImageFiltering.Pixel),
};

export default Resources;
