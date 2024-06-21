import { useState, useEffect, useRef } from "react";
import "./style.css";

interface IProps {
  min: number,
  max: number,
  step: number,
  name: string,
  value: number,
  onChange: (event: any) => void,
  onBlur: (event: any) => void,
  disabled?: boolean
}

export default function InputNumber({ 
  min,
  max,
  step,
  name,
  value,
  onChange,
  onBlur,
  disabled
}: IProps) {
  const [ currValue, setCurrValue ] = useState<number>(0);
  const numberInput = useRef<HTMLInputElement | null>(null);

  const minus = () => {
    if (disabled || currValue === min) return;
    const newValue = currValue - step;
    setCurrValue(newValue);
    if (numberInput.current) {
      const target: HTMLInputElement = numberInput.current;
      Object?.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set?.call(target, newValue);
      target.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  const plus = () => {
    if (disabled || currValue === max) return;
    const newValue = currValue + step;
    setCurrValue(newValue);
    if (numberInput.current) {
      const target: HTMLInputElement = numberInput.current;
      Object?.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set?.call(target, newValue);
      target.dispatchEvent(new Event('change', { bubbles: true }));
    }  
  };

  useEffect(() => {
    setCurrValue(value);
  }, []);

  return (
    <div className="number-input">
      <button onClick={minus} style={{opacity: disabled ? 0.3 : 1}} />
      <input    
        ref={numberInput}    
        min={min}
        max={max}
        step={step}
        name={name}
        value={currValue}
        onChange={(e)=>{console.log(e.target);onChange(e)}}
        onBlur={(e)=>onBlur(e)}
        disabled={disabled}
        type="number"
        style={{opacity: disabled ? 0.3 : 1}}
      />
      <button onClick={plus} className="plus" style={{opacity: disabled ? 0.3 : 1}}></button>
    </div>
  );
}