"use client"

import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  // Effect to handle background animation
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      document.documentElement.style.setProperty('--scroll-position', `${scrollPosition * 0.1}px`);
      
      const orbs = document.querySelectorAll('.background-orb');
      orbs.forEach((orb, index) => {
        const element = orb as HTMLElement;
        const speed = 0.1 + (index * 0.05);
        element.style.transform = `translateY(${scrollPosition * speed}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black relative">
      {/* Continuous interactive background */}
      <div className="fixed inset-0 bg-black overflow-hidden z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-950/30 to-black opacity-70"></div>
        
        {/* Animated orbs */}
        <div className="background-orb absolute -top-40 -right-40 w-96 h-96 rounded-full bg-green-500/20 blur-3xl animate-pulse"></div>
        <div className="background-orb absolute top-60 -left-20 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="background-orb absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-emerald-600/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="background-orb absolute top-1/3 left-1/3 w-72 h-72 rounded-full bg-green-700/20 blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="background-orb absolute bottom-1/4 left-1/6 w-56 h-56 rounded-full bg-emerald-400/20 blur-3xl animate-pulse" style={{ animationDelay: '2.5s' }}></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,128,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,128,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Header/Navigation */}
      <header className="sticky top-0 z-100 backdrop-blur-md border-b border-green-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
                  Ushuari
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                href="/auth/login"
                className="text-white/80 hover:text-white transition-colors text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register/user"
                className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white px-5 py-2 rounded-md text-sm font-medium transition-all duration-300"
              >
                Get Started
              </Link>

              <Link
                href="/auth/login?role=admin"
                className="text-white/80 hover:text-white transition-colors text-sm font-medium"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 z-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 mt-52">
            <h1 className="text-4xl md:text-7xl font-bold mb-6 text-white">
              <span className="bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
                AI-Powered
              </span> Legal Assistance
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
              Ushuari connects you with legal organizations to help with your
              legal questions. Just make a call, and we'll handle the rest.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register/user"
                className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white px-8 py-4 rounded-md font-medium text-center transition-all duration-300 shadow-lg shadow-green-900/20"
              >
                Get Started
              </Link>
              <Link
                href="#how-it-works"
                className="border border-green-600/30 text-white hover:bg-green-800/20 px-8 py-4 rounded-md font-medium text-center transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 relative z-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900/40 backdrop-blur-sm border border-green-900/20 p-8 rounded-xl hover:shadow-lg hover:shadow-green-900/10 transition-all duration-300 hover:bg-gray-900/50 transform hover:-translate-y-1">
              <div className="bg-gradient-to-tr from-green-600 to-emerald-700 w-14 h-14 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-900/40">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Make Your Call</h3>
              <p className="text-white/70">
                Simply call in with your legal question or concern using our
                easy-to-use platform.
              </p>
            </div>

            <div className="bg-gray-900/40 backdrop-blur-sm border border-green-900/20 p-8 rounded-xl hover:shadow-lg hover:shadow-green-900/10 transition-all duration-300 hover:bg-gray-900/50 transform hover:-translate-y-1">
              <div className="bg-gradient-to-tr from-green-600 to-emerald-700 w-14 h-14 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-900/40">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Case Assignment</h3>
              <p className="text-white/70">
                Our system matches your query with the most suitable legal
                organization.
              </p>
            </div>

            <div className="bg-gray-900/40 backdrop-blur-sm border border-green-900/20 p-8 rounded-xl hover:shadow-lg hover:shadow-green-900/10 transition-all duration-300 hover:bg-gray-900/50 transform hover:-translate-y-1">
              <div className="bg-gradient-to-tr from-green-600 to-emerald-700 w-14 h-14 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-900/40">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Receive Expert Advice</h3>
              <p className="text-white/70">
                Get guidance and solutions from qualified legal professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User and Organization Sections */}
      <section className="py-20 relative z-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Individual Users */}
            <div className="bg-gray-900/30 backdrop-blur-sm p-8 rounded-xl border border-green-900/20 relative overflow-hidden group hover:shadow-lg hover:shadow-green-900/10 transition-all duration-300 hover:bg-gray-900/40 transform hover:-translate-y-1">
              <div className="absolute right-0 bottom-0 w-32 h-32 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700"></div>
              <div className="relative">
                <div className="bg-gradient-to-tr from-green-600 to-emerald-700 w-14 h-14 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-900/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">For Individuals</h3>
                <p className="text-white/80 mb-6">
                  Get affordable legal assistance for your personal matters. Our
                  platform connects you with qualified legal organizations ready
                  to help with your questions.
                </p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center text-white/80">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Record your legal questions
                  </li>
                  <li className="flex items-center text-white/80">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Track progress of your cases
                  </li>
                  <li className="flex items-center text-white/80">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Receive personalized legal guidance
                  </li>
                </ul>
                <Link href="/auth/register/user" className="block w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white px-6 py-3 rounded-md font-medium text-center transition-all duration-300 shadow-lg shadow-green-900/10">
                  Sign Up as Individual
                </Link>
              </div>
            </div>

            {/* Organizations */}
            <div className="bg-gray-900/30 backdrop-blur-sm p-8 rounded-xl border border-green-900/20 relative overflow-hidden group hover:shadow-lg hover:shadow-green-900/10 transition-all duration-300 hover:bg-gray-900/40 transform hover:-translate-y-1">
              <div className="absolute right-0 bottom-0 w-32 h-32 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700"></div>
              <div className="relative">
                <div className="bg-gradient-to-tr from-green-600 to-emerald-700 w-14 h-14 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-900/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">For Organizations</h3>
                <p className="text-white/80 mb-6">
                  Join our platform to connect with clients who need your legal
                  expertise. Expand your reach and help people with their legal
                  concerns.
                </p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center text-white/80">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Receive relevant case referrals
                  </li>
                  <li className="flex items-center text-white/80">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Manage client cases efficiently
                  </li>
                  <li className="flex items-center text-white/80">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Grow your client base
                  </li>
                </ul>
                <Link href="/auth/register/organization" className="block w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white px-6 py-3 rounded-md font-medium text-center transition-all duration-300 shadow-lg shadow-green-900/10">
                  Register Your Organization
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-green-900/20 text-white py-8 relative z-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">Ushuari</h2>
              <p className="text-white/50">Legal Assistance Platform</p>
            </div>

            <div className="mt-6 md:mt-0">
              <nav className="flex flex-wrap justify-center gap-6">
                <Link href="#" className="text-white/50 hover:text-white transition-colors">
                  About
                </Link>
                <Link href="#" className="text-white/50 hover:text-white transition-colors">
                  Terms
                </Link>
                <Link href="#" className="text-white/50 hover:text-white transition-colors">
                  Privacy
                </Link>
                <Link href="#" className="text-white/50 hover:text-white transition-colors">
                  Contact
                </Link>
              </nav>
            </div>
          </div>

          <div className="mt-8 text-center text-white/40 text-sm">
            &copy; {new Date().getFullYear()} Ushuari. All rights reserved.
          </div>
        </div>
      </footer>
      
      {/* Global styles */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        
        .animate-pulse {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}