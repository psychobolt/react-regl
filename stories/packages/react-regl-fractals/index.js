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
    degree: 0,
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
  };
  story.parameters = {
    docs: {
      page: MDX.default,
    },
  };
  module.exports[name] = story;
});
