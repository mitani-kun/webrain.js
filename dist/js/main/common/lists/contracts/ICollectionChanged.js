"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CollectionChangedType = void 0;
let CollectionChangedType;
exports.CollectionChangedType = CollectionChangedType;

(function (CollectionChangedType) {
  CollectionChangedType[CollectionChangedType["Removed"] = 0] = "Removed";
  CollectionChangedType[CollectionChangedType["Added"] = 1] = "Added";
  CollectionChangedType[CollectionChangedType["Set"] = 2] = "Set";
  CollectionChangedType[CollectionChangedType["Resorted"] = 3] = "Resorted";
  CollectionChangedType[CollectionChangedType["Moved"] = 4] = "Moved";
})(CollectionChangedType || (exports.CollectionChangedType = CollectionChangedType = {}));