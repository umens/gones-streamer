import React, { RefObject } from "react";
import { Input } from "antd";
import "./Editable.css";

type EditableProps = {
  text: string | undefined;
  type: string;
  placeholder: string;
  children: React.ReactNode;
  childref: RefObject<HTMLInputElement> | RefObject<Input>;
};
type EditableState = {
  isEditing: boolean;
};
class Editable extends React.Component<EditableProps, EditableState> {

  constructor(props: Readonly<EditableProps>) {
    super(props);
    this.state = {
      isEditing: false,
    };
  }

  handleKeyDown = async (event: any, type: string) => {
    try {
      const { key } = event;
      const keys = ["Escape", "Tab"];
      const enterKey = "Enter";
      const allKeys = [...keys, enterKey];
      if (
        (type === "textarea" && keys.indexOf(key) > -1) ||
        (type !== "textarea" && allKeys.indexOf(key) > -1)
      ) {
        await this.setState({ isEditing: false });
      }
    } catch (error) {
      
    }
  };
  
  render() {
    return (
      <section {...this.props}>
        {this.state.isEditing ? (
          <div
            onBlur={async () => await this.setState({ isEditing: false })}
            onKeyDown={(e: any) => this.handleKeyDown(e, this.props.type)}
          >
            {this.props.children}
          </div>
        ) : (
          <div
            onClick={async () => await this.setState({ isEditing: true })}
          >
            <span>
              {this.props.text || this.props.placeholder || "Editable content"}
            </span>
          </div>
        )}
      </section>
    );
  }
};

export { Editable };
