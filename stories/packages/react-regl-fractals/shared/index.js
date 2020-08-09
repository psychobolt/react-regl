import React from 'react';
import { number } from '@storybook/addon-knobs';

export const withKnobs = Component => (
  <Component
    degree={number('degree', 0, {
      range: true,
      min: 0,
      max: 8,
      step: 1,
    })}
  />
);
