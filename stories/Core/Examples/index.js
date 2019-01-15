import React from 'react';
import { storiesOf } from '@storybook/react';
import { withReadme } from 'storybook-readme';
import path from 'path';

const reqExample = require.context('./', true, /^\.\/[a-zA-Z0-9]*\/$/);

const category = storiesOf('Core/Examples', module);

reqExample.keys().forEach(folder => {
  const example = path.resolve('./', folder);
  const name = /\/(.+)/.exec(example)[1];
  const { default: Component, README } = require(`.${example}`); // eslint-disable-line global-require, import/no-dynamic-require
  const render = () => <Component />;
  category.add(name, README ? withReadme(README, render) : render);
});
