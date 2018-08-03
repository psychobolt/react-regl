import React from 'react';

import { storiesOf } from '@storybook/react';
import { doc } from 'storybook-readme';

import Container from './Container';
import Canvas from './Canvas';
import Readme from '../../README.md';

storiesOf('Setup', module)
  .add('Readme', doc(Readme))
  .add('Container Div', () => <Container />)
  .add('Canvas', () => <Canvas />);
