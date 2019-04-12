import _typeof from "@babel/runtime/helpers/typeof";

/* tslint:disable:use-isnan */
import './object-unique-id';
import { getObjectUniqueId } from './object-unique-id';
export function compareFast(o1, o2) {
  if (o1 === o2) {
    return 0;
  }

  if (typeof o1 === 'undefined') {
    return 1;
  }

  if (typeof o2 === 'undefined') {
    return -1;
  }

  if (o1 === null) {
    return 1;
  }

  if (o2 === null) {
    return -1;
  }

  o1 = o1.valueOf();
  o2 = o2.valueOf(); // is NaN

  if (o1 !== o1) {
    if (o2 !== o2) {
      return 0;
    }

    return 1;
  }

  if (o2 !== o2) {
    return -1;
  }

  var t1 = _typeof(o1);

  var t2 = _typeof(o2);

  if (t1 === t2) {
    if (o1 > o2) {
      return 1;
    } else if (o1 < o2) {
      return -1;
    }

    o1 = getObjectUniqueId(o1);
    o2 = getObjectUniqueId(o2);

    if (o1 > o2) {
      return 1;
    }

    return -1;
  }

  if (t1 < t2) {
    return -1;
  }

  return 1;
}
export function compareStrict(o1, o2) {
  if (o1 === o2) {
    return 0;
  }

  if (typeof o1 === 'undefined') {
    return 1;
  }

  if (typeof o2 === 'undefined') {
    return -1;
  }

  if (o1 === null) {
    return 1;
  }

  if (o2 === null) {
    return -1;
  }

  o1 = o1.valueOf();
  o2 = o2.valueOf();

  var t1 = _typeof(o1);

  var t2 = _typeof(o2);

  if (t1 === t2) {
    // is NaN
    if (o1 !== o1) {
      if (o2 !== o2) {
        return 0;
      }

      return 1;
    }

    if (o2 !== o2) {
      return -1;
    }

    if (o1 > o2) {
      return 1;
    } else if (o1 < o2) {
      return -1;
    }

    o1 = getObjectUniqueId(o1);
    o2 = getObjectUniqueId(o2);

    if (o1 > o2) {
      return 1;
    }

    return -1;
  }

  if (t1 === 'number') {
    return -1;
  }

  if (t2 === 'number') {
    return 1;
  }

  if (t1 === 'boolean') {
    return -1;
  }

  if (t2 === 'boolean') {
    return 1;
  }

  if (t1 === 'string') {
    return -1;
  }

  if (t2 === 'string') {
    return 1;
  }

  if (Array.isArray(o1)) {
    return -1;
  }

  if (Array.isArray(o2)) {
    return 1;
  }

  if (t1 === 'object') {
    return -1;
  }

  if (t2 === 'object') {
    return 1;
  }

  if (t1 === 'function') {
    return -1;
  }

  if (t2 === 'function') {
    return 1;
  }

  if (t1 < t2) {
    return -1;
  }

  return 1;
}