import { Link } from 'react-router-dom';
import { ArrowRight, Award, Users, Target, Heart, Zap, Globe } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-athleteBlue-900 to-athleteBlue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">Our Mission</h1>
            <p className="text-xl leading-relaxed mb-8 opacity-90 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              At Athlete GPT, we're revolutionizing how athletes train by combining cutting-edge AI with sports science to create truly personalized training experiences that adapt to your unique needs.
            </p>
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Link to="/signup">
                <Button className="bg-white text-athleteBlue-700 hover:bg-gray-100 font-semibold px-6 py-6">
                  Join Our Community
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Athlete GPT was born from a simple observation: traditional training plans don't adapt to the individual needs of athletes. Our founders, a team of sports scientists, AI researchers, and former professional athletes, set out to change that.
              </p>
              <p className="text-gray-700 mb-4">
                We started in 2021 with a mission to democratize access to elite-level training by harnessing the power of artificial intelligence. What began as a research project quickly evolved into a comprehensive platform used by thousands of athletes worldwide.
              </p>
              <p className="text-gray-700">
                Today, we're proud to support athletes of all levels—from weekend warriors to Olympic competitors—with personalized training that evolves as they do.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full bg-athleteGreen-500 rounded-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-athleteBlue-400 rounded-xl"></div>
              <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=2187&auto=format&fit=crop"
                  alt="Athletes training together"
                  className="w-full h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at Athlete GPT.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Personalization",
                description: "We believe that every athlete is unique. Our AI adapts to your specific needs, goals, and constraints."
              },
              {
                icon: Award,
                title: "Excellence",
                description: "We're committed to providing the highest quality training guidance based on the latest sports science."
              },
              {
                icon: Heart,
                title: "Accessibility",
                description: "We're dedicated to making elite-level training accessible to athletes of all levels and backgrounds."
              },
              {
                icon: Users,
                title: "Community",
                description: "We foster a supportive community where athletes can learn from and inspire each other."
              },
              {
                icon: Zap,
                title: "Innovation",
                description: "We continuously push the boundaries of what's possible with AI in sports training."
              },
              {
                icon: Globe,
                title: "Inclusivity",
                description: "We design our platform to be inclusive and supportive of athletes from all walks of life."
              }
            ].map((value, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-gradient-to-r from-athleteBlue-500 to-athleteGreen-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <value.icon className="text-white h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're a diverse team of athletes, engineers, and sports scientists passionate about transforming athletic training.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "CEO & Co-Founder",
                bio: "Former Olympic swimmer with a passion for sports technology",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop"
              },
              {
                name: "Michael Chen",
                role: "CTO & Co-Founder",
                bio: "AI researcher with a background in computer vision and machine learning",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop"
              },
              {
                name: "Jamal Williams",
                role: "Head of Sports Science",
                bio: "PhD in Exercise Physiology with 15+ years of coaching experience",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop"
              },
              {
                name: "Elena Rodriguez",
                role: "Lead UX Designer",
                bio: "Passionate about creating intuitive experiences for athletes",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop"
              }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <Avatar className="w-32 h-32 mx-auto mb-4">
                  <AvatarImage src={member.image} alt={member.name} />
                  <AvatarFallback className="bg-athleteBlue-100 text-athleteBlue-700 text-xl">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-athleteBlue-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-athleteBlue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Us on This Journey</h2>
            <p className="text-xl opacity-90 mb-8">
              Experience the future of athletic training with Athlete GPT. Start your personalized journey today.
            </p>
            <Link to="/signup">
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

export default About;
