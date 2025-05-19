'use client';
import Image from "next/image";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Users, Sparkles, Target, BarChart2, Clock, Zap, Check, Search, FileText, ShieldCheck, Award, Briefcase } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/services/supabaseClient";

export default function Home() {
  const router = useRouter();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    if (error) console.error(error.message);
  };

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      }
    };
    
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/dashboard');
      }
    });

    return () => {
      if (authListener?.unsubscribe) {
        authListener.unsubscribe();
      }
    };
  }, [router]);

  const clientLogos = [
    { logo: "/clientLogos/tata.png" },
    { logo: "/clientLogos/techmahindra.png" },
    { logo: "/clientLogos/eeshanya.png" },
    { logo: "/clientLogos/hrh.jpeg" },
    { logo: "/clientLogos/google.png" },
  ];

  const testimonials = [ 
    {
      quote: "Built with security at its core, the site ensures robust protection against vulnerabilities while maintaining smooth performance.",
      author: "Eswar",
      image: "/user Photos/avatar.jpeg",
      role: "Information Security Analyst, GlobalSoft",
      avatar: "/avatar3.jpg"
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/20 via-white to-indigo-50/20">
      {/* Floating Background Elements - More Dynamic */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-200/20 blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-indigo-200/20 blur-3xl animate-float-medium"></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 rounded-full bg-blue-300/10 blur-3xl animate-float-fast"></div>
        <div className="absolute bottom-1/4 left-1/3 w-56 h-56 rounded-full bg-purple-200/15 blur-3xl animate-float-slow"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center min-h-screen relative z-10">
        {/* Hero Section */}
        <div className="text-center space-y-8 max-w-6xl w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative inline-block mb-12"
          >
            <div className="absolute -inset-4 bg-blue-100/50 rounded-full blur-lg"></div>
            <div className="relative bg-white p-6 rounded-full shadow-lg border border-blue-100 flex items-center justify-center">
              <Brain className="w-16 h-16 text-blue-600" />
              <Sparkles className="w-8 h-8 text-blue-400 absolute -top-2 -right-2 animate-pulse" />
              <div className="absolute -bottom-2 -left-2 bg-white px-3 py-1 rounded-full shadow-sm text-xs font-medium text-blue-600 border border-blue-100">
                AI-Powered
              </div>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 leading-tight tracking-tight"
          >
            Smarter Hiring, <br className="hidden sm:block" />Powered by AI
          </motion.h1>

          <div className="mt-12">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white group px-8 py-6 text-lg cursor-pointer"
              onClick={signInWithGoogle} // Example navigation
            >
              Start Recruiting
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Transform your recruitment with intelligent matching, automated screening, and data-driven insights that deliver <span className="font-semibold text-blue-600">better candidates faster</span>.
          </motion.p>
        </div>

        {/* Stats Section */}
        <div className="w-full max-w-7xl mx-auto mt-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                value: "85%", 
                label: "Reduction in time-to-hire", 
                icon: <Clock className="w-8 h-8 text-blue-500" />,
                description: "Companies using our platform fill positions faster"
              },
              { 
                value: "3.2x", 
                label: "Better candidate matches", 
                icon: <Check className="w-8 h-8 text-green-500" />,
                description: "Higher quality candidates through AI matching"
              },
              { 
                value: "95%", 
                label: "Accuracy rate", 
                icon: <BarChart2 className="w-8 h-8 text-indigo-500" />,
                description: "Precision in candidate-job matching"
              }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-blue-50 rounded-lg mr-4">
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-lg font-medium text-gray-700">{stat.label}</div>
                  </div>
                </div>
                <p className="text-gray-500">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="w-full max-w-7xl mx-auto mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How TalentAI Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Our intelligent platform transforms your hiring process in three simple steps</p>
          </div>

          <div className="relative">
            {/* Timeline */}
            <div className="hidden absolute left-1/2 top-0 h-full w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
            
            <div className="space-y-16 md:space-y-0">
              {[
                {
                  // step: "1",
                  title: "Define Your Needs",
                  description: "Tell us about your open position and ideal candidate profile. Our AI learns your requirements.",
                  icon:<FileText className="w-8 h-8 text-blue-500" />,
                  direction: "left"
                },
                {
                  // step: "2",
                  title: "Smart Candidate Matching",
                  description: "Our algorithm analyzes thousands of profiles to find the best matches based on skills, experience, and culture fit.",
                  icon: <Search className="w-8 h-8 text-red-500" />,
                  direction: "right"
                },
                {
                  // step: "3",
                  title: "Review & Interview",
                  description: "Receive a curated shortlist of top candidates with AI-generated insights to guide your interviews.",
                  icon: <Users className="w-8 h-8 text-purple-500" />,
                  direction: "left"
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className={`relative flex flex-col items-center ${item.direction === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8`}
                >
                  <div className={`flex-1 ${item.direction === 'left' ? 'md:text-right' : 'md:text-left'} order-2 md:order-1`}>
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold mb-4 md:hidden">
                      {item.step}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                  
                  <div className={`order-1 md:order-2 flex-shrink-0 relative ${item.direction === 'left' ? 'md:-mr-8' : 'md:-ml-8'}`}>
                    {/* <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white border-4 border-blue-100 flex items-center justify-center text-blue-600 font-bold z-10">
                      {item.step}
                    </div> */}
                    <div className="w-18 h-18 rounded-3xl bg-white shadow-lg border border-gray-100 flex  items-center justify-center">
                      {item.icon}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="w-full max-w-7xl mx-auto mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Everything you need to streamline your recruitment process</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8 text-blue-500" />,
                title: "AI Candidate Matching",
                description: "Advanced algorithms match candidates to your job requirements with unprecedented accuracy.",
                highlights: ["Skills analysis", "Culture fit scoring", "Experience matching"]
              },
              {
                icon: <FileText className="w-8 h-8 text-indigo-500" />,
                title: "Automated Screening",
                description: "Eliminate manual resume reviews with intelligent parsing and scoring of applications.",
                highlights: ["Resume parsing", "Keyword analysis", "Experience validation"]
              },
              {
                icon: <BarChart2 className="w-8 h-8 text-purple-500" />,
                title: "Analytics Dashboard",
                description: "Real-time insights into your hiring pipeline and candidate quality metrics.",
                highlights: ["Time-to-hire tracking", "Source effectiveness", "Diversity metrics"]
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-green-500" />,
                title: "Bias Reduction",
                description: "Minimize unconscious bias in your hiring process with structured evaluations.",
                highlights: ["Blind screening", "Structured interviews", "Diversity insights"]
              },
              {
                icon: <Sparkles className="w-8 h-8 text-yellow-500" />,
                title: "Candidate Engagement",
                description: "Automated messaging keeps candidates informed and engaged throughout the process.",
                highlights: ["Personalized emails", "Status updates", "Feedback collection"]
              },
              {
                icon: <Award className="w-8 h-8 text-red-500" />,
                title: "Employer Branding",
                description: "Showcase your company culture and values to attract top talent.",
                highlights: ["Custom career pages", "Team profiles", "Culture highlights"]
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: Math.floor(index/3) * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all group"
              >
                <div className=" w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="w-full max-w-5xl mx-auto mt-32 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-12 text-white">
              <h2 className="text-3xl font-bold mb-6">Trusted by HR Teams Worldwide</h2>
              <p className="text-blue-100 mb-8">
                Join thousands of companies who have transformed their hiring with TalentAI
              </p>
              <div className="flex flex-wrap gap-4">
                {clientLogos.map((client, i) => (
                  <div key={i} className="h-12 w-12 bg-white rounded-lg backdrop-blur-sm flex items-center justify-center">
                    <div className="h-10 w-10 bg-white rounded flex items-center justify-center shadow-md">
                    <img
                    src={client.logo}
                    alt={`Client Logo ${i + 1}`}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-7">
              <div className="relative h-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                  >
                    <div className="flex flex-col h-full justify-center">
                      <div className="text-2xl font-oswald font- text-gray-800 mb-6 leading-relaxed">
                        "{testimonials[currentTestimonial].quote}"
                      </div>
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-gray-200 mr-4 overflow-hidden">
                          {/* Replace with actual avatar image */}
                          {testimonials[currentTestimonial].image ? (
                <Image
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].author}
                  width={40}
                  height={40}
                  className=" w-full h-full object-cover "
                />
              ) : (
                          <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500">
                            {testimonials[currentTestimonial].author.charAt(0)}
                          </div>
              )} 
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{testimonials[currentTestimonial].author}</div>
                          <div className="text-gray-500 text-sm">{testimonials[currentTestimonial].role}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                <div className="absolute bottom-0 left-0 space-x-2  ">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full ${currentTestimonial === index ? 'bg-blue-600' : 'bg-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-15px) translateX(-15px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-10px) translateX(5px); }
        }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 6s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}