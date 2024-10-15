import React from 'react';
import { useForm } from 'react-hook-form';

const SingleSelectCheckbox = ({ id, label, value, register, checked, handleChange }) => {
  return (
    <div className="flex gap-2">
    <input
      type="checkbox"
      id={id}
      value={value}
      checked={checked}
      onChange={() => handleChange(value)}
    />
    <label htmlFor={id}>{label}</label>
  </div>
  )
}

export default SingleSelectCheckbox