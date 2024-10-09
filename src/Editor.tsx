import { javascript } from "@codemirror/lang-javascript";
import { linter } from "@codemirror/lint";
import { githubLight } from "@uiw/codemirror-theme-github";
import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect } from "react";
import { useRoot } from "./states/Root";
import { useTSServer } from "./typescript-lsp/server/TSServerProvider";

export const Editor = observer(() => {
  const worker = useTSServer();
  const root = useRoot();
  const file = root.files.get("hello.ts")!;

  useEffect(() => {
    console.log("MST file.data", file.data);
    worker.setFile(file.path, file.data);
  }, [file.data]);

  const onCodeMirrorValueChange = useCallback((value: string, viewUpdate: ViewUpdate) => {
    file.setData(value);
  }, []);

  return (
    <CodeMirror
      value={file.data}
      height="100vh"
      extensions={[
        javascript({ jsx: true }),
        linter(async (view) => {
          const diagnostics = await worker.getFileInfo(file.path);
          return diagnostics;
        }),
      ]}
      theme={githubLight}
      onChange={onCodeMirrorValueChange}
      onCreateEditor={(view) => {
        // Disable Grammarly in the editor
        view.contentDOM.setAttribute("data-gramm", "false");
      }}
    />
  );
});
