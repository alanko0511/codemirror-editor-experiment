import * as Comlink from "comlink";
import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { TSServer } from "./TSServer";
export const TSServerContext = createContext<Comlink.Remote<TSServer> | null>(null);

export const TSServerProvider = (props: PropsWithChildren) => {
  const worker = useMemo(() => {
    const worker = new Worker(new URL("./TSServer.ts", import.meta.url), {
      type: "module",
    });

    return Comlink.wrap<TSServer>(worker);
  }, []);

  return <TSServerContext.Provider value={worker}>{props.children}</TSServerContext.Provider>;
};

export const useTSServer = () => {
  const context = useContext(TSServerContext);
  if (!context) {
    throw new Error("useTSServer must be used within a TSServerProvider");
  }
  return context;
};
