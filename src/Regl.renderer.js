import Reconciler from 'react-reconciler';
import invariant from 'fbjs/lib/invariant';

import TYPES from './Regl.types';
import { diffProps, updateProps } from './Regl.component';

export function getTypes(instanceFactory) {
  return (type, { children, ...rest }, container) => {
    const TYPE = instanceFactory[type];
    return TYPE && TYPE(rest, container, children);
  };
}

const createInstance = getTypes(TYPES);

/* eslint-disable no-unused-vars */

const defaultHostConfig = {
  getRootHostContext(rootHostContext) {
    return rootHostContext;
  },
  getChildHostContext(parentHostContext, type, instance) {
    return parentHostContext;
  },
  getPublicInstance(instance) {
    return instance;
  },
  createInstance,
  appendInitialChild(parent, child) {
    parent.addChild(child);
  },
  finalizeInitialChildren(instance, type, props) {
    return true;
  },
  prepareUpdate(instance, type, oldProps, newProps, container, hostContext) {
    return diffProps(oldProps, newProps);
  },
  shouldSetTextContent(type, props) {
    return false;
  },
  shouldDeprioritizeSubtree(type, props) {
    return false;
  },
  createTextInstance(text, container, hostContext, internalInstanceHandle) {
    return text;
  },
  scheduleDeferredCallback: window.requestIdleCallback,
  prepareForCommit() {
  },
  resetAfterCommit() {
  },
  now: Date.now,
  supportsMutation: true,
  commitUpdate(instance, updatePayload, type, oldProps, newProps, internalInstanceHandle) {
    updateProps(instance, updatePayload);
  },
  commitMount(instance, type, newProps, internalInstanceHandle) {
  },
  commitTextUpdate(instance, type, newProps, internalInstanceHandle) {
  },
  resetTextContent(instance) {
  },
  appendChild(parent, child) {
    parent.addChild(child);
  },
  appendChildToContainer(container, child) {
    container.addChild(child);
  },
  insertBefore(parent, child, beforeChild) {
    parent.insertBefore(child, beforeChild);
  },
  insertInContainerBefore(container, child, beforeChild) {
    invariant(false, 'insertInContainerBefore is NOOP. Make sure you implement it.');
  },
  removeChild(parent, child) {
    invariant(false, 'removeChild is NOOP. Make sure you implement it.');
  },
  removeChildFromContainer(container, child) {
    container.removeChild(child);
  },
};

/* eslint-enable no-unused-vars */

export default class ReglRenderer {
  defaultHostConfig = defaultHostConfig;

  defaultTypes = TYPES;

  constructor() {
    const instanceFactory = this.getInstanceFactory();
    let hostConfig = this.getHostConfig();
    if (this.defaultTypes !== instanceFactory) {
      this.createInstance = getTypes(instanceFactory);
      hostConfig = {
        ...hostConfig,
        createInstance: this.createInstance,
      };
    } else {
      this.createInstance = createInstance;
    }
    this.reconciler = Reconciler(hostConfig);
  }

  getInstanceFactory() {
    return this.defaultTypes;
  }

  getHostConfig() {
    return this.defaultHostConfig;
  }
}
