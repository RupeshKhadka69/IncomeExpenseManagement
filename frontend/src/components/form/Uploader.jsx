import { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";

const Uploader = ({
  name,
  className = "",
  disabled = false,
  errors = {},
  register,
  required = false,
  showError = true,
  id = "form_" + name,
  watch,
  multiple = false,
  replaceFile,
  hasPdf = false,
}) => {
  const [file, setFile] = useState();
  const [fileType, setFileType] = useState();

  function handleChange(e) {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setFile(e.target.result);
        setFileType(selectedFile.type);
      };

      if (hasPdf && selectedFile.type === "application/pdf") {
        reader.readAsDataURL(selectedFile);
      } else if (selectedFile.type.startsWith("image/")) {
        reader.readAsDataURL(selectedFile);
      } else {
        // Handle unsupported file types
        alert("Unsupported file type. Please select an image or PDF file.");
      }
    }
  }
  return (
    <div className="w-full text-center">
      <div className="px-3 py-4 border-2 border-gray-400 dark:bg-gray-800 border-dashed rounded-md">
        <label htmlFor={id} className="cursor-pointer">
          <input
            name={name}
            id={id}
            type="file"
            className={`sr-only ${className}`}
            {...register(name, { required })}
            accept={`image/png, image/jpeg, image/jpeg ${
              hasPdf && ", application/pdf"
            }`}
            multiple={multiple}
            disabled={disabled}
            onChange={handleChange}
          />
          <span className="mx-auto flex justify-center">
            <FiUploadCloud className="text-3xl text-green-500" />
          </span>
          <em className="text-xs text-gray-600 dark:text-gray-300 ">
            (Only *.jpeg, *.jpg {hasPdf && "*.pdf"} and *.png images will be
            accepted)
          </em>
        </label>
      </div>
      {showError && errors[name] && (
        <>
          <br />
          <span className="text-xs font-light text-red-600">
            {errors[name]?.message || " This is a required field."}
          </span>
          <br />
        </>
      )}

      <aside className="flex flex-row flex-wrap mt-4">
        {file ? (
          <div key={file} className="relative">
            {fileType.startsWith("image/") ? (
              <img className="inline-flex w-24 max-h-24" src={file} alt="" />
            ) : fileType === "application/pdf" ? (
              <iframe title="PDF Preview" src={file} width="50%" height="100" />
            ) : (
              // Handle other file types if needed
              <p>Unsupported file type</p>
            )}
          </div>
        ) : replaceFile ? (
          <img
            src={`${replaceFile}`}
            className="w-24 mt-3 rounded"
            alt={name}
          />
        ) : null}
      </aside>
    </div>
  );
};

export default Uploader;
