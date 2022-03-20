import { useState } from "react";
import OutlierEditor from "./OutlineEditor";
import { parseTextIntoNodes } from "./OutlineEditor/utils";
import MindMap from "./MindMap";

const mockData = `
- Front end tech
    - Compiler/language
        - Elm
        - Svelte
        - ClojureScript
    - Reactive framework
        - React
        - Vue
        - Angular
    - packager
        - Webpack
        - Snowpack
`.trim();

function App() {
  const [nodes] = useState(() => parseTextIntoNodes(mockData));
  console.log({ nodes });
  return (
    <main className="p-4">
      <OutlierEditor
        defaultValue={mockData}
        onChange={(e) => {
          console.log({ e });
        }}
        className="w-full min-h-[300px] border rounded-lg px-4 py-2"
      />
      <MindMap />
    </main>
  );
}

export default App;
