/* eslint-disable */
import React from 'react';
import createStatsWidget from 'regl-stats-widget';
import attachCamera from 'canvas-orbit-camera';
import mat4 from 'gl-mat4';
import normals from 'angle-normals';
import bunny from 'bunny';

import { Drawable } from 'src';
import ReglContainer from 'stories/Setup/Resizable';

const contextProps = {
  extensions: 'EXT_disjoint_timer_query',
  profile: true,
};

let camera;

const onMount = ({ view }) => {
  camera = attachCamera(view);
};

export default () => (
  <ReglContainer onMount={onMount} contextProps={contextProps}>
  </ReglContainer>
);
