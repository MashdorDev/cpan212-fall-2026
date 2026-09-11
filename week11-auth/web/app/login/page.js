import AuthForm from '@/components/AuthForm';
import { safeNextPath } from '@/lib/next-path';

export const metadata = {
  title: 'Log in',
};

// A Server Component reads ?next= and hands it to the Client Component form. Reading it with
// useSearchParams() in the form would also work, but then the page needs a Suspense boundary to build.
export default async function LoginPage({ searchParams }) {
  const { next } = await searchParams;

  return (
    <>
      <h1>Log in</h1>
      <AuthForm mode="login" next={safeNextPath(next)} />
    </>
  );
}
