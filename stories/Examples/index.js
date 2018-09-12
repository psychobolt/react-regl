import React from 'react';
import { storiesOf } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';

import Basic from './Basic';
import Batch from './Batch';
import Bunny from './Bunny';
import Camera from './Camera';
import Cube from './Cube';
import Dynamic from './Dynamic';
import Elements from './Elements';
import Feedback from './Feedback';
import InstanceMesh from './InstanceMesh';
import InstanceTriangle from './InstanceTriangle';
import Life from './Life';
import Lighting from './Lighting';
import LinePrimitives from './LinePrimitives';
import Microphone from './Microphone';
import Minecraft from './Minecraft';
import Mipamp from './Mipmap';
import Particles from './Particles';
import Pong from './Pong';
import Scope from './Scope';
import Stats from './Stats';
import Text from './Text';
import Texture from './Texture';
import Theta360 from './Theta360';
import Tile from './Tile';
import Video from './Video';
import Audio from './Audio';
import Blur from './Blur';

storiesOf('Examples', module)
  .add('Basic', withNotes('This example is a simple demonstration of how to use regl to draw a triangle.')(() => <Basic />))
  .add('Batch', withNotes(
    `
    This example demonstrates how to use batch mode commands.

    To use a command in batch mode, we pass in an array of objects. Then the command is executed once for each object in the array.
    `,
  )(() => <Batch />))
  .add('Bunny', withNotes('This example shows how to draw a mesh with regl.')(() => <Bunny />))
  .add('Camera', withNotes('This example shows how to implement a movable camera with regl.')(() => <Camera />))
  .add('Cube', withNotes('This examples renders a spinning textured cube.')(() => <Cube />))
  .add('Dynamic', withNotes('This example shows how to pass props to draw commands.')(() => <Dynamic />))
  .add('Elements', withNotes('This example demonstrates how you can use `elements` to draw lines.')(() => <Elements />))
  .add('Feedback', withNotes('This example shows how to use copyTexImage2D to implement feedback effects.')(() => <Feedback />))
  .add('Instance Mesh', withNotes('In this example, it is shown how you can draw a bunch of bunny meshes using the instancing feature of regl.')(() => <InstanceMesh />))
  .add('Instance Triangle', withNotes('In this example, it is shown how you can draw a bunch of triangles using the instancing feature of regl.')(() => <InstanceTriangle />))
  .add('Life', withNotes('This example implements the game of life in regl.')(() => <Life />))
  .add('Lighting', withNotes('This example shows how you can apply multiple light sources to a model')(() => <Lighting />))
  .add('Line Primatives', withNotes('This example demonstrates how to draw line loops and line strips.')(() => <LinePrimitives />))
  .add('Microphone', withNotes('This example shows how to create a simple audio visualization, using your microphone as input.')(() => <Microphone />))
  .add('Minecraft', withNotes('This example shows how you can implement a simple Minecraft renderer in regl.')(() => <Minecraft />))
  .add('Mipmap', withNotes('This example shows how you can use mipmaps in regl.')(() => <Mipamp />))
  .add('Particles', withNotes('This example show how you can render point particles in regl')(() => <Particles />))
  .add('Pong', withNotes(`
    In this example, we implement a simple pong game.

    The demonstrated features are: batching, and how you can implement a game loop in regl.

    Note that the ball will probably go through the paddles once it goes very fast. So the game could abe a lot more stable.
    But in order to keep the example short and readab;e. we have refrained from fixing this.
  `)(() => <Pong />))
  .add('Scope', withNotes('This example demonstrates scopes')(() => <Scope />))
  .add('Stats', withNotes('The example demonstrates the regl-stats-widget, which provides a visual representation of the total GPU-time of draw-calls')(() => <Stats />))
  .add('Text', withNotes('This example shows how you can draw vectorized text in regl.')(() => <Text />))
  .add('Texture', withNotes('This example shows how you can load and draw a texture in regl.')(() => <Texture />))
  .add('Theta360', withNotes('This example shows how to render a 360 panoramic environment map.')(() => <Theta360 />))
  .add('Tile', withNotes('This example implements a simple 2D tiled sprite renderer.')(() => <Tile />))
  .add('Video', withNotes('This example shows how to overlay a chroma keyed video over a background rendered by regl.')(() => <Video />))
  .add('Audio', withNotes('This example shows how to implement an audio visualization, using an mp3-file as input.')(() => <Audio />))
  .add('Blur', withNotes(`
    This examples demonstrate how we can render a height map, how to place out several models(using the batching feature),
    and how to implement a simple fullscreen post-process effect(using the framebuffer feature) in regl.

    The post-process effect is a simple box filter blur.
  `)(() => <Blur />));
