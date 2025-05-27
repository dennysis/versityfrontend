import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-800 via-indigo-700 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="relative z-10 pb-8 bg-gradient-to-br from-indigo-800 via-indigo-700 to-indigo-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <div className="pt-10 sm:pt-16 lg:pt-8 lg:pb-14 lg:overflow-hidden">
              <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl leading-tight antialiased">
                    <span className="block xl:inline">Connect with</span>{' '}
                    <span className="block text-indigo-200 xl:inline font-extrabold">meaningful volunteer work</span>
                  </h1>
                  <p className="mt-3 text-base text-indigo-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 leading-relaxed antialiased">
                    Versity connects volunteers with organizations offering meaningful opportunities. 
                    Find your perfect match, track your hours, and make a real difference in your community.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                    <div className="rounded-lg shadow-lg">
                      <Link href="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105 md:py-4 md:text-lg md:px-10 shadow-lg antialiased">
                        Get started
                      </Link>
                    </div>
                    <div className="mt-3 sm:mt-0">
                      <Link href="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-semibold rounded-lg text-indigo-700 bg-white hover:bg-indigo-50 transition-all duration-200 md:py-4 md:text-lg md:px-10 shadow-lg antialiased">
                        Sign in
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
     
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-bold tracking-wide uppercase antialiased">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl antialiased">
              A better way to volunteer
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 lg:mx-auto leading-relaxed antialiased">
              Versity makes it easy to find, apply for, and track volunteer opportunities that matter to you.
            </p>
          </div>

          <div className="mt-12">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {/* Feature 1 */}
              <div className="relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-500 text-white shadow-lg">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-semibold text-gray-900 mb-2 antialiased">Find Opportunities</h3>
                  <p className="text-base text-gray-600 leading-relaxed antialiased">
                    Browse and search for volunteer opportunities that match your skills, interests, and schedule.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-500 text-white shadow-lg">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-semibold text-gray-900 mb-2 antialiased">Track Hours</h3>
                  <p className="text-base text-gray-600 leading-relaxed antialiased">
                    Log and verify your volunteer hours to build a comprehensive record of your community service.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-500 text-white shadow-lg">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-semibold text-gray-900 mb-2 antialiased">Connect with Organizations</h3>
                  <p className="text-base text-gray-600 leading-relaxed antialiased">
                    Build meaningful relationships with organizations that align with your values and mission.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-800">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl leading-tight antialiased">
            <span className="block">Ready to start volunteering?</span>
            <span className="block text-indigo-200">Create an account today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-100 antialiased">
            Join thousands of volunteers and organizations making a difference in their communities.
          </p>
          <Link href="/register" className="mt-8 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-lg text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto transition-all duration-200 transform hover:scale-105 shadow-lg antialiased">
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
}
