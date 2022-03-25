import React, { useState, useEffect, FunctionComponent, RefObject } from "react";
import "./Editable.css";

type EditableProps = {
    text: string | undefined;
    type: string;
    placeholder: string;
    children: React.ReactNode;
    childRef: RefObject<HTMLInputElement> | RefObject<any>;
  };

const Editable: FunctionComponent<EditableProps> = ({
  text,
  type,
  placeholder,
  children,
  childRef,
  ...props
}) => {
  const [isEditing, setEditing] = useState(false);

  useEffect(() => {
    if (childRef && childRef.current && isEditing === true) {
      childRef.current.focus();
    }
  }, [isEditing, childRef]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, type: string) => {
    const { key } = event;
    const keys = ["Escape", "Tab"];
    const enterKey = "Enter";
    const allKeys = [...keys, enterKey];
    if (
      (type === "textarea" && keys.indexOf(key) > -1) ||
      (type !== "textarea" && allKeys.indexOf(key) > -1)
    ) {
      setEditing(false);
    }
  };

  return (
    <section {...props}>
      {isEditing ? (
        <div
          onBlur={() => setEditing(false)}
          onKeyDown={e => handleKeyDown(e, type)}
        >
          {children}
        </div>
      ) : (
        <div
          onClick={() => setEditing(true)}
        >
          <span>            
            {text || placeholder || "Editable content"}
          </span>
        </div>
      )}
    </section>
  );
};

export { Editable };
