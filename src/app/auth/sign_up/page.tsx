// * Sign-Up Page
// * Secure registration using Server Actions and NextUI components
// * No client-side token handling - pure server-side authentication

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardBody, Input, Button, Link, Select, SelectItem } from '@nextui-org/react';
import { Eye, EyeOff } from 'lucide-react';
import { signUpAction } from '@/lib/actions';
import logo from '@/assets/kwasulogo.png';

export default function SignUpPage() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
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
        <Card className="shadow-xl">
          <CardHeader className="pb-0">
            <h4 className="text-xl font-semibold text-foreground">
              Sign Up
            </h4>
          </CardHeader>
          <CardBody className="space-y-6">
            <form action={signUpAction} className="space-y-4">
              {/* * Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="firstName"
                  label="First Name"
                  placeholder="Enter your first name"
                  variant="bordered"
                  isRequired
                  classNames={{
                    input: "text-base",
                    label: "font-medium",
                  }}
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter your last name"
                  variant="bordered"
                  isRequired
                  classNames={{
                    input: "text-base",
                    label: "font-medium",
                  }}
                />
              </div>

              {/* * Username and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="username"
                  label="Username"
                  placeholder="Choose a username"
                  variant="bordered"
                  isRequired
                  classNames={{
                    input: "text-base",
                    label: "font-medium",
                  }}
                />
                <Input
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                  variant="bordered"
                  isRequired
                  classNames={{
                    input: "text-base",
                    label: "font-medium",
                  }}
                />
              </div>

              {/* * Matric Number and Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="matricNumber"
                  label="Matric Number"
                  placeholder="Enter your matric number"
                  variant="bordered"
                  isRequired
                  classNames={{
                    input: "text-base",
                    label: "font-medium",
                  }}
                />
                <Select
                  name="level"
                  label="Level"
                  placeholder="Select your level"
                  variant="bordered"
                  isRequired
                  classNames={{
                    trigger: "",
                    label: "font-medium",
                    value: "",
                    popoverContent: "",
                  }}
                >
                  <SelectItem key="100" value="100">100 Level</SelectItem>
                  <SelectItem key="200" value="200">200 Level</SelectItem>
                  <SelectItem key="300" value="300">300 Level</SelectItem>
                  <SelectItem key="400" value="400">400 Level</SelectItem>
                  <SelectItem key="500" value="500">500 Level</SelectItem>
                  <SelectItem key="600" value="600">600 Level</SelectItem>
                </Select>
              </div>

              {/* * Role Selection */}
              <Select
                name="role"
                label="Role"
                placeholder="Select your role"
                variant="bordered"
                isRequired
                classNames={{
                  trigger: "",
                  label: "font-medium",
                  value: "",
                  popoverContent: "",
                }}
              >
                <SelectItem key="Student" value="Student">Student</SelectItem>
                <SelectItem key="Mentor" value="Mentor">Mentor</SelectItem>
                <SelectItem key="Admin" value="Admin">Admin</SelectItem>
              </Select>

              {/* * Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  variant="bordered"
                  type={isVisible ? "text" : "password"}
                  isRequired
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
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  variant="bordered"
                  type="password"
                  isRequired
                  classNames={{
                    input: "text-base",
                    label: "font-medium",
                  }}
                />
              </div>

              {/* * Submit Button */}
              <Button
                type="submit"
                color="primary"
                size="lg"
                className="w-full font-semibold"
              >
                Create Account
              </Button>
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
