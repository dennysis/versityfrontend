'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const faqs = [
    {
      category: 'General',
      icon: '🌐',
      questions: [
        {
          question: 'What is this platform for?',
          answer: 'Our platform connects volunteers with organizations that need help. We make it easy to find opportunities that match your skills, interests, and availability.'
        },
        {
          question: 'Is it free to use?',
          answer: 'Yes, our platform is completely free for volunteers. Organizations may have premium features available for a subscription fee.'
        },
        {
          question: 'Do I need to create an account?',
          answer: 'You can browse volunteer opportunities without an account, but you\'ll need to create one to apply for positions, track your hours, and build your volunteer profile.'
        }
      ]
    },
    {
      category: 'For Volunteers',
      icon: '👥',
      questions: [
        {
          question: 'How do I find volunteer opportunities?',
          answer: 'You can search for opportunities using filters like location, cause area, skills required, and time commitment. You can also set up alerts to be notified when new opportunities matching your criteria are posted.'
        },
        {
          question: 'How do I apply for a volunteer position?',
          answer: 'Once you find an opportunity you\'re interested in, click the "Apply" button on the opportunity page. You may need to answer some questions or provide additional information depending on the organization\'s requirements.'
        },
        {
          question: 'Can I track my volunteer hours?',
          answer: 'Yes, you can log your volunteer hours through your account. Organizations can verify these hours, which helps build your volunteer resume.'
        },
        {
          question: 'What if I need to cancel my commitment?',
          answer: 'If you can no longer fulfill your volunteer commitment, please notify the organization as soon as possible through the platform. This allows them to find a replacement if needed.'
        }
      ]
    },
    {
      category: 'For Organizations',
      icon: '🏢',
      questions: [
        {
          question: 'How do I post a volunteer opportunity?',
          answer: 'After creating an organization account and completing your profile, you can post opportunities by clicking "Create Opportunity" in your dashboard. You\'ll need to provide details about the role, requirements, and time commitment.'
        },
        {
          question: 'How do I manage volunteer applications?',
          answer: 'All applications will appear in your dashboard. You can review applicants\' profiles, communicate with them through the platform, and update their application status.'
        },
        {
          question: 'Can I verify volunteer hours?',
          answer: 'Yes, volunteers can log their hours, and you\'ll receive a notification to verify them. This helps maintain accurate records and provides volunteers with verified service hours.'
        },
        {
          question: 'Is there a limit to how many opportunities I can post?',
          answer: 'Free accounts can post up to 3 active opportunities at a time. Premium accounts have unlimited posting capabilities and additional features.'
        }
      ]
    },
    {
      category: 'Technical Support',
      icon: '🔧',
      questions: [
        {
          question: 'I forgot my password. How do I reset it?',
          answer: 'Click "Forgot Password" on the login page and follow the instructions sent to your email address.'
        },
        {
          question: 'How do I update my profile information?',
          answer: 'Log in to your account, go to your profile page, and click "Edit Profile" to update your information.'
        },
        {
          question: 'The platform isn\'t working properly. What should I do?',
          answer: 'Try clearing your browser cache and cookies, or using a different browser. If the issue persists, please contact our support team with details about the problem, including any error messages you\'re seeing.'
        },
        {
          question: 'How do I delete my account?',
          answer: 'Go to your account settings and select "Delete Account." Please note that this action is permanent and will remove all your data from our platform.'
        }
      ]
    }
  ];

  useEffect(() => {
    // Set the first category as active by default
    if (faqs.length > 0 && !activeCategory) {
      setActiveCategory(faqs[0].category);
    }
  }, []);

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredFaqs = searchTerm 
    ? faqs.map(category => ({
        ...category,
        questions: category.questions.filter(
          q => q.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
               q.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : faqs;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our volunteer platform
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Search bar */}
          <div className="mb-10 relative">
            <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="pl-4 pr-2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 py-4 px-2 outline-none text-gray-700 placeholder-gray-400"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Category tabs */}
          {!searchTerm && (
            <div className="mb-8 overflow-x-auto">
              <div className="flex space-x-2 pb-2">
                {faqs.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveCategory(category.category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      activeCategory === category.category
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.category}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {filteredFaqs.length > 0 ? (
            <div className="space-y-10">
              {filteredFaqs.map((category, index) => (
                <div 
                  key={index} 
                  className={`${
                    !searchTerm && activeCategory !== category.category ? 'hidden' : ''
                  }`}
                >
                  <div className="flex items-center mb-6">
                    <span className="text-3xl mr-3">{category.icon}</span>
                    <h2 className="text-2xl font-bold text-gray-900">{category.category}</h2>
                  </div>
                  <div className="space-y-4">
                    {category.questions.map((faq, faqIndex) => {
                      const itemId = `${index}-${faqIndex}`;
                      return (
                        <div 
                          key={faqIndex} 
                          className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                          <button
                            onClick={() => toggleItem(itemId)}
                            className="w-full px-6 py-4 text-left font-medium flex justify-between items-center focus:outline-none"
                          >
                            <span className="text-gray-900">{faq.question}</span>
                            <motion.div
                              animate={{ rotate: openItems[itemId] ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <svg 
                                className="w-5 h-5 text-gray-500" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </motion.div>
                          </button>
                          <AnimatePresence>
                            {openItems[itemId] && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className="px-6 pb-4 text-gray-600 border-t border-gray-100 pt-3">
                                  {faq.answer}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500 mb-6">We couldn't find any FAQs matching your search.</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear Search
              </button>
            </div>
          )}
          
          {/* Contact support section */}
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Still have questions?</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Our support team is here to help. Contact us for personalized assistance with any issues or questions.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
