// @flow
import * as React from 'react';

import { BtBoxShape, BtDefaultMotionState, BtTransform, BtQuaternion, BtVector3, BtRigidBodyConstructionInfo, BtRigidBody, getModelMatrix } from '../../ammo';
import Normal from '../../Normal';
import Mesh from '../../Mesh';

const position = [
  // side faces
  // positive z face.
  [-0.5, +0.5, +0.5],
  [+0.5, +0.5, +0.5],
  [+0.5, -0.5, +0.5],
  [-0.5, -0.5, +0.5],
  // positive x face
  [+0.5, +0.5, +0.5],
  [+0.5, +0.5, -0.5],
  [+0.5, -0.5, -0.5],
  [+0.5, -0.5, +0.5],
  // negative z face
  [+0.5, +0.5, -0.5],
  [-0.5, +0.5, -0.5],
  [-0.5, -0.5, -0.5],
  [+0.5, -0.5, -0.5],
  // negative x face.
  [-0.5, +0.5, -0.5],
  [-0.5, +0.5, +0.5],
  [-0.5, -0.5, +0.5],
  [-0.5, -0.5, -0.5],
  // top face
  [-0.5, +0.5, -0.5],
  [+0.5, +0.5, -0.5],
  [+0.5, +0.5, +0.5],
  [-0.5, +0.5, +0.5],
  // bottom face
  [-0.5, -0.5, -0.5],
  [+0.5, -0.5, -0.5],
  [+0.5, -0.5, +0.5],
  [-0.5, -0.5, +0.5],
];

const elements = [
  [2, 1, 0], [2, 0, 3],
  [6, 5, 4], [6, 4, 7],
  [10, 9, 8], [10, 8, 11],
  [14, 13, 12], [14, 12, 15],
  [18, 17, 16], [18, 16, 19],
  [20, 21, 22], [23, 20, 22],
];

// all the normals of a single block.
const normal = [
  // side faces
  [0.0, 0.0, +1.0], [0.0, 0.0, +1.0], [0.0, 0.0, +1.0], [0.0, 0.0, +1.0],
  [+1.0, 0.0, 0.0], [+1.0, 0.0, 0.0], [+1.0, 0.0, 0.0], [+1.0, 0.0, 0.0],
  [0.0, 0.0, -1.0], [0.0, 0.0, -1.0], [0.0, 0.0, -1.0], [0.0, 0.0, -1.0],
  [-1.0, 0.0, 0.0], [-1.0, 0.0, 0.0], [-1.0, 0.0, 0.0], [-1.0, 0.0, 0.0],
  // top
  [0.0, +1.0, 0.0], [0.0, +1.0, 0.0], [0.0, +1.0, 0.0], [0.0, +1.0, 0.0],
  // bottom
  [0.0, -1.0, 0.0], [0.0, -1.0, 0.0], [0.0, -1.0, 0.0], [0.0, -1.0, 0.0],
];

type Props = {
  color: number[],
  position: number[],
  size: number[],
  physicsWorld: any,
};

type State = {
  position: number[][],
  mounted: boolean,
};

export default class Box extends React.Component<Props, State> {
  model = null;

  constructor(props: Props) {
    super(props);
    const { size: s } = this.props;
    this.state = {
      position: position.map(p => [
        p[0] * s[0],
        p[1] * s[1],
        p[2] * s[2],
      ]),
      mounted: false,
    };
  }

  componentDidMount() {
    const { size: s } = this.props;
    const mass = 1.0;
    const shape = new BtBoxShape(new BtVector3(s[0] * 0.5, s[1] * 0.5, s[2] * 0.5));
    shape.setMargin(0.05);

    const { position: p, physicsWorld } = this.props;
    const motionState = new BtDefaultMotionState(
      new BtTransform(new BtQuaternion(0, 0, 0, 1), new BtVector3(p[0], p[1], p[2])),
    );

    const localInertia = new BtVector3(0, 0, 0);
    shape.calculateLocalInertia(mass, localInertia);

    const ci = new BtRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
    const rigidBody = new BtRigidBody(ci);
    physicsWorld.addRigidBody(rigidBody);
    this.model = getModelMatrix(rigidBody);
    this.setState({ mounted: true });
  }

  render() {
    const { color } = this.props;
    const { position: p, mounted } = this.state;
    return mounted
      ? (
        <Normal>
          <Mesh elements={elements} position={p} normal={normal} color={color} model={this.model} />
        </Normal>
      )
      : null;
  }
}
