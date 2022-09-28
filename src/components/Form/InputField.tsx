import clsx from 'clsx';
import { FieldPath, useController, useFormContext, UseFormRegisterReturn } from 'react-hook-form';
import { Editor } from '@tinymce/tinymce-react';

import { FieldWrapper, FieldWrapperPassThroughProps } from './FieldWrapper';
import { CreatePostInput } from '../../schema/post.schema';

type InputFieldProps = FieldWrapperPassThroughProps & {
  type?: 'text' | 'email' | 'password' | 'richTextEditor';
  className?: string;
  registration: Partial<UseFormRegisterReturn>;
  name: FieldPath<CreatePostInput>;
};

export const InputField = (props: InputFieldProps) => {
  const { type = 'text', label, className, registration, error, name } = props;
  const { control } = useFormContext<CreatePostInput>();
  const {
    field: { onChange, ...field },
  } = useController({ control, name });

  function renderInputField() {
    switch (type) {
      case 'text':
        return (
          <input
            type={type}
            className={clsx(
              'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
              className
            )}
            {...registration}
          />
        );
      case 'richTextEditor':
        return (
          <Editor
            apiKey={`${process.env.NEXT_PUBLIC_TINYMCE_API_KEY}`}
            {...field}
            onEditorChange={onChange}
            init={{
              height: 200,
              menubar: false,
              plugins: '',
              toolbar:
                'undo redo | formatselect | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            }}
          />
        );
      default:
        return <p>Input component not found...</p>;
    }
  }

  return (
    <FieldWrapper label={label} error={error}>
      {renderInputField()}
    </FieldWrapper>
  );
};
