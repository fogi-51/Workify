import React from 'react';

const ContactInfoItem: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="flex items-start">
        <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300 rounded-lg flex items-center justify-center">
            {icon}
        </div>
        <div className="ml-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h4>
            <p className="mt-1 text-gray-600 dark:text-gray-400">{children}</p>
        </div>
    </div>
);


const Contact: React.FC = () => {
  return (
    <div className="animate-fade-in font-sans">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="space-y-16">
                {/* Hero Section */}
                <section className="text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-gray-900 dark:text-white">
                        Get in Touch
                    </h1>
                    <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
                        We’d love to hear from you. Whether you have a question, feedback, or just want to say hello, our team is ready to answer all your questions.
                    </p>
                </section>

                {/* Main Content: Info */}
                <section>
                    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800/50 p-8 sm:p-12 rounded-2xl shadow-xl">
                        {/* Contact Info */}
                        <div className="flex flex-col">
                             <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h2>
                             <div className="space-y-8">
                                <ContactInfoItem
                                    title="Email Us"
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                                >
                                    <a href="mailto:care@fogi.co.in" className="hover:text-primary-500 transition-colors">care@fogi.co.in</a>
                                </ContactInfoItem>
                                 <ContactInfoItem
                                    title="Website"
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9m-9 9a9 9 0 00-9-9" /></svg>}
                                >
                                    <a href="http://www.fogi.co.in/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-500 transition-colors">http://www.fogi.co.in/</a>
                                </ContactInfoItem>
                                 <ContactInfoItem
                                    title="Call Us"
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
                                >
                                    +1 507-580-7917
                                </ContactInfoItem>
                             </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
  );
};

export default Contact;