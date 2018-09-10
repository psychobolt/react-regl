import _ from 'lodash';
import invariant from 'fbjs/lib/invariant';

import { Frame, Drawable } from './types';

function indexProps(dictionary, props) {
  Object.entries(props).forEach(([key, value]) => {
    if (key === 'children') return;
    const values = dictionary[key];
    if (values) {
      values.push(value);
    } else {
      Object.assign(dictionary, { [key]: [value] });
    }
  });
}

export function diffProps(oldProps, newProps) {
  const updatePayload = []; // schema: [propKey1, value2, propKey2, value2, ...]
  const propChanges = {}; // schema: { propKey1: [oldValue1, newValue1], ... }
  indexProps(propChanges, oldProps);
  indexProps(propChanges, newProps);
  Object.entries(propChanges).forEach(([key, values]) => {
    if (values.length === 1) {
      if (key in newProps) {
        const [value] = values;
        updatePayload.push(key, value);
      } else {
        updatePayload.push(key, null);
      }
    } else if (values.length === 2) {
      const [preValue, nextValue] = values;
      if (!_.isEqual(preValue, nextValue)) {
        updatePayload.push(key, nextValue);
      }
    }
  });
  return updatePayload.length ? updatePayload : null;
}

export function updateProps(instance, updatePayload) {
  for (let i = 1; i < updatePayload.length; i += 2) {
    const key = updatePayload[i - 1];
    const value = updatePayload[i];
    if (instance instanceof Frame) {
      instance.updateProps({ [key]: value });
    } else if (instance instanceof Drawable) {
      if (key === 'args') {
        instance.setArgs(value);
      } else {
        instance.updateProps({ [key]: value });
      }
    } else {
      invariant(false, 'updateProps is NOOP. Make sure you implement it.');
    }
  }
}
