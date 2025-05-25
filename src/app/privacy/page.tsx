export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to protecting your privacy and ensuring your data is handled with care
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-100 pb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700">
                At Versity, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our platform. Our goal is 
                to provide you with a positive experience while maintaining robust protection of your privacy.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-100 pb-4 mt-8">
                2. Information We Collect
              </h2>
              <p className="text-gray-700">
                We collect information that you provide directly to us, such as when you create an account, 
                update your profile, or communicate with us. This may include:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Personal identifiers (name, email address, phone number)</li>
                <li>Profile information (skills, interests, volunteer history)</li>
                <li>Communications you send to us</li>
                <li>Survey responses and feedback</li>
              </ul>
              <p className="text-gray-700">
                We also automatically collect certain information when you use our platform, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Log information (IP address, browser type, pages visited)</li>
                <li>Device information</li>
                <li>Location information</li>
                <li>Cookies and similar technologies</li>
              </ul>
              
              <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-100 pb-4 mt-8">
                3. How We Use Your Information
              </h2>
              <p className="text-gray-700">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Provide, maintain, and improve our services</li>
                <li>Match volunteers with appropriate opportunities</li>
                <li>Process applications and communicate about opportunities</li>
                <li>Send administrative information and updates</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Analyze usage patterns and trends</li>
                <li>Protect against, identify, and prevent fraud and other illegal activity</li>
              </ul>
              
              <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-100 pb-4 mt-8">
                4. Information Sharing
              </h2>
              <p className="text-gray-700">
                We may share your information in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>With organizations when you apply for their volunteer opportunities</li>
                <li>With service providers who perform services on our behalf</li>
                <li>In response to legal process or when required by law</li>
                <li>In connection with a merger, sale, or acquisition</li>
              </ul>
              
              <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-100 pb-4 mt-8">
                5. Data Security
              </h2>
              <p className="text-gray-700">
                We implement appropriate security measures to protect your personal information 
                from unauthorized access, alteration, disclosure, or destruction. However, no 
                method of transmission over the Internet or electronic storage is 100% secure, 
                so we cannot guarantee absolute security.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-100 pb-4 mt-8">
                6. Your Rights
              </h2>
              <p className="text-gray-700">
                Depending on your location, you may have certain rights regarding your personal information, 
                such as the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Access the personal information we maintain about you</li>
                <li>Update or correct inaccuracies in your personal information</li>
                <li>Delete your personal information</li>
                <li>Restrict or object to the processing of your personal information</li>
                <li>Receive a copy of your personal information in a structured, machine-readable format</li>
              </ul>
              <p className="text-gray-700">
                To exercise these rights, please contact us using the information provided in the "Contact Us" section.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-100 pb-4 mt-8">
                7. Changes to This Policy
              </h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the "Last updated" date. 
                We encourage you to review this Privacy Policy periodically for any changes.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-100 pb-4 mt-8">
                8. Contact Us
              </h2>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mt-4">
                <p className="text-gray-700 font-medium">Email: privacy@versity.org</p>
                <p className="text-gray-700 font-medium">Address: 123 Volunteer Street, Suite 456, San Francisco, CA 94103</p>
                <p className="text-gray-700 font-medium">Phone: (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick links section */}
        <div className="max-w-4xl mx-auto mt-12 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Related Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="/terms" className="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-blue-50 transition-colors">
                <div className="mr-4 bg-blue-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Terms of Service</h4>
                  <p className="text-sm text-gray-500">Read our terms and conditions</p>
                </div>
              </a>
              <a href="/contact" className="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-blue-50 transition-colors">
                <div className="mr-4 bg-blue-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Contact Us</h4>
                  <p className="text-sm text-gray-500">Get in touch with our team</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer banner */}
      <div className="bg-gray-50 py-8 mt-12">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Still have questions about your privacy?</h3>
          <p className="text-gray-600 mb-6">Our team is here to help you understand how we protect your data</p>
          <a 
            href="/contact" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
