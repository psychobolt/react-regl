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
  .add('Microphone', withNotes('This example shows how to create a simple audio visualization, using your microphone as input.')(() => <Microphone />));
