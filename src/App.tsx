import { RecoilRoot } from "recoil";
import OutlierEditor from "./OutlineEditor";
import MindMap from "./MindMap";

function App() {
  return (
    <RecoilRoot>
      <main className="p-4">
        <OutlierEditor className="w-full min-h-[300px] border rounded-lg px-4 py-2" />
        <MindMap />
      </main>
    </RecoilRoot>
  );
}

export default App;
