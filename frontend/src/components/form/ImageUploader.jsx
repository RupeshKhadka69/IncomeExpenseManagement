import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";

const ImageUploader = ({ imageUrl, name, setValue }) => {
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    multiple: false,
    // maxSize: 500000,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  useEffect(() => {
    setValue(name, files);
  }, [files]);

  const thumbs = files.map((file) => (
    <div key={file.name}>
      <div>
        <img
          className="inline-flex border-2 border-gray-100 w-24 max-h-24"
          src={file.preview}
          alt={file.name}
        />
      </div>
    </div>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <div className="w-full text-center">
      <div
        className="px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <span className="mx-auto flex justify-center">
          <FiUploadCloud className="text-3xl text-green-500" />
        </span>
        <p className="text-sm mt-2">Drag your image here</p>
        <em className="text-xs text-gray-400">
          (Only *.jpeg, *.jpg and *.png images will be accepted)
        </em>
      </div>
      <aside className="flex flex-row flex-wrap mt-4">
        {imageUrl ? (
          <img
            className="inline-flex border rounded-md border-gray-100 dark:border-gray-600 w-32 max-h-32 p-2"
            src={imageUrl}
            alt="product"
          />
        ) : (
          thumbs
        )}
      </aside>
    </div>
  );
};

export default ImageUploader;
