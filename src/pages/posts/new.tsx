import { useRouter } from 'next/router';
import Header from '../../components/Head';
import { CreatePostInput, createPostSchema } from '../../schema/post.schema';
import { trpc } from '../../utils/trpc';
import { InputField } from '../../components/Form/InputField';
import { Form } from '../../components/Form/Form';

function CreatePostPage() {
  const router = useRouter();

  const { mutate, error } = trpc.useMutation(['posts.create-post'], {
    onSuccess({ id }) {
      router.push(`/posts/${id}`);
    },
  });

  function onSubmit(values: CreatePostInput) {
    mutate(values);
  }

  return (
    <>
      <Header title="New Post" />
      <Form<CreatePostInput, typeof createPostSchema> onSubmit={onSubmit}>
        {({ register }) => (
          <>
            {error && error.message}

            <h1>Create posts</h1>
            <br />
            <br />
            <InputField type="text" label="Title" registration={register('title')} name="title" />
            <br />
            <InputField type="richTextEditor" label="Body" registration={register('body')} name="body" />
            <br />
            <button>Create post</button>
          </>
        )}
      </Form>
    </>
  );
}

export default CreatePostPage;
