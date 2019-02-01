import React from 'react';

import { storiesOf } from '@storybook/react';
import { doc, withReadme } from 'storybook-readme';

import Readme from 'packages/react-regl-orbit-camera/README.md';
import Camera, { README } from './Camera';

storiesOf('packages/react-regl-orbit-camera', module)
  .add('Readme', doc(Readme))
  .add('Camera', withReadme(README, () => <Camera />));
