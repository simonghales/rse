import {css} from "styled-components";
import {THEME} from "./theme";

export const modalClassnames = {
    base: '_modal',
    overlay: '_modalOverlay',
}

export const cssModal = css`

    .${modalClassnames.base} {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .${modalClassnames.overlay} {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,0.25);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: ${THEME.zIndices.modal};
    }
    
`
