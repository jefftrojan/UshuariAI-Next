// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-blue-800">
                  Ushuari
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="text-blue-800 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register/user"
                className="bg-blue-700 text-white hover:bg-blue-800 px-4 py-2 rounded-md text-sm font-medium"
              >
                Get Started
              </Link>

              <div className="relative group">
                <button className="text-gray-600 hover:text-blue-800 px-3 py-2 text-sm font-medium">
                  Admin
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link
                    href="/auth/login?role=admin"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Admin Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Legal Assistance Made Simple
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            Ushuari connects you with legal organizations to help with your
            legal questions. Just make a call, and we'll handle the rest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register/user"
              className="bg-white text-blue-800 hover:bg-gray-100 px-6 py-3 rounded-md font-medium"
            >
              Get Started
            </Link>
            <Link
              href="#how-it-works"
              className="border border-white text-white hover:bg-blue-700 px-6 py-3 rounded-md font-medium"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="bg-blue-100 text-blue-800 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Make Your Call</h3>
              <p className="text-gray-600">
                Simply call in with your legal question or concern using our
                easy-to-use platform.
              </p>
            </div>

            <div className="text-center p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="bg-blue-100 text-blue-800 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Case Assignment</h3>
              <p className="text-gray-600">
                Our system matches your query with the most suitable legal
                organization.
              </p>
            </div>

            <div className="text-center p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="bg-blue-100 text-blue-800 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Receive Expert Advice
              </h3>
              <p className="text-gray-600">
                Get guidance and solutions from qualified legal professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User and Organization Sections */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Individual Users */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="bg-blue-100 text-blue-800 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">For Individuals</h3>
              <p className="text-gray-600 mb-6">
                Get affordable legal assistance for your personal matters. Our
                platform connects you with qualified legal organizations ready
                to help with your questions.
              </p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Record your legal questions
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Track progress of your cases
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Receive personalized legal guidance
                </li>
              </ul>
              <Link
                href="/auth/register/user"
                className="block text-center w-full bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition"
              >
                Sign Up as Individual
              </Link>
            </div>

            {/* Organizations */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="bg-blue-100 text-blue-800 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">For Organizations</h3>
              <p className="text-gray-600 mb-6">
                Join our platform to connect with clients who need your legal
                expertise. Expand your reach and help people with their legal
                concerns.
              </p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Receive relevant case referrals
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Manage client cases efficiently
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Grow your client base
                </li>
              </ul>
              <Link
                href="/auth/register/organization"
                className="block text-center w-full bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition"
              >
                Register Your Organization
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Ushuari</h2>
              <p className="text-gray-400">Legal Assistance Platform</p>
            </div>

            <div className="mt-6 md:mt-0">
              <nav className="flex flex-wrap justify-center gap-6">
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition"
                >
                  About
                </Link>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition"
                >
                  Terms
                </Link>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition"
                >
                  Privacy
                </Link>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition"
                >
                  Contact
                </Link>
              </nav>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Ushuari. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
