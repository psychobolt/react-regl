import React from 'react';
import { ReglContainer } from '@psychobolt/react-regl';

import Resizable from './Resizable';

export default {
  title: 'Core/Setup',
  component: ReglContainer,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Container = require('./Container').default; // eslint-disable-line global-require

Container.parameters = {
  docs: {
    source: {
      code: require('!!raw-loader!./Container/Container.component').default, // eslint-disable-line global-require
    },
  },
};

export const DynamicContainer = () => <Resizable />;

DynamicContainer.parameters = {
  docs: {
    description: {
      story: 'Passing dynamic values such as width and height...',
    },
    source: {
      code: require('!!raw-loader!./Resizable/Resizable.component').default, // eslint-disable-line global-require
    },
  },
};
