import React from 'react'

const LabelAreaRequired = ({ label, size, className = "" }) => {
  return (
    <label
    className={`col-span-4 sm:col-span-2 font-medium self-center ${
      size ? size : "text-sm"
    } dark:text-gray-300 ${className}`}
  >
    {label}<span className=' text-red-700'>*</span>
  </label>
  )
}

export default LabelAreaRequired