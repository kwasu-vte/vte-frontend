// * Sign-In Page
// * Secure authentication using Server Actions and NextUI components
// * No client-side token handling - pure server-side authentication
// * Uses signInAction from @/lib/actions for secure authentication

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardBody, Input, Button, Link, Spinner, Checkbox } from '@nextui-org/react';
import { Eye, EyeOff } from 'lucide-react';
import logo from '@/assets/kwasulogo.png';
import { NotificationContainer } from '@/components/shared/NotificationContainer';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const usernameLabel = useMemo(() => 'Matric Number or Email', []);
  const passwordLabel = useMemo(() => 'Password', []);

  // * If already authenticated, redirect by role (public page guard)
  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        const url = '/api/v1/users/auth/me';
        const res = await fetch(url, { headers: { Accept: 'application/json' } });
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
      <div className="w-full max-w-md">
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
            Welcome Back
          </h3>
          <p className="text-neutral-600">
            Sign in to your VTE account
          </p>
        </div>

        {/* * Sign-In Form */}
        <Card shadow="sm">
          <CardHeader className="pb-0">
            <h4 className="text-xl font-semibold text-foreground">
              Sign In
            </h4>
          </CardHeader>
          <CardBody className="space-y-6">
            <form
              action="/auth/login"
              method="POST"
              className="space-y-4"
              onSubmit={(e) => {
                setClientError(null);
                const form = e.currentTarget as HTMLFormElement;
                const data = new FormData(form);
                const username = String(data.get('username') || '').trim();
                const password = String(data.get('password') || '').trim();
                if (!username || !password) {
                  e.preventDefault();
                  setClientError('Username and password are required');
                }
              }}
            >
              {/* * Username/Matric Number Field */}
              <Input
                name="username"
                label={usernameLabel}
                placeholder="Enter your matric number or email"
                variant="bordered"
                isRequired
                isInvalid={!!clientError && !String((document.activeElement as HTMLElement)?.getAttribute?.('name'))}
                errorMessage={clientError || undefined}
                autoComplete="username email"
                classNames={{
                  input: "text-base",
                  label: "font-medium",
                }}
              />

              {/* * Password Field */}
              <Input
                name="password"
                label={passwordLabel}
                placeholder="Enter your password"
                variant="bordered"
                type={isVisible ? "text" : "password"}
                isRequired
                autoComplete="current-password"
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

              {/* * Remember Me */}
              <div className="flex items-center justify-between">
                <Checkbox name="remember" size="sm">
                  Remember me
                </Checkbox>
                <div className="text-xs text-neutral-600" aria-live="polite">
                  {/* Placeholder for future forgot password link */}
                </div>
              </div>

              {/* * Inline error */}
              {clientError ? (
                <div className="text-sm text-danger-600" role="alert" aria-live="assertive">
                  {clientError}
                </div>
              ) : null}
              {/* * No server action errors in this flow */}

              {/* * Submit Button */}
              <Button
                type="submit"
                color="primary"
                size="lg"
                className="w-full font-semibold"
              >
                Sign In
              </Button>
            </form>

            {/* * Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-neutral-600">
                Don&apos;t have an account?{' '}
                <Link href="/auth/sign_up" className="text-primary font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
