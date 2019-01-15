import React from 'react';

import { storiesOf } from '@storybook/react';
import { doc } from 'storybook-readme';

import Readme from 'packages/react-multi-regl/README.md';
import Simple from './Simple';
import SPHGallery from './SPHGallery';

storiesOf('packages/react-multi-regl', module)
  .add('Readme', doc(Readme))
  .add('Simple', () => <Simple />)
  .add('SPH Gallery', () => <SPHGallery />);
