import { Editor } from "./Editor";
import { RootProvider } from "./states/Root";
import { TSServerProvider } from "./typescript-lsp/server/TSServerProvider";

const App = () => {
  return (
    <TSServerProvider>
      <RootProvider>
        <Editor />
      </RootProvider>
    </TSServerProvider>
  );
};

export default App;
