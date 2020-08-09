import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { doc, withReadme } from 'storybook-readme';
import path from 'path';

import Readme from 'packages/react-regl-fractals/README.md';

const reqExample = require.context('./', true, /^\.\/[a-zA-Z0-9]*\/$/);

const category = storiesOf('packages/react-regl-fractals', module)
  .add('Readme', doc(Readme))
  .addDecorator(withKnobs);

reqExample.keys().forEach(folder => {
  const example = path.resolve('./', folder);
  const name = /\/(.+)/.exec(example)[1];
  if (name === 'shared') return;
  const { default: Component, README } = require(`.${example}`); // eslint-disable-line global-require, import/no-dynamic-require
  const render = () => <Component />;
  category.add(name, README ? withReadme(README, render) : render);
});
