import React, { forwardRef } from 'react';
import './input.css';

const Input = forwardRef((props, ref) => {
  return (
    <div className="form-control">
      <label htmlFor={props.id}>{props.label}</label>
      <input
        ref={ref}
        id={props.id}
        name={props.name}
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
});

export default Input;
