import { Children } from 'react';
import shallowEqual from 'shallowequal';

export const getDisplayName = (Component) => {
  if (!Component) {
    return null;
  }
  return typeof Component === 'string'
    ? Component
    : (Component.displayName || Component.name || 'Component');
};

export const findChildrenByType = (children, type) => {
  const types = Array.isArray(type)
    ? type.map(component => getDisplayName(component))
    : [getDisplayName(type)];

  const result = [];

  Children.forEach(children, child => {
    const childType = child && child.type && (child.type.displayName || child.type.name);
    if (types.indexOf(childType) !== -1) {
      result.push(child);
    }
  });

  return result;
};

const isEqualChild = (a, b) => {
  if (a == null && b == null) {
    return true;
  } else if (a !== null && b !== null) {
    return shallowEqual(a.props, b.props);
  }
  return false;
}

export const isEqualChildren = (prevChildren, nextChildren) => {
  if (prevChildren === nextChildren) {
    return true;
  }

  const count = Children.count(nextChildren);

  if (count !== Children.count(prevChildren)) {
    return false;
  }

  if (count === 0) {
    return true;
  }

  if (count === 1) {
    return isEqualChild(nextChildren, prevChildren);
  }

  for (let i = 0; i < count; i++) {
    const nextChild = nextChildren[i];
    const prevChild = prevChildren[i];

    if (!isEqualChild(nextChild, prevChild)) {
      return false;
    }
  }

  return true;
}

export const range = (right, left = 0, step = 1) => {
  const result = [];
  for (let i = left; i <= right; i += step) {
    result.push(i);
  }
  return result;
};

export const cx = (...classes) => classes.filter(cls => !!cls).join(' ');

export const sortByPosition = (a, b) => (a.x - b.x || a.y - b.y);

export const createChainedFunction = (...funcs) => {
  return funcs
    .filter(f => f != null)
    .reduce((acc, f) => {
      if (typeof f !== 'function') {
        throw new Error('Invalid Argument Type, must only provide functions, undefined, or null.');
      }

      if (acc === null) {
        return f;
      }

      return function chainedFunction(...args) {
        acc.apply(this, args);
        f.apply(this, args);
      };
    }, null);
};
