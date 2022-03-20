import React from "react";

interface Props {
  value?: string;
  defaultValue?: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  className?: string;
}

function OutlierEditor({ value, onChange, defaultValue, className }: Props) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      defaultValue={defaultValue}
      className={className}
    />
  );
}

export default OutlierEditor;
