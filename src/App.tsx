import { RecoilRoot } from "recoil";
import OutlierEditor from "./OutlineEditor";
import MindMap from "./MindMap";
import Preference from "./Preference";

function App() {
  return (
    <RecoilRoot>
      <main className="p-4 flex gap-4 h-screen">
        <div className="flex flex-col h-full gap-2 w-3/12">
          <OutlierEditor className="min-w-[300px] w-full min-h-[400px] border rounded-lg px-4 py-2 resize-none shadow" />
          <Preference className="border rounded-lg px-4 py-2 shadow-xl flex-1" />
        </div>
        <MindMap className="h-full flex-1 border rounded-lg shadow-xl" />
      </main>
    </RecoilRoot>
  );
}

export default App;
