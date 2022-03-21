import { useRecoilState } from "recoil";
import { nodesRawContentAtom } from "../states";

interface Props {
  className?: string;
}

function OutlierEditor({ className }: Props) {
  const [content, setContent] = useRecoilState(nodesRawContentAtom);
  return (
    <div className="flex flex-col gap-2">
      <textarea
        onChange={(e) => {
          setContent(e.target.value);
        }}
        value={content}
        className={className}
      />
    </div>
  );
}

export default OutlierEditor;
