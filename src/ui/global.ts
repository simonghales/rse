import {createGlobalStyle} from "styled-components";
import reset from "styled-reset"
import {cssModal} from "./modal";

export const GlobalStyle = createGlobalStyle`
  ${reset};

  * {
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Lato', sans-serif;
    font-size: 13px;
  }

  .selectBox {
    border: 1px solid #55aaff;
    background-color: rgba(75, 160, 255, 0.3);
    position: fixed;
  }
  
  ${cssModal};
  
`
