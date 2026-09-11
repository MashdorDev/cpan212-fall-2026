import AuthForm from '@/components/AuthForm';
import { safeNextPath } from '@/lib/next-path';

export const metadata = {
  title: 'Create an account',
};

export default async function RegisterPage({ searchParams }) {
  const { next } = await searchParams;

  return (
    <>
      <h1>Create an account</h1>
      <AuthForm mode="register" next={safeNextPath(next)} />
    </>
  );
}
