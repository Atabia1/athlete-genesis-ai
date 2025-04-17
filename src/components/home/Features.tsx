
import { Dumbbell, Utensils, Brain, BarChart2, Users, Calendar } from 'lucide-react';

const features = [
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

const Features = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Athletes</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform provides everything you need to optimize your training and nutrition.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="bg-gradient-to-r from-athleteBlue-500 to-athleteGreen-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="text-white h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
