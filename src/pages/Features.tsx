import { Link } from 'react-router-dom';
import { ArrowRight, Dumbbell, Utensils, Brain, BarChart2, Users, Calendar, Zap, Cloud, Lock, Moon, Smartphone, Sparkles } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Features = () => {
  // Core features from the existing component
  const coreFeatures = [
    {
      icon: Dumbbell,
      title: 'Personalized Workouts',
      description: 'AI-generated exercise plans tailored to your specific sport, fitness level, and goals.'
    },
    {
      icon: Utensils,
      title: 'Nutrition Planning',
      description: 'Custom meal plans optimized for your training schedule, body composition, and dietary preferences.'
    },
    {
      icon: Brain,
      title: 'Adaptive Learning',
      description: 'The system evolves with you, adjusting recommendations based on your progress and feedback.'
    },
    {
      icon: BarChart2,
      title: 'Progress Tracking',
      description: 'Comprehensive analytics to visualize improvements and identify areas for growth.'
    },
    {
      icon: Users,
      title: 'Coach Integration',
      description: 'Seamless tools for coaches to manage multiple athletes and provide guidance.'
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Intelligent workout scheduling that adapts to your availability and recovery needs.'
    },
  ];

  // Additional features for the dedicated page
  const additionalFeatures = {
    athletes: [
      {
        icon: Zap,
        title: 'AI Workout Generation',
        description: 'Get personalized workout plans generated in seconds based on your goals, equipment, and time constraints.',
        isNew: true
      },
      {
        icon: Cloud,
        title: 'Offline Access',
        description: 'Access your workouts and nutrition plans even without internet connection.',
        isNew: true
      },
      {
        icon: Smartphone,
        title: 'Mobile Friendly',
        description: 'Take your training anywhere with our responsive mobile design optimized for on-the-go use.'
      },
      {
        icon: Lock,
        title: 'Privacy Focused',
        description: 'Your data is secure and private, with granular controls over what you share.'
      }
    ],
    coaches: [
      {
        icon: Users,
        title: 'Team Management',
        description: 'Manage your entire roster in one place with individual profiles and progress tracking.'
      },
      {
        icon: Calendar,
        title: 'Team Calendar',
        description: 'Schedule team workouts, events, and individual sessions with an intuitive calendar interface.'
      },
      {
        icon: BarChart2,
        title: 'Team Analytics',
        description: 'Get insights into team performance with comprehensive analytics and reporting tools.'
      },
      {
        icon: Sparkles,
        title: 'AI Training Suggestions',
        description: 'Receive AI-powered suggestions for team training based on collective performance data.',
        isNew: true
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-athleteBlue-900 to-athleteBlue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">Powerful Features for Athletes & Coaches</h1>
            <p className="text-xl leading-relaxed mb-8 opacity-90 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Discover how Athlete GPT's cutting-edge AI technology can transform your training experience with these powerful features.
            </p>
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Link to="/onboarding">
                <Button className="bg-white text-athleteBlue-700 hover:bg-gray-100 font-semibold px-6 py-6">
                  Experience All Features
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Core Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform provides everything you need to optimize your training and nutrition.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-gradient-to-r from-athleteBlue-500 to-athleteGreen-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="text-white h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Feature Showcase Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Specialized Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore features tailored for different user types.
            </p>
          </div>
          
          <Tabs defaultValue="athletes" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="athletes">For Athletes</TabsTrigger>
              <TabsTrigger value="coaches">For Coaches</TabsTrigger>
            </TabsList>
            
            <TabsContent value="athletes" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {additionalFeatures.athletes.map((feature, index) => (
                  <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-gradient-to-r from-athleteBlue-500 to-athleteGreen-500 w-12 h-12 rounded-lg flex items-center justify-center">
                          <feature.icon className="text-white h-6 w-6" />
                        </div>
                        {feature.isNew && (
                          <Badge className="bg-athleteGreen-500">NEW</Badge>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="coaches" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {additionalFeatures.coaches.map((feature, index) => (
                  <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-gradient-to-r from-athleteBlue-500 to-athleteGreen-500 w-12 h-12 rounded-lg flex items-center justify-center">
                          <feature.icon className="text-white h-6 w-6" />
                        </div>
                        {feature.isNew && (
                          <Badge className="bg-athleteGreen-500">NEW</Badge>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Feature Comparison Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Plan Comparison</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Compare our plans to find the perfect fit for your training needs.
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-4 border-b-2 border-gray-200">Feature</th>
                  <th className="p-4 border-b-2 border-gray-200">Free</th>
                  <th className="p-4 border-b-2 border-gray-200 bg-athleteBlue-50">Pro</th>
                  <th className="p-4 border-b-2 border-gray-200">Team</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 border-b border-gray-200 font-medium">AI Workout Generation</td>
                  <td className="p-4 border-b border-gray-200 text-center">Limited</td>
                  <td className="p-4 border-b border-gray-200 text-center bg-athleteBlue-50">Unlimited</td>
                  <td className="p-4 border-b border-gray-200 text-center">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200 font-medium">Nutrition Plans</td>
                  <td className="p-4 border-b border-gray-200 text-center">Basic</td>
                  <td className="p-4 border-b border-gray-200 text-center bg-athleteBlue-50">Advanced</td>
                  <td className="p-4 border-b border-gray-200 text-center">Advanced</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200 font-medium">Progress Tracking</td>
                  <td className="p-4 border-b border-gray-200 text-center">Basic</td>
                  <td className="p-4 border-b border-gray-200 text-center bg-athleteBlue-50">Advanced</td>
                  <td className="p-4 border-b border-gray-200 text-center">Advanced</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200 font-medium">Offline Access</td>
                  <td className="p-4 border-b border-gray-200 text-center">❌</td>
                  <td className="p-4 border-b border-gray-200 text-center bg-athleteBlue-50">✅</td>
                  <td className="p-4 border-b border-gray-200 text-center">✅</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200 font-medium">Team Management</td>
                  <td className="p-4 border-b border-gray-200 text-center">❌</td>
                  <td className="p-4 border-b border-gray-200 text-center bg-athleteBlue-50">❌</td>
                  <td className="p-4 border-b border-gray-200 text-center">✅</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200 font-medium">Analytics Dashboard</td>
                  <td className="p-4 border-b border-gray-200 text-center">Basic</td>
                  <td className="p-4 border-b border-gray-200 text-center bg-athleteBlue-50">Advanced</td>
                  <td className="p-4 border-b border-gray-200 text-center">Team + Individual</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="text-center mt-8">
            <Link to="/pricing">
              <Button className="bg-athleteBlue-600 hover:bg-athleteBlue-700 font-semibold">
                View Pricing Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-athleteBlue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience These Features?</h2>
            <p className="text-xl opacity-90 mb-8">
              Start your journey with Athlete GPT today and transform your training experience.
            </p>
            <Link to="/onboarding">
              <Button className="bg-white text-athleteBlue-900 hover:bg-gray-100 font-semibold px-6 py-6">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Features;
