// * Sign-Up Page
// * Secure registration using Server Actions and NextUI components
// * No client-side token handling - pure server-side authentication

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardBody, Input, Button, Link, Spinner } from '@nextui-org/react';
import { Eye, EyeOff } from 'lucide-react';
import { signUpActionSafe } from '@/lib/actions';
import logo from '@/assets/kwasulogo.png';
import { NotificationContainer } from '@/components/shared/NotificationContainer';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter, useSearchParams } from 'next/navigation';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      color="primary"
      size="lg"
      className="w-full font-semibold"
      isDisabled={pending}
      startContent={pending ? <Spinner size="sm" color="white" /> : null}
    >
      {pending ? 'Creating Account…' : 'Create Account'}
    </Button>
  );
}

export default function SignUpPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [formState, formAction] = useFormState(signUpActionSafe as any, { error: null });
  const [clientError, setClientError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const firstNameLabel = useMemo(() => 'First Name', []);
  const lastNameLabel = useMemo(() => 'Last Name', []);
  const emailLabel = useMemo(() => 'Email', []);
  const passwordLabel = useMemo(() => 'Password', []);
  const confirmPasswordLabel = useMemo(() => 'Confirm Password', []);

  const toggleVisibility = () => setIsVisible(!isVisible);

  // * If already authenticated, redirect by role (public page guard)
  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/v1/users/auth/me', { headers: { Accept: 'application/json' } });
        if (!res.ok) return;
        const json = await res.json();
        const role = String(json?.data?.role || '').toLowerCase();
        const target = role === 'admin' || role === 'mentor' || role === 'student' ? `/${role}/dashboard` : '/';
        if (isMounted) {
          const redirectParam = searchParams.get('redirect');
          router.replace(redirectParam || target);
        }
      } catch (_) {
        // * Silent: user likely unauthenticated
      }
    };
    checkAuth();
    return () => { isMounted = false; };
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <NotificationContainer />
        {/* * Logo and Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Image
              src={logo}
              alt="Kwara State University Logo"
              width={48}
              height={48}
              className="mr-3"
            />
            <div className="text-left">
              <h1 className="text-2xl font-bold text-primary">Kwara State</h1>
              <h2 className="text-xl font-bold text-primary">University</h2>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-neutral-900 mb-2">
            Get Started
          </h3>
          <p className="text-neutral-600">
            Create your VTE account
          </p>
        </div>

        {/* * Sign-Up Form */}
        <Card shadow="sm">
          <CardHeader className="pb-0">
            <h4 className="text-xl font-semibold text-foreground">
              Sign Up
            </h4>
          </CardHeader>
          <CardBody className="space-y-6">
            <form
              action={formAction}
              className="space-y-4"
              noValidate
              onSubmit={(e) => {
                setClientError(null);
                const form = e.currentTarget as HTMLFormElement;
                const data = new FormData(form);
                const firstName = String(data.get('firstName') || '').trim();
                const lastName = String(data.get('lastName') || '').trim();
                const email = String(data.get('email') || '').trim();
                const password = String(data.get('password') || '');
                const password2 = String(data.get('password2') || '');
                if (!firstName || !lastName || !email || !password || !password2) {
                  e.preventDefault();
                  setClientError('All fields are required');
                  return;
                }
                if (password !== password2) {
                  e.preventDefault();
                  setClientError('Passwords do not match');
                }
              }}
            >
              {/* * Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="firstName"
                  label={firstNameLabel}
                  placeholder="Enter your first name"
                  variant="bordered"
                  isRequired
                  autoComplete="given-name"
                  classNames={{
                    input: "text-base",
                    label: "font-medium",
                  }}
                />
                <Input
                  name="lastName"
                  label={lastNameLabel}
                  placeholder="Enter your last name"
                  variant="bordered"
                  isRequired
                  autoComplete="family-name"
                  classNames={{
                    input: "text-base",
                    label: "font-medium",
                  }}
                />
              </div>

              {/* * Email */}
              <Input
                name="email"
                label={emailLabel}
                placeholder="Enter your email"
                type="email"
                variant="bordered"
                isRequired
                autoComplete="email"
                classNames={{
                  input: "text-base",
                  label: "font-medium",
                }}
              />

              {/* * Note: Matric/Level captured later in profile creation per spec */}

              {/* * Role is fixed to Student for public sign-up per spec */}

              {/* * Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="password"
                  label={passwordLabel}
                  placeholder="Enter your password"
                  variant="bordered"
                  type={isVisible ? "text" : "password"}
                  isRequired
                  autoComplete="new-password"
                  endContent={
                    <button
                      type="button"
                      onClick={toggleVisibility}
                      className="focus:outline-none"
                    >
                      {isVisible ? (
                        <EyeOff className="w-4 h-4 text-default-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-default-400" />
                      )}
                    </button>
                  }
                  classNames={{
                    input: "text-base",
                    label: "font-medium",
                  }}
                />
                <Input
                  name="password2"
                  label={confirmPasswordLabel}
                  placeholder="Confirm your password"
                  variant="bordered"
                  type="password"
                  isRequired
                  autoComplete="new-password"
                  classNames={{
                    input: "text-base",
                    label: "font-medium",
                  }}
                />
              </div>

              {/* * Inline error */}
              {clientError ? (
                <div className="text-sm text-danger-600" role="alert" aria-live="assertive">
                  {clientError}
                </div>
              ) : null}
              {formState?.error ? (
                <div className="text-sm text-danger-600" role="alert" aria-live="assertive">
                  {formState.error}
                </div>
              ) : null}

              {/* * Submit Button */}
              <SubmitButton />
            </form>

            {/* * Sign In Link */}
            <div className="text-center">
              <p className="text-sm text-neutral-600">
                Already have an account?{' '}
                <Link href="/auth/sign_in" className="text-primary font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
