import React from 'react';

const MissionIconInnovation: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);
const MissionIconSimplicity: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const MissionIconEfficiency: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const About: React.FC = () => {
  return (
    <div className="animate-fade-in font-sans">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="space-y-24">
                {/* Hero Section */}
                <section className="text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-gray-900 dark:text-white">
                    We're building the future of productivity.
                </h1>
                <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
                    Workify was born from a simple idea: that everyone deserves access to powerful, easy-to-use tools without the clutter and complexity of traditional software.
                </p>
                </section>

                {/* Mission Section */}
                <section>
                <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-12">
                    Our Mission
                </h2>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="p-8 bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg hover:shadow-primary-500/10 transition-shadow">
                    <MissionIconInnovation />
                    <h3 className="text-xl font-bold mt-4 text-gray-900 dark:text-white">Innovation</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">We harness the power of cutting-edge AI and technology to build tools that are smarter, faster, and more capable than ever before.</p>
                    </div>
                    <div className="p-8 bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg hover:shadow-primary-500/10 transition-shadow">
                    <MissionIconSimplicity />
                    <h3 className="text-xl font-bold mt-4 text-gray-900 dark:text-white">Simplicity</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Productivity tools should be intuitive. We are committed to a user-friendly experience that requires no manual and no steep learning curve.</p>
                    </div>
                    <div className="p-8 bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg hover:shadow-primary-500/10 transition-shadow">
                    <MissionIconEfficiency />
                    <h3 className="text-xl font-bold mt-4 text-gray-900 dark:text-white">Efficiency</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Our ultimate goal is to save you time. By consolidating essential tools into one platform, we help you streamline your workflow and focus on what truly matters.</p>
                    </div>
                </div>
                </section>
                
                {/* Our Story Section */}
                <section>
                    <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-12">
                        Our Story
                    </h2>
                    <div className="max-w-3xl mx-auto space-y-6 text-lg text-gray-600 dark:text-gray-300 text-left md:text-center">
                        <p>
                            Workify began with a familiar frustration. Like many professionals, our days were a chaotic shuffle between dozens of apps—a document editor here, a file converter there, an AI writer somewhere else. Each tool had its own subscription, its own interface, and its own learning curve. Productivity felt anything but productive; it was fragmented, expensive, and complex.
                        </p>
                        <p>
                            We asked ourselves a simple question: "What if it could be better?" What if all the essential tools for modern work could live in one beautifully designed, lightning-fast, and seamlessly integrated platform? This question sparked the idea for Workify—a unified hub designed to eliminate friction and bring joy back to the creative process.
                        </p>
                        <p>
                            Today, we are a passionate team dedicated to that vision. We believe that great tools should be invisible, empowering you to focus on your ideas, not on the software. By combining elegant design with the power of AI, we're building an all-in-one suite that adapts to you, helping you work smarter, not harder. Welcome to the future of productivity. Welcome to Workify.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    </div>
  );
};

export default About;
