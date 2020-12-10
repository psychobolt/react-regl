import React from 'react';

const reqExample = require.context('./', true, /^\.\/[\w-]+\/index\.js$/);

export default {
  title: 'packages/react-regl-fractals',
  parameters: {
    layout: 'fullscreen',
  },
};

reqExample.keys().forEach(folder => {
  const name = folder.match(/^\.\/([\w-]+)\/index\.js$/)[1];
  const { default: Component, MDX } = reqExample(folder);
  const story = args => <Component {...args} />;
  story.args = {
    color: 'rgba(0,0,0,1)',
    lineColor: 'rgba(0,0,0,1)',
    degree: 0,
    outline: false,
    lineWidth: 1.0,
  };
  story.argTypes = {
    degree: {
      control: {
        type: 'range',
        min: 0,
        max: 8,
        step: 1,
      },
    },
    color: { control: 'color' },
    lineColor: { control: 'color' },
  };
  story.parameters = {
    docs: {
      page: MDX.default,
    },
  };
  module.exports[name] = story;
});
