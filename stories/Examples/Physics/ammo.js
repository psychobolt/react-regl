import { btTransform as BtTransform } from 'ammonext';
import mat4 from 'gl-mat4';

// need to make sure that all classes start with a big letter, to avoid standardJs errors.
export {
  btVector3 as BtVector3,
  btCollisionDispatcher as BtCollisionDispatcher,
  btDefaultCollisionConfiguration as BtDefaultCollisionConfiguration,
  btDbvtBroadphase as BtDbvtBroadphase,
  btSequentialImpulseConstraintSolver as BtSequentialImpulseConstraintSolver,
  btDiscreteDynamicsWorld as BtDiscreteDynamicsWorld,
  btStaticPlaneShape as BtStaticPlaneShape,
  btDefaultMotionState as BtDefaultMotionState,
  btTransform as BtTransform,
  btQuaternion as BtQuaternion,
  btRigidBody as BtRigidBody,
  btRigidBodyConstructionInfo as BtRigidBodyConstructionInfo,
  btBoxShape as BtBoxShape,
  btSphereShape as BtSphereShape,
} from 'ammonext';

// extracts the model matrix from a rigid body.
export function getModelMatrix(rb) {
  const transformTemp = new BtTransform();
  const ms = rb.getMotionState();
  if (ms) {
    ms.getWorldTransform(transformTemp);
    const p = transformTemp.getOrigin();
    const q = transformTemp.getRotation();
    return mat4.fromRotationTranslation(
      [], [q.x(), q.y(), q.z(), q.w()], [p.x(), p.y(), p.z()],
    );
  }
  return null;
}
