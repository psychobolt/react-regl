import { css } from 'styled-components';

export const container = css`
  position: fixed;
  top: 20px;
  left: 20px;
  opacity: 0.8;
  z-index: 10000;
  background-color: #000;
  padding: 7px;

  h1 {
    margin: 0px;
    font: bold 20px Helvetica, Arial, sans-serif;
    color: white;
  }
`;

export const stats = css`
  font: bold 10px Helvetica, Arial, sans-serif;
  color: white;
  padding-top: 6px;
`;
