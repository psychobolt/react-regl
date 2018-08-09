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
  .add('Instance Mesh', withNotes('In this example, it is shown how you can draw a bunch of bunny meshes using the instancing feature of regl.')(() => <InstanceMesh />));
