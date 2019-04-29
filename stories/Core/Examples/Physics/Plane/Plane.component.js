// @flow
import * as React from 'react';

import Normal from '../Normal';
import Mesh from '../Mesh';
import { type BtDiscreteDynamicsWorld, BtVector3, BtStaticPlaneShape, BtDefaultMotionState, BtTransform, BtQuaternion, BtRigidBodyConstructionInfo, BtRigidBody } from '../ammo';

const A = 1000.0; // plane size.

const elements = [
  [3, 1, 0],
  [0, 2, 3],
];

const position = [
  [-0.5 * A, 0.0, -0.5 * A],
  [0.5 * A, 0.0, -0.5 * A],
  [-0.5 * A, 0.0, 0.5 * A],
  [0.5 * A, 0.0, 0.5 * A],
];

const normal = [
  [0.0, 1.0, 0.0],
  [0.0, 1.0, 0.0],
  [0.0, 1.0, 0.0],
  [0.0, 1.0, 0.0],
];

type Props = {
  color: number[],
  physicsWorld: BtDiscreteDynamicsWorld,
};

type State = {
  mounted: boolean,
}

export default class Plane extends React.Component<Props, State> {
  state = {
    mounted: false,
  }

  model = null;

  componentDidMount() {
    const shape = new BtStaticPlaneShape(new BtVector3(0, 1, 0), 0);
    shape.setMargin(0.05);

    const motionState = new BtDefaultMotionState(
      new BtTransform(new BtQuaternion(0, 0, 0, 1), new BtVector3(0, 0, 0)),
    );
    const ci = new BtRigidBodyConstructionInfo(0, motionState, shape, new BtVector3(0, 0, 0));
    const rigidBody = new BtRigidBody(ci);
    const { physicsWorld } = this.props;
    physicsWorld.addRigidBody(rigidBody);
    this.rigidBody = rigidBody;
    this.setState({ mounted: true });
  }

  rigidBody: {}

  render() {
    const { color } = this.props;
    const { mounted } = this.state;
    return mounted
      ? (
        <Normal>
          <Mesh
            elements={elements}
            position={position}
            normal={normal}
            color={color}
            rigidBody={this.rigidBody}
          />
        </Normal>
      )
      : null;
  }
}
