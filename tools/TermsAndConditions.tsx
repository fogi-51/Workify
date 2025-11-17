import React from 'react';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="animate-fade-in font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800/50 p-8 sm:p-12 rounded-2xl shadow-xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8">
            Terms & Conditions
          </h1>
          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <h2>1. Agreement to Terms</h2>
            <p>By using our application, Workify, you agree to be bound by these Terms and Conditions. If you do not agree to these Terms, do not use the application. We may revise the Terms at any time, and the revised version will be effective when posted.</p>
            
            <h2>2. Use of the Application</h2>
            <p>Workify grants you a limited, non-exclusive, non-transferable, revocable license to use the application for your personal, non-commercial purposes. You agree not to use the application for any purpose that is illegal or prohibited by these Terms.</p>
            <ul>
              <li>You are responsible for any content you generate and your use of the services.</li>
              <li>You may not use the services to infringe on the intellectual property rights of others, or to commit any other illegal activity.</li>
              <li>You must not misuse our services by interfering with their normal operation, or attempting to access them using a method other than through the interfaces and instructions that we provide.</li>
            </ul>

            <h2>3. User Accounts</h2>
            <p>To use some of our services, you may need to create an account. You are responsible for safeguarding your account, so use a strong password and limit its use to this account. We cannot and will not be liable for any loss or damage arising from your failure to comply with the above.</p>
            
            <h2>4. Intellectual Property</h2>
            <p>The application and its original content, features, and functionality are and will remain the exclusive property of Workify and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Workify.</p>

            <h2>5. Disclaimer of Warranties</h2>
            <p>The application is provided "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, Workify expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the application.</p>

            <h2>6. Limitation of Liability</h2>
            <p>To the fullest extent permitted by applicable law, in no event will Workify or its affiliates, have any liability arising from or related to your use of or inability to use the application or the content and services for any personal injury, property damage, lost profits, cost of substitute goods or services, loss of data, loss of goodwill, business interruption, computer failure or malfunction or any other consequential, incidental, indirect, exemplary, special or punitive damages.</p>

            <h2>7. Governing Law</h2>
            <p>These Terms will be governed by and construed in accordance with the laws of our jurisdiction, without regard to its conflict of law provisions.</p>
            
            <h2>8. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at: care@fogi.co.in</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;