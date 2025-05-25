export default function TermsOfServicePage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully before using our platform
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
                Welcome to Versity. These Terms of Service ("Terms") govern your use of our website, 
                mobile applications, and services (collectively, the "Platform"). By accessing or using 
                Versity, you agree to be bound by these Terms and our Privacy Policy. If you do not agree 
                to these Terms, please do not use our Platform.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-100 pb-4 mt-8">
                2. Definitions
              </h2>
              <p className="text-gray-700">
                Throughout these Terms, we use certain defined terms:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li><strong>"Versity"</strong> refers to our volunteer matching platform, including all content, features, and services offered.</li>
                <li><strong>"User"</strong> refers to any individual who accesses or uses Versity, including volunteers and organizations.</li>
                <li><strong>"Content"</strong> refers to all text, images, videos, and other materials that appear on our Platform.</li>
                <li><strong>"Volunteer Opportunity"</strong> refers to any volunteer position, event, or activity posted on our Platform.</li>
              </ul>
              
              <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-100 pb-4 mt-8">
                3. User Accounts
              </h2>
              <p className="text-gray-700">
                When you create an account with us, you must provide accurate and complete information.
                You are responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Safeguarding your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use of your account</li>
                <li>Ensuring your account information is accurate and up-to-date</li>
              </ul>
              <p className="text-gray-700">
                We reserve the right to disable any user account at any time if, in our opinion, 
                you have failed to comply with these Terms.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-100 pb-4 mt-8">
                4. Acceptable Use
              </h2>
              <p className="text-gray-700">
                You agree not to use Versity for any unlawful purpose or in any way that could damage, 
                disable, overburden, or impair our service. Prohibited activities include, but are not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Posting false, misleading, or fraudulent content</li>
                <li>Impersonating any person or entity</li>
                <li>Harassing, threatening, or intimidating any user</li>
                <li>Posting content that is defamatory, obscene, or offensive</li>
                <li>Attempting to gain unauthorized access to our systems or user accounts</li>
                <li>Using our Platform to distribute malware or other harmful code</li>
                <li>Scraping or collecting user data without permission</li>
              </ul>
              
              <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-100 pb-4 mt-8">
                5. Volunteer Opportunities
              </h2>
              <p className="text-gray-700">
                Organizations are responsible for ensuring that volunteer opportunities posted on our Platform:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Comply with all applicable laws and regulations</li>
                <li>Are accurately described</li>
                <li>Do not discriminate against volunteers on the basis of race, color, religion, gender, sexual orientation, national origin, age, disability, or any other protected characteristic</li>
              </ul>
              <p className="text-gray-700">
                Versity does not guarantee the quality, safety, or legality of volunteer opportunities. 
                Volunteers are encouraged to perform their own due diligence before accepting any opportunity.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-100 pb-4 mt-8">
                6. Intellectual Property
              </h2>
              <p className="text-gray-700">
                The Platform and its original content, features, and functionality are owned by Versity 
                and are protected by international copyright, trademark, patent, trade secret, and other 
                intellectual property laws.
              </p>
              <p className="text-gray-700">
                By posting content on our Platform, you grant Versity a non-exclusive, royalty-free, 
                worldwide license to use, reproduce, modify, adapt, publish, translate, and distribute 
                your content in connection with the operation of our Platform.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-100 pb-4 mt-8">
                7. Limitation of Liability
              </h2>
              <p className="text-gray-700">
                To the maximum extent permitted by law, Versity and its officers, directors, employees, 
                and agents shall not be liable for any indirect, incidental, special, consequential, or 
                punitive damages, including but not limited to, loss of profits, data, use, goodwill, or 
                other intangible losses, resulting from:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Your access to or use of or inability to access or use the Platform</li>
                <li>Any conduct or content of any third party on the Platform</li>
                <li>Any content obtained from the Platform</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              </ul>
              
              <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-100 pb-4 mt-8">
                8. Disclaimer of Warranties
              </h2>
              <p className="text-gray-700">
                The Platform is provided on an "AS IS" and "AS AVAILABLE" basis, without warranties of any kind, 
                either express or implied, including, but not limited to, implied warranties of merchantability, 
                fitness for a particular purpose, non-infringement, or course of performance.
              </p>
              <p className="text-gray-700">
                Versity does not warrant that the Platform will function uninterrupted, secure, or available 
                at any particular time or location, or that any errors or defects will be corrected.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-100 pb-4 mt-8">
                9. Indemnification
              </h2>
              <p className="text-gray-700">
                You agree to defend, indemnify, and hold harmless Versity and its officers, directors, 
                employees, and agents from and against any claims, liabilities, damages, judgments, awards, 
                losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or 
                relating to your violation of these Terms or your use of the Platform.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-100 pb-4 mt-8">
                10. Changes to Terms
              </h2>
              <p className="text-gray-700">
                We may modify these Terms at any time. If we make changes, we will provide notice as appropriate, 
                such as by displaying a prominent notice on our Platform or by sending you an email. Your 
                continued use of Versity after any changes indicates your acceptance of the new Terms.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-100 pb-4 mt-8">
                11. Governing Law
              </h2>
              <p className="text-gray-700">
                These Terms shall be governed by and construed in accordance with the laws of the State of California, 
                without regard to its conflict of law provisions. Any legal action or proceeding arising out of or 
                relating to these Terms shall be brought exclusively in the federal or state courts located in 
                San Francisco County, California.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-100 pb-4 mt-8">
                12. Contact Us
              </h2>
              <p className="text-gray-700">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mt-4">
                <p className="text-gray-700 font-medium">Email: legal@versity.org</p>
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
              <a href="/privacy" className="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-blue-50 transition-colors">
                <div className="mr-4 bg-blue-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Privacy Policy</h4>
                  <p className="text-sm text-gray-500">Learn how we protect your data</p>
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
      
      {/* FAQ section */}
      <div className="bg-gray-50 py-12 mt-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Frequently Asked Questions</h3>
            
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">What happens if I violate these Terms?</h4>
                <p className="text-gray-700">
                  Violations of these Terms may result in the suspension or termination of your account. 
                  Depending on the severity of the violation, we may also take legal action.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">Can I create multiple accounts?</h4>
                <p className="text-gray-700">
                  No, users are limited to one account per person. Creating multiple accounts may result 
                  in all of your accounts being suspended.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">How do I delete my account?</h4>
                <p className="text-gray-700">
                  You can delete your account by going to your account settings and selecting "Delete Account." 
                  Please note that some information may be retained as required by law or for legitimate 
                  business purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-white border-t border-gray-100 mt-16">
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} Versity. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="/privacy" className="text-sm text-blue-600 hover:underline">
              Privacy Policy
            </a>
            <a href="/contact" className="text-sm text-blue-600 hover:underline">
              Contact
            </a>
            <a href="/" className="text-sm text-blue-600 hover:underline">
              Home
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
