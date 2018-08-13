import React from 'react';

import { storiesOf } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import { doc } from 'storybook-readme';

import Container from './Container';
import Canvas from './Canvas';
import Resizable from './Resizable';
import Readme from '../../README.md';

storiesOf('Setup', module)
  .add('Readme', doc(Readme))
  .add('Container', () => <Container />)
  .add('Canvas', () => <Canvas />)
  .add('Dynamic Container', withNotes('Drag the left or bottom handles to resize the canvas')(() => <Resizable />));
