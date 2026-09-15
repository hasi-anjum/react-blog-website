import React, { useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react';
import { Controller } from 'react-hook-form';


export default function RTE({ name, control, label, defaultValue = "" }) {
  const editorRef = useRef(null);

  return (
    <div className='w-full'>
      {label && <label className='inline-block mb-1 pl-1'>{label}</label>}

      <Controller
        name={name || "content"}
        control={control}
        rules={{ required: "Content is required" }}
        render={({ field: { onChange, value } }) => (
          <Editor
            tinymceScriptSrc="https://cdn.jsdelivr.net/npm/tinymce@6.8.2/tinymce.min.js"
            apiKey={import.meta.env.VITE_TINYMCE_API_KEY || 'bktm1s3mcwiosap15afmh2d4mkd1gskjavyj1uxy1um41b9p'}
            onInit={(_evt, editor) => editorRef.current = editor}
            initialValue={defaultValue}
            value={value}
            init={{
              height: 500,
              menubar: false,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount',
              ],
              toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
            onEditorChange={onChange}
          />
        )}
      />

    </div>
  )
}
