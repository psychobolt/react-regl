import React from 'react';
import { storiesOf } from '@storybook/react';

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
import Cloth from './Cloth';
import CubeFBO from './CubeFBO';
import DDS from './DDS';
import DeferredShading from './DeferredShading';
import Envmap from './Envmap';
import Geomorph from './Geomorph';
import Graph from './Graph';
import ImplicitSurface from './ImplicitSurface';
import Line from './Line';

storiesOf('Examples', module)
  .add('Basic', () => <Basic />, {
    notes: 'This example is a simple demonstration of how to use regl to draw a triangle.',
  })
  .add('Batch', () => <Batch />, {
    notes: `
      This example demonstrates how to use batch mode commands.
  
      To use a command in batch mode, we pass in an array of objects. Then the command is executed once for each object in the array.
    `,
  })
  .add('Bunny', () => <Bunny />, {
    notes: 'This example shows how to draw a mesh with regl.',
  })
  .add('Camera', () => <Camera />, {
    notes: 'This example shows how to implement a movable camera with regl.',
  })
  .add('Cube', () => <Cube />, {
    notes: 'This examples renders a spinning textured cube.',
  })
  .add('Dynamic', () => <Dynamic />, {
    notes: 'This example shows how to pass props to draw commands.',
  })
  .add('Elements', () => <Elements />, {
    notes: 'This example demonstrates how you can use `elements` to draw lines.',
  })
  .add('Feedback', () => <Feedback />, {
    notes: 'This example shows how to use copyTexImage2D to implement feedback effects.',
  })
  .add('Instance Mesh', () => <InstanceMesh />, {
    notes: 'In this example, it is shown how you can draw a bunch of bunny meshes using the instancing feature of regl.',
  })
  .add('Instance Triangle', () => <InstanceTriangle />, {
    notes: 'In this example, it is shown how you can draw a bunch of triangles using the instancing feature of regl.',
  })
  .add('Life', () => <Life />, {
    notes: 'This example implements the game of life in regl.',
  })
  .add('Lighting', () => <Lighting />, {
    notes: 'This example shows how you can apply multiple light sources to a model',
  })
  .add('Line Primatives', () => <LinePrimitives />, {
    notes: 'This example demonstrates how to draw line loops and line strips.',
  })
  .add('Microphone', () => <Microphone />, {
    notes: 'This example shows how to create a simple audio visualization, using your microphone as input.',
  })
  .add('Minecraft', () => <Minecraft />, {
    notes: 'This example shows how you can implement a simple Minecraft renderer in regl.',
  })
  .add('Mipmap', () => <Mipamp />, {
    notes: 'This example shows how you can use mipmaps in regl.',
  })
  .add('Particles', () => <Particles />, {
    notes: 'This example show how you can render point particles in regl',
  })
  .add('Pong', () => <Pong />, {
    notes: `
      In this example, we implement a simple pong game.

      The demonstrated features are: batching, and how you can implement a game loop in regl.

      Note that the ball will probably go through the paddles once it goes very fast. So the game could abe a lot more stable.
      But in order to keep the example short and readab;e. we have refrained from fixing this.
    `,
  })
  .add('Scope', () => <Scope />, {
    notes: 'This example demonstrates scopes',
  })
  .add('Stats', () => <Stats />, {
    notes: 'The example demonstrates the regl-stats-widget, which provides a visual representation of the total GPU-time of draw-calls',
  })
  .add('Text', () => <Text />, {
    notes: 'This example shows how you can draw vectorized text in regl.',
  })
  .add('Texture', () => <Texture />, {
    notes: 'This example shows how you can load and draw a texture in regl.',
  })
  .add('Theta360', () => <Theta360 />, {
    notes: 'This example shows how to render a 360 panoramic environment map.',
  })
  .add('Tile', () => <Tile />, {
    notes: 'This example implements a simple 2D tiled sprite renderer.',
  })
  .add('Video', () => <Video />, {
    notes: 'This example shows how to overlay a chroma keyed video over a background rendered by regl.',
  })
  .add('Audio', () => <Audio />, {
    notes: 'This example shows how to implement an audio visualization, using an mp3-file as input.',
  })
  .add('Blur', () => <Blur />, {
    notes: `
      This examples demonstrate how we can render a height map, how to place out several models(using the batching feature),
      and how to implement a simple fullscreen post-process effect(using the framebuffer feature) in regl.

      The post-process effect is a simple box filter blur.
    `,
  })
  .add('Cloth', () => <Cloth />, {
    notes: {
      markdown: `
        In this example, we use the mass-spring model described by Thomas Jakobsen to implement a simple cloth simulation. It is also demonstrated how we can manage a dynamic mesh in regl.

        You can read more about cloth simulation [here](http://graphics.cs.cmu.edu/nsp/course/15-869/2006/papers/jakobsen.htm) and [here](http://gamedevelopment.tutsplus.com/tutorials/simulate-fabric-and-ragdolls-with-simple-verlet-integration--gamedev-519).
      `,
    },
  })
  .add('Cube FBO', () => <CubeFBO />, {
    notes: 'This example shows how you can render reflections using cubic framebuffers.',
  })
  .add('DDS', () => <DDS />, {
    notes: 'This example shows how you can parse dds files with resl.',
  })
  .add('Deferred Shading', () => <DeferredShading />, {
    notes: `
      This example is a simple implementation of deferred shading.

      The focus of this implementation was readability, so it is not an optimized implementation, and can certainly be made more efficient.
      (by for instance getting ride of the "position" render target. It can be computed from the depth buffer.)

      This example demonstrates the usage of Multiple-render targets in regl.
    `,
  })
  .add('Envmap', () => <Envmap />, {
    notes: `
      This example shows how you can render reflections with a environment map.
    `,
  })
  .add('Geomorph', () => <Geomorph />)
  .add('Graph', () => <Graph />)
  .add('Implicit Surface', () => <ImplicitSurface />, {
    notes: {
      markdown: `
        Implicit surface raytracing demo. Many ideas and pieces of code taken from [here](https://github.com/kevinrost/webglshaders/blob/master/distancefield1.html) and [here](http://www.iquilezles.org/www/articles/disfunctions/distfunctions.htm).
      `,
    },
  })
  .add('Line', () => <Line />, {
    notes: {
      markdown: `
        This example demonstrates rendering screen space projected lines from a technique described <a href="https://mattdesl.svbtle.com/drawing-lines-is-hard">here</a>.

        This technique requires each vertex to reference the previous and next vertex in the line; this example utilizes attribute byte offsets to share a single position buffer for all three of these attributes.
      `,
    },
  });
