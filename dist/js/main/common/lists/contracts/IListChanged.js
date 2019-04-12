"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListChangedType = void 0;
let ListChangedType;
exports.ListChangedType = ListChangedType;

(function (ListChangedType) {
  ListChangedType[ListChangedType["Removed"] = 0] = "Removed";
  ListChangedType[ListChangedType["Added"] = 1] = "Added";
  ListChangedType[ListChangedType["Set"] = 2] = "Set";
  ListChangedType[ListChangedType["Resorted"] = 3] = "Resorted";
  ListChangedType[ListChangedType["Moved"] = 4] = "Moved";
})(ListChangedType || (exports.ListChangedType = ListChangedType = {})); // export interface IObservableList<T> extends IListChanged<T>, IList<T> {
// }