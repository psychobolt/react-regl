// @flow
import * as React from 'react';
import mat4 from 'gl-mat4';
import vec3 from 'gl-vec3';
import sphere from 'primitive-sphere';

import { BtSphereShape, BtDefaultMotionState, BtTransform, BtQuaternion, BtVector3, BtRigidBodyConstructionInfo, BtRigidBody } from '../ammo';
import Normal from '../Normal';
import Mesh from '../Mesh';

const POWER = 80.0;
const color = [1.0, 1.0, 1.0];

type Props = {
  canvas: HTMLCanvasElement,
  projectionMatrix: Float32Array,
  viewMatrix: Float32Array,
  physicsWorld: any,
  mousePosition: number[]
};

type State = {
  mounted: boolean
}

export default class Sphere extends React.Component<Props, State> {
  mesh: typeof sphere;

  rigidBody: number[];

  constructor(props: Props) {
    super(props);
    this.mesh = sphere(1.0, { segments: 16 });
    this.state = {
      mounted: false,
    };
  }

  componentDidMount() {
    const { canvas, projectionMatrix, viewMatrix, physicsWorld, mousePosition: mp } = this.props;

    /*
      First, we need a ray from the camera.
      Because we need a shooting position, and a shooting direction.
    */
    const vp = mat4.multiply([], projectionMatrix, viewMatrix);
    const invVp = mat4.invert([], vp);

    // get a single point on the camera ray.
    const rayPoint = vec3.transformMat4(
      [],
      [2.0 * mp[0] / canvas.width - 1.0, -2.0 * mp[1] / canvas.height + 1.0, 0.0],
      invVp,
    );

    // get the position of the camera.
    const rayOrigin = vec3.transformMat4([], [0, 0, 0], mat4.invert([], viewMatrix));

    const rayDir = vec3.normalize([], vec3.subtract([], rayPoint, rayOrigin));

    // we release the ball a bit in the front of the camera.
    vec3.scaleAndAdd(rayOrigin, rayOrigin, rayDir, 4.4);

    /*
      Then, create the rigid body.
    */
    const mass = 1.0;
    const shape = new BtSphereShape(1);
    shape.setMargin(0.05);

    const motionState = new BtDefaultMotionState(new BtTransform(
      new BtQuaternion(0, 0, 0, 1),
      new BtVector3(rayOrigin[0], rayOrigin[1], rayOrigin[2]),
    ));

    const localInertia = new BtVector3(0, 0, 0);
    shape.calculateLocalInertia(mass, localInertia);

    const ci = new BtRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
    const rigidBody = new BtRigidBody(ci);
    physicsWorld.addRigidBody(rigidBody);

    /*
      Now send the rigid body flying!
    */
    rigidBody.applyImpulse(
      new BtVector3(POWER * rayDir[0], POWER * rayDir[1], POWER * rayDir[2]),
      new BtVector3(rayOrigin[0], rayOrigin[1], rayOrigin[2]),
    );

    this.rigidBody = rigidBody;
    this.setState({ mounted: true });
  }

  render() {
    const { mesh, rigidBody, state } = this;
    const { mounted } = state;
    return mounted
      ? (
        <Normal>
          <Mesh
            elements={mesh.cells}
            position={mesh.positions}
            normal={mesh.normals}
            color={color}
            rigidBody={rigidBody}
          />
        </Normal>
      )
      : null;
  }
}
