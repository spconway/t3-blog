import React, { FormEvent, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditorT } from 'tinymce';
import { useController, useFormContext, UseControllerProps } from 'react-hook-form';
import { CreatePostInput } from '../schema/post.schema';

export default function TinyMCEEditor(props: UseControllerProps<CreatePostInput>) {
  console.log(process.env.NEXT_PUBLIC_TINYMCE_API_KEY)
  const {field, fieldState} = useController(props);
  // const editorRef = useRef<TinyMCEEditorT | null>(null);
  // const log = (e: FormEvent) => {
  //   e.preventDefault()
  //   if (editorRef.current) {
  //     console.log(editorRef.current.getContent());
  //   }
  // };
  return (
    <>
      <Editor
        apiKey={`${process.env.NEXT_PUBLIC_TINYMCE_API_KEY}`}
        onEditorChange={field.onChange}
        init={{
          height: 200,
          menubar: 'insert',
          plugins: [],
          toolbar: 'undo redo | formatselect | ' +
          'bold italic backcolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />
      <hr />
    </>
  );
}
