import { Link } from '@tanstack/react-router';

import { ROUTES } from '@shared/config/routes';

export const RegistrationSuccess = (): React.JSX.Element => (
  <div className="flex flex-1 items-center justify-center flex-col">
    <div className="flex flex-col gap-6 max-w-lg p-8 w-full text-center">
      <div className="flex flex-col gap-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>

        <p className="text-gray-600">
          If you&apos;ve just registered, we&apos;ve sent a verification link to
          your email. Please check your inbox and click the link to complete
          your registration.
          <br />
          After clicking the verification link, you&apos;ll be automatically
          redirected to complete your profile setup.
        </p>

        <div className="mt-4 p-4 bg-orange-50 rounded-lg">
          <p className="text-sm text-orange-800">
            💡 <strong>Tip:</strong> Can&apos;t find the email? Check your spam
            folder or try registering again with the same email address.
          </p>
        </div>
        <div className="mt-6">
          <p className="text-sm text-gray-500">
            Already confirmed your email?{' '}
            <Link className="text-primary hover:underline" to={ROUTES.LOGIN}>
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  </div>
);
