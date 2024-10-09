import { types } from "mobx-state-tree";

export const File = types
  .model("File", {
    path: types.identifier,
    data: types.string,
  })
  .actions((self) => ({
    setData(data: string) {
      self.data = data;
    },
  }));
