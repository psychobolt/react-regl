import React from 'react';
import { Frame, Drawable, Context } from '@psychobolt/react-regl';
import ReglContainer from 'stories/Core/Setup/Resizable';
import mat4 from 'gl-mat4';
import mousePosition from 'mouse-position';
import mousePressed from 'mouse-pressed';

import { BtVector3, BtDefaultCollisionConfiguration, BtCollisionDispatcher, BtDbvtBroadphase, BtSequentialImpulseConstraintSolver, BtDiscreteDynamicsWorld } from './ammo';
import Plane from './Plane';
import Wall from './Wall';
import Sphere from './Sphere';

const viewMatrix = new Float32Array(16);
const projectionMatrix = new Float32Array(16);

const uniforms = {
  lightDir: [0.92, 0.3, 0.2],
  projection: ({ viewportWidth, viewportHeight }) => mat4
    .perspective(projectionMatrix, Math.PI / 4, viewportWidth / viewportHeight, 0.01, 1000.0),
  view: () => {
    const s = 0.8;
    return mat4.lookAt(
      viewMatrix,
      [50 * s, 9.5, 30 * s],
      [0, 2.5, 0],
      [0, 1, 0],
    );
  },
};

// setup physics world.
const collisionConfiguration = new BtDefaultCollisionConfiguration();
const dispatcher = new BtCollisionDispatcher(collisionConfiguration);
const broadphase = new BtDbvtBroadphase();
const solver = new BtSequentialImpulseConstraintSolver();
const physicsWorld = new BtDiscreteDynamicsWorld(
  dispatcher,
  broadphase,
  solver,
  collisionConfiguration,
);
physicsWorld.setGravity(new BtVector3(0, -6.0, 0));

const planeColor = [0.8, 0.8, 0.8];

export default class Physics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spheres: 0,
    };
  }

  onMount = ({ view }) => {
    this.mp = mousePosition(view);
    const mb = mousePressed(view);
    mb.on('down', () => this.setState(({ spheres }) => ({
      spheres: spheres + 1,
    })));
  }

  onFrame = ({ regl }) => {
    regl.clear({
      color: [0, 0, 0, 255],
      depth: 1,
    });

    // step simulation
    physicsWorld.stepSimulation(1.0 / 60.0, 10);
  }

  render() {
    return (
      <ReglContainer onMount={this.onMount}>
        <Frame onFrame={this.onFrame}>
          <Drawable uniforms={uniforms}>
            <Plane color={planeColor} physicsWorld={physicsWorld} />
            <Wall physicsWorld={physicsWorld} />
            <Context.Consumer>
              {({ context }) => {
                const { spheres } = this.state;
                const balls = [];
                for (let i = 1; i <= spheres; i += 1) {
                  balls.push(
                    <Sphere
                      key={`sphere_${i}`}
                      canvas={context.view}
                      projectionMatrix={projectionMatrix}
                      viewMatrix={viewMatrix}
                      physicsWorld={physicsWorld}
                      mousePosition={this.mp}
                    />,
                  );
                }
                return balls;
              }}
            </Context.Consumer>
          </Drawable>
        </Frame>
      </ReglContainer>
    );
  }
}
