import LoginForm from '@/components/LoginForm';
import { safeNextPath } from '@/lib/next-path';

export const metadata = {
  title: 'Log in',
};

// A Server Component reads ?next= from the URL and passes it to the form.
export default async function LoginPage({ searchParams }) {
  const query = await searchParams;
  const next = safeNextPath(query.next);

  return (
    <>
      <h1>Log in</h1>
      <LoginForm next={next} />
    </>
  );
}
