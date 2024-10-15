const NewCheckBox = ({
  label, //array with correct index
  name,
  register,
  id,
  className = "",
  labelClassName = "",
  defaultValue,
  required,
  disabled,
  emailPhone,
  password,
}) => {
  return (
    <div className={`flex items-center h-5 ${className}`}>
      <input
        id={id}
        type="checkbox"
        {...register(`${name}`, {
          required:
            required || emailPhone || password
              ? false
              : `${label} is required!`,
        })}
        className={`focus:!ring-primary !text-primary w-4 h-4 border-primary/90 border rounded`}
        defaultValue={defaultValue}
        disabled={disabled}
      />
      <div className="ml-3 text-sm">
        <label htmlFor={id} className={` ${labelClassName}`}>
          {label}
        </label>
      </div>
    </div>
  );
};

export default NewCheckBox;
