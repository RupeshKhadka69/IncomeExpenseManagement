import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

// Define formats outside the component
const formats = [
  'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'link', 'image', 'code-block'
];

// Image upload handler
function imageHandler(quill) {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = async () => {
    const file = input.files[0];
    if (file) {
      try {
        // Create form data
        const formData = new FormData();
        formData.append('image', file);

        // Upload to server
        const response = await axios.post('http://localhost:8000/blog/upload-image', formData);

        // Get the current cursor position
        const range = quill.getSelection();

        // Insert the image
        quill.insertEmbed(range.index, 'image', response.data.url);

        // Move cursor after the image
        quill.setSelection(range.index + 1);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image');
      }
    }
  };
}

// Define modules outside the component
const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'code-block'],
      ['clean']
    ],
    handlers: {
      image: function () {
        imageHandler(this.quill);
      }
    }
  }
};

const Editor = ({ value, onChange }) => {
  return (
    <div className="relative mb-5" onClick={(e) => e.stopPropagation()}>
      <div className="editor-wrapper">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder="Write your blog post..."
          className="block"
        />
      </div>
      
      {/* Custom styles to ensure editor displays properly */}
      <style jsx>{`
        .editor-wrapper .quill {
          display: block !important;
        }
        .editor-wrapper .ql-container {
          min-height: 200px;
        }
        .editor-wrapper .ql-editor {
          min-height: 200px;
          max-height: 500px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};

export default Editor;
