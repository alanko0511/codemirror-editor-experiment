import { Instance, types } from "mobx-state-tree";
import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { File } from "./File";

const Root = types
  .model("Root", {
    files: types.map(File),
  })
  .views((self) => ({
    get filesAsArray() {
      return Array.from(self.files.values());
    },
  }))
  .actions((self) => ({
    addFile(path: string, data: string) {
      self.files.set(path, {
        path,
        data,
      });
    },
  }));

const RootContext = createContext<Instance<typeof Root> | null>(null);

export const RootProvider = (props: PropsWithChildren) => {
  const root = useMemo(
    () =>
      Root.create({
        files: {
          "hello.ts": {
            path: "hello.ts",
            data: `console.log('hello world!');`,
          },
        },
      }),
    []
  );

  return <RootContext.Provider value={root}> {props.children} </RootContext.Provider>;
};

export const useRoot = () => {
  const context = useContext(RootContext);
  if (context === null) {
    throw new Error("useRoot must be used within a RootProvider");
  }
  return context;
};
