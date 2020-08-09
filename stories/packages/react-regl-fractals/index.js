import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { doc } from 'storybook-readme';

import Readme from 'packages/react-regl-fractals/README.md';

import Pyramid from './Pyramid';

storiesOf('packages/react-regl-fractals', module)
  .add('Readme', doc(Readme));

storiesOf('packages/react-regl-fractals/Pyramid', module)
  .addDecorator(withKnobs)
  .add('2D', () => <Pyramid />);
