import React from 'react';
import { storiesOf } from '@storybook/react';

import Basic from './Basic';
import Batch from './Batch';
import Bunny from './Bunny';
import Camera from './Camera';

storiesOf('Examples', module)
  .add('Basic', () => <Basic />)
  .add('Batch', () => <Batch />)
  .add('Bunny', () => <Bunny />)
  .add('Camera', () => <Camera />);
