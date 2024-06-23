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
  disabled?: boolean,
  left: number
}

declare global {
  interface Window {
      timer: any;
  }
}

export default function InputNumber({ 
  min,
  max,
  step,
  name,
  value,
  onChange,
  onBlur,
  disabled,
  left
}: IProps) {
  const [ currValue, setCurrValue ] = useState<number>(0);
  const numberInput = useRef<HTMLInputElement | null>(null);

  const clearTimer = () => {
    clearInterval(window.timer);
  };

  const triggerInputChange = (newValue: number) => {
    if (numberInput.current) {
      const target: HTMLInputElement = numberInput.current;
      Object?.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set?.call(target, newValue);
      target.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  const click = (type: 'minus' | 'plus') => {
    let newValue = currValue;
    if (type === 'minus') {
      if (disabled || currValue === min) return;
      newValue = currValue - step;
    } else {
      if (disabled || currValue === max || left === 0) return;
      newValue = currValue + step;
    }
    setCurrValue(newValue);  
    triggerInputChange(newValue);
  };

  const mouseDown = (type: 'minus' | 'plus') => {
    window.timer = setInterval(() => {  
      if (type === 'minus') {
        if (disabled || currValue === min) return;
        setCurrValue(val=>{
          triggerInputChange(val - step);
          return val - step;
        });
      } else {
        if (disabled || currValue === max || left === 0) return;
        setCurrValue(val=>{
          triggerInputChange(val + step);
          return val + step;
        });
      }
    }, 500);
  };

  const mouseUp = () => {
    clearTimer();
  };

  const blur = () => {
    if (numberInput.current) {
      const target: HTMLInputElement = numberInput.current;
      target.focus()
      target.blur()
    } 
  };

  useEffect(() => {
    if (currValue === min || currValue === max) {
      clearTimer();
    }
    // triggerInputDebounce();
  }, [currValue]);

  useEffect(() => {
    setCurrValue(value);
    return clearTimer();
  }, []);

  return (
    <div className="number-input">
      <button 
        onClick={()=>click('minus')} 
        onMouseDown={()=>mouseDown('minus')}
        onMouseUp={mouseUp}
        onBlur={blur}
        style={{
          opacity: disabled || currValue <= min  ? 0.3 : 1,
          cursor: disabled || currValue <= min ? 'default' : 'pointer',
        }} 
      />
      <input    
        ref={numberInput}    
        min={min}
        max={max}
        step={step}
        name={name}
        value={currValue}
        onChange={(e)=>{onChange(e);}}
        onBlur={(e)=>{onBlur(e)}}
        disabled={disabled}
        type="number"
        style={{opacity: disabled ? 0.3 : 1}}
      />
      <button 
        onClick={()=>click('plus')} 
        onMouseDown={()=>mouseDown('plus')}
        onMouseUp={mouseUp}
        onBlur={blur}
        className="plus" 
        style={{
          opacity: disabled || currValue >= max || left <= 0 ? 0.3 : 1,
          cursor: disabled || currValue >= max || left <= 0 ? 'default' : 'pointer',
        }}
      />
    </div>
  );
}