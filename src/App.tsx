import { RecoilRoot } from "recoil";
import OutlierEditor from "./OutlineEditor";
import MindMap from "./MindMap";

function App() {
  return (
    <RecoilRoot>
      <main className="p-4 flex gap-4 h-screen">
        <OutlierEditor className="min-w-[300px] w-full h-full border rounded-lg px-4 py-2 resize-none shadow-xl" />
        <MindMap className="h-full flex-1 border rounded-lg shadow-xl" />
      </main>
    </RecoilRoot>
  );
}

export default App;
