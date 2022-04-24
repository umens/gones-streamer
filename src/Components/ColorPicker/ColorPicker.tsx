import { Input } from "antd";
import React, { useState } from "react";
import { ChromePicker, ColorResult } from "react-color";
import './ColorPicker.css';

interface ColorPickerProps {
  value?: string;
  onChange?: (value: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value , onChange }) => {
  const [color, setColor] = useState('#ffffff');
  const [visible, setVisible] = useState(false);

  const triggerChange = (changedValue: ColorResult) => {
    onChange?.(changedValue.hex);
  };

  const onColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value)
    triggerChange({ hex: e.target.value, hsl: { h: 0, l: 0, s: 0 }, rgb: { b: 0, g: 0, r: 0 } });
  };

  const handleClick = () => {
    setVisible(!visible);
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleChange = (color: ColorResult) => {
    setColor(color.hex);    
    triggerChange(color);
  };
  

  return (
    <><Input value={value || color} onChange={onColorChange} addonAfter={
      <div>
        <div className="swatch" onClick={ handleClick }>
          <div className="color" style={{ backgroundColor: value || color }} />
        </div>
        { visible ? 
          <div className="popover">
            <div className="cover" onClick={ handleClose } />
            <ChromePicker color={ value || color } onChange={ handleChange } />
          </div> 
          : 
          null 
        }  
      </div>
    } /></>
  );
};

ColorPicker.displayName = 'ColorPicker';

export default ColorPicker;