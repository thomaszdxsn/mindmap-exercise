import React from "react";

interface Props {
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
}

function OutlierEditor({ value, onChange }: Props) {
  return <textarea value={value} onChange={onChange} />;
}

export default OutlierEditor;
