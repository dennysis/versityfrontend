'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, useAnimation } from 'framer-motion';

export default function AboutPage() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="/images/volunteers-hero.jpg" 
            alt="Volunteers working together"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-indigo-700/80 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-6 sm:py-32 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              About Our Platform
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100">
              Connecting passionate volunteers with meaningful opportunities to create positive change
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission section */}
      <div className="relative py-16 bg-white overflow-hidden">
        <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
          <div className="relative h-full text-lg max-w-prose mx-auto" aria-hidden="true">
            <svg
              className="absolute top-12 left-full transform translate-x-32"
              width={404}
              height={384}
              fill="none"
              viewBox="0 0 404 384"
            >
              <defs>
                <pattern
                  id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect x={0} y={0} width={4} height={4} className="text-blue-100" fill="currentColor" />
                </pattern>
              </defs>
              <rect width={404} height={384} fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)" />
            </svg>
            <svg
              className="absolute top-1/2 right-full transform -translate-y-1/2 -translate-x-32"
              width={404}
              height={384}
              fill="none"
              viewBox="0 0 404 384"
            >
              <defs>
                <pattern
                  id="f210dbf6-a58d-4871-961e-36d5016a0f49"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect x={0} y={0} width={4} height={4} className="text-blue-100" fill="currentColor" />
                </pattern>
              </defs>
              <rect width={404} height={384} fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)" />
            </svg>
          </div>
        </div>
        <div className="relative px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              ref={ref}
              initial="hidden"
              animate={controls}
              variants={fadeIn}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Mission</h2>
              <div className="mt-8 text-xl leading-8 text-gray-600">
                <p className="mb-4">
                  We believe that everyone has something valuable to contribute to their community. 
                  Our platform aims to break down barriers to volunteering by making it easy to find 
                  opportunities that match your interests, skills, and availability.
                </p>
                <p>
                  We're committed to fostering a culture of service and creating meaningful connections 
                  between volunteers and organizations, empowering individuals to make a difference in 
                  causes they care about.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* How it works section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">How It Works</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
              Our platform serves as a bridge between volunteers and organizations
            </p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="mt-16"
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <motion.div variants={fadeIn} className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-blue-500 rounded-full w-24 h-24 opacity-10"></div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">For Volunteers</h3>
                <p className="text-gray-600">
                  Create profiles highlighting your skills and interests, search for opportunities that match your criteria, and track your volunteer hours.
                </p>
              </motion.div>

              <motion.div variants={fadeIn} className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-indigo-500 rounded-full w-24 h-24 opacity-10"></div>
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">For Organizations</h3>
                <p className="text-gray-600">
                  Post volunteer opportunities, manage applications, and recognize your volunteers' contributions to further your mission.
                </p>
              </motion.div>

              <motion.div variants={fadeIn} className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-purple-500 rounded-full w-24 h-24 opacity-10"></div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">The Connection</h3>
                <p className="text-gray-600">
                  Our platform facilitates meaningful matches based on skills, interests, and needs, creating impactful volunteer experiences.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Impact section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden">
                <Image 
                  src="/images/impact.jpg" 
                  alt="Volunteers making an impact"
                  width={800}
                  height={600}
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg p-6 max-w-xs">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Volunteer Hours</p>
                    <p className="text-3xl font-bold text-gray-900">25,000+</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-10 lg:mt-0"
            >
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Impact</h2>
              <p className="mt-4 text-lg text-gray-600">
                Since our launch, we've facilitated thousands of volunteer connections, resulting in 
                countless hours of service to communities across the country.
              </p>
              
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                  <div className="text-4xl font-bold text-blue-600">5,000+</div>
                  <p className="mt-2 text-gray-600">Volunteer connections made</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                  <div className="text-4xl font-bold text-indigo-600">300+</div>
                  <p className="mt-2 text-gray-600">Organizations supported</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                  <div className="text-4xl font-bold text-purple-600">50+</div>
                  <p className="mt-2 text-gray-600">Communities served</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                  <div className="text-4xl font-bold text-green-600">12</div>
                  <p className="mt-2 text-gray-600">Cause areas supported</p>
                </div>
              </div>
              
              <p className="mt-8 text-lg text-gray-600">
                Our platform has helped organizations in education, healthcare, environmental conservation, 
                social services, and many other sectors find the support they need to further their missions.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

          {/* Team section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Meet the Team</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
              We're a dedicated team of changemakers, technologists, and community builders.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {/* Team Member 1 */}
            <div className="text-center">
              <Image
                className="mx-auto h-40 w-40 rounded-full object-cover"
                src="/images/team1.jpg"
                alt="Team member 1"
                width={160}
                height={160}
              />
              <h3 className="mt-6 text-lg font-medium text-gray-900">Alex Johnson</h3>
              <p className="text-blue-600">Founder & CEO</p>
              <p className="mt-2 text-gray-600">
                Alex brings a passion for social impact and a vision to make volunteering more accessible.
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="text-center">
              <Image
                className="mx-auto h-40 w-40 rounded-full object-cover"
                src="/images/team2.jpg"
                alt="Team member 2"
                width={160}
                height={160}
              />
              <h3 className="mt-6 text-lg font-medium text-gray-900">Jamie Lee</h3>
              <p className="text-indigo-600">CTO</p>
              <p className="mt-2 text-gray-600">
                Jamie leads the technology strategy, ensuring a seamless experience for volunteers and organizations.
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="text-center">
              <Image
                className="mx-auto h-40 w-40 rounded-full object-cover"
                src="/images/team3.jpg"
                alt="Team member 3"
                width={160}
                height={160}
              />
              <h3 className="mt-6 text-lg font-medium text-gray-900">Morgan Riley</h3>
              <p className="text-purple-600">Community Manager</p>
              <p className="mt-2 text-gray-600">
                Morgan connects with volunteers and partners, building strong community relationships.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to Make a Difference?</h2>
          <p className="mt-4 text-lg text-indigo-100 max-w-xl mx-auto">
            Join our growing community of volunteers and organizations today and start creating impact.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/signup"
              className="inline-block px-6 py-3 bg-white text-indigo-700 font-semibold rounded-md shadow hover:bg-indigo-100 transition"
            >
              Get Started
            </Link>
            <Link
              href="/contact"
              className="inline-block px-6 py-3 border border-white text-white font-semibold rounded-md hover:bg-white hover:text-indigo-700 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

