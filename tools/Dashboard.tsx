import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import ToolFolders from '../components/ToolFolders';
import ToolCategoryView from '../components/ToolCategoryView';
import { ToolCategory } from '../types';

// Icons for the features section
const FeatureIconAI: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);
const FeatureIconTools: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);
const FeatureIconWorkflow: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const Dashboard: React.FC = () => {
  const { setActiveToolId } = useAppContext();
  const toolsRef = React.useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | null>(null);

  const scrollToTools = () => {
    document.getElementById('service')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  if (selectedCategory) {
    return (
        <div className="container mx-auto px-6 py-8">
            <ToolCategoryView category={selectedCategory} onBack={() => setSelectedCategory(null)} />
        </div>
    );
  }
  
  return (
    <div className="font-sans animate-fade-in bg-white dark:bg-slate-900">
        {/* Hero Section */}
        <section id="home" className="relative text-center py-24 md:py-40 px-4 overflow-hidden">
             {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:3rem_3rem] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
            
            <div className="relative z-10 max-w-5xl mx-auto">
                <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 dark:from-purple-400 dark:via-pink-400 dark:to-indigo-400">
                    One App. Every Tool.
                </h1>
                <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-slate-600 dark:text-slate-300">
                    Welcome! Workify is your all-in-one productivity suite, designed to bring all your essential tools into one seamless, intuitive hub.
                </p>
                <button 
                  onClick={scrollToTools}
                  className="mt-10 group inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white font-bold rounded-full shadow-lg hover:bg-purple-700 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-500/50"
                >
                  Explore All Tools
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
            </div>
        </section>

      <div className="space-y-24 md:space-y-32 py-24">
        {/* Features Section */}
        <section id="about" className="container mx-auto px-6">
          <div className="text-center">
             <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                The Ultimate Productivity Hub
            </h2>
             <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500 dark:text-slate-400">
                Why juggle dozens of apps when you can have one?
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-purple-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                <FeatureIconAI />
              </div>
              <h3 className="text-xl font-bold mt-5 text-slate-900 dark:text-white">AI-Powered Assistance</h3>
              <p className="mt-2 text-slate-500 dark:text-slate-400">Leverage cutting-edge AI for writing, summarizing, image generation, and more. Get it done faster.</p>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-purple-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
               <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                <FeatureIconTools />
              </div>
              <h3 className="text-xl font-bold mt-5 text-slate-900 dark:text-white">Comprehensive Toolset</h3>
              <p className="mt-2 text-slate-500 dark:text-slate-400">A vast library for every need. Merge PDFs, convert files, generate QR codes, and manage documents with ease.</p>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-purple-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                <FeatureIconWorkflow />
              </div>
              <h3 className="text-xl font-bold mt-5 text-slate-900 dark:text-white">Streamlined Workflow</h3>
              <p className="mt-2 text-slate-500 dark:text-slate-400">One intuitive interface for all your tasks. Stop switching between apps and focus on what matters.</p>
            </div>
          </div>
        </section>

        {/* Tool Categories Section */}
        <section id="service" ref={toolsRef} className="container mx-auto px-6">
            <div className="text-center">
                <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                    Discover Your Perfect Tool
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500 dark:text-slate-400">
                    Whatever the task, we've got you covered. Explore our comprehensive suite of tools.
                </p>
            </div>
            <div className="mt-16">
                <ToolFolders onCategorySelect={setSelectedCategory} />
            </div>
        </section>

        {/* Final CTA Section */}
        <section id="contact" className="text-center container mx-auto px-6">
             <div className="relative rounded-2xl bg-gradient-to-br from-purple-600 to-pink-700 p-12 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 animate-glow"></div>
                <div className="absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full -translate-x-1/3 -translate-y-1/3 opacity-50"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/4 translate-y-1/4 opacity-50"></div>
                <div className="relative z-10">
                    <h2 className="text-4xl font-extrabold text-white">Ready to Boost Your Productivity?</h2>
                    <p className="mt-4 text-lg text-purple-200 max-w-2xl mx-auto">Get started in seconds. Find the right tool for your job and elevate your workflow today.</p>
                    <button 
                        onClick={() => {
                            const writingCategory = Object.values(ToolCategory).find(c => c === ToolCategory.AIWritingAids);
                            if(writingCategory) setSelectedCategory(writingCategory);
                        }}
                        className="mt-8 px-10 py-4 bg-white text-purple-600 font-bold rounded-full shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                        Try Our First Tool
                    </button>
                </div>
             </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;