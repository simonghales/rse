import {css} from "styled-components";

export const THEME = {
    spacing: {
        $0b: 2,
        $1: 4,
        $1b: 4,
        $2: 8,
    },
    colors: {
        active: '#441cb3',
        purple: '#8b00ff',
        light: '#e0c3e6',
        nearWhite: '#ece0ee',
        white: '#ffffff',
        dark: '#18171a',
        black: '#000000',
        faint: '#55567d',
    },
    fontSizes: {
      small: 12,
      smallPlus: 14,
      medium: 16,
    },
    zIndices: {
        overlay: 99999,
        modal: 999999,
    }
}

export const cssDarkTheme = css`
  background-color: ${THEME.colors.dark};
  color: ${THEME.colors.nearWhite};
`
