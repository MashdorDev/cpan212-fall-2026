import RegisterForm from '@/components/RegisterForm';
import { safeNextPath } from '@/lib/next-path';

export const metadata = {
  title: 'Create an account',
};

export default async function RegisterPage({ searchParams }) {
  const query = await searchParams;
  const next = safeNextPath(query.next);

  return (
    <>
      <h1>Create an account</h1>
      <RegisterForm next={next} />
    </>
  );
}
