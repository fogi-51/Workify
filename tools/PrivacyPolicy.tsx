import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="animate-fade-in font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800/50 p-8 sm:p-12 rounded-2xl shadow-xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8">
            Privacy Policy
          </h1>
          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2>1. Introduction</h2>
            <p>Welcome to Workify. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.</p>

            <h2>2. Collection of Your Information</h2>
            <p>We may collect information about you in a variety of ways. The information we may collect via the Application depends on the content and materials you use, and includes:</p>
            <ul>
              <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Application or when you choose to participate in various activities related to the Application, such as online chat and message boards.</li>
              <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Application, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Application.</li>
            </ul>

            <h2>3. Use of Your Information</h2>
            <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:</p>
            <ul>
              <li>Create and manage your account.</li>
              <li>Email you regarding your account or order.</li>
              <li>Enable user-to-user communications.</li>
              <li>Generate a personal profile about you to make future visits to the Application more personalized.</li>
            </ul>
            
            <h2>4. Disclosure of Your Information</h2>
            <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
            <ul>
                <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
                <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
            </ul>

            <h2>5. Security of Your Information</h2>
            <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>

            <h2>6. Contact Us</h2>
            <p>If you have questions or comments about this Privacy Policy, please contact us at: care@fogi.co.in</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;