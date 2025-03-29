import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header/Navigation */}
      <header className="bg-indigo-700 text-white">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xl font-bold">Ushuari</span>
          </div>
          <nav className="space-x-6">
            <Link
              href="/auth/login"
              className="hover:text-indigo-200 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="bg-white text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-100 transition-colors"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-indigo-800 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Legal Assistance Made Simple
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            Ushuari connects you with legal organizations to help with your
            legal questions. Just record your query, and we'll handle the rest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="bg-white text-indigo-700 px-6 py-3 rounded-md font-medium hover:bg-indigo-100 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="#how-it-works"
              className="border border-white text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="bg-indigo-100 text-indigo-700 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
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
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />{" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Record Your Question
              </h3>
              <p className="text-gray-600">
                Simply record your legal question or concern using our easy
                voice recorder tool.
              </p>
            </div>

            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="bg-indigo-100 text-indigo-700 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
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

            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="bg-indigo-100 text-indigo-700 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
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

      {/* Organizations Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">
            For Legal Organizations
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Join our platform to connect with clients who need your expertise
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
              <h3 className="text-xl font-semibold mb-4">
                Register Your Organization
              </h3>
              <p className="text-gray-600 mb-6">
                Sign up to become a verified legal service provider on our
                platform. Help people with their legal questions while expanding
                your client base.
              </p>
              <Link
                href="/auth/register"
                className="block text-center w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Join as Organization
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Ushuari</h2>
              <p className="text-gray-400">Legal Assistance Platform</p>
            </div>

            <div className="mt-6 md:mt-0">
              <nav className="flex flex-wrap justify-center gap-6">
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  About
                </Link>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Terms
                </Link>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Privacy
                </Link>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
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
