import { css } from 'styled-components';

export const container = css`
  width: 500px;
  height: 500px;
  background-color: ${({ color }) => color};
  margin: 100px;
`;
