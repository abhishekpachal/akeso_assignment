import { Slide, toast } from "react-toastify";

const DURATION = 2000;
const CONFIG = {
  position: "top-right",
  autoClose: DURATION,
  transition: Slide,
};
class Toast {
  static success(message) {
    if (message) toast.success(message, CONFIG);
  }

  static error(message) {
    if (message) toast.error(message, CONFIG);
  }

  static info(message) {
    if (message) toast.info(message, CONFIG);
  }

  static warn(message) {
    if (message) toast.warn(message, CONFIG);
  }
}

export default Toast;
