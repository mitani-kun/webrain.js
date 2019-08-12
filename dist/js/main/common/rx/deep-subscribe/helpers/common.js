"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkUnsubscribe = checkUnsubscribe;

function checkUnsubscribe(unsubscribe) {
  if (unsubscribe != null && typeof unsubscribe !== 'function') {
    throw new Error(`Subscribe function should return null/undefined or unsubscribe function, but not ${unsubscribe}`);
  }

  return unsubscribe;
}