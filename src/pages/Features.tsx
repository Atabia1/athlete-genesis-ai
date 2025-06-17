
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Shield, 
  Users, 
  Brain, 
  Target, 
  BarChart3, 
  Calendar, 
  Trophy 
} from 'lucide-react';

export default function Features() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Unlock Your Athletic Potential
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the cutting-edge features that AthleteGPT offers to elevate your training and performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* AI Coaching Assistant */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>AI Coaching Assistant</span>
              </CardTitle>
              <CardDescription>
                Personalized guidance powered by advanced AI algorithms.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Receive real-time feedback, adaptive training plans, and insights tailored to your unique needs.
              </p>
            </CardContent>
          </Card>

          {/* Injury Prevention System */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Injury Prevention System</span>
              </CardTitle>
              <CardDescription>
                Advanced biomechanical analysis to minimize injury risk.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Utilize motion analysis and predictive modeling to identify potential issues before they become problems.
              </p>
            </CardContent>
          </Card>

          {/* Dynamic Training Plans */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Dynamic Training Plans</span>
              </CardTitle>
              <CardDescription>
                Training plans that adapt in real-time to your progress and feedback.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Experience a training regimen that evolves with you, ensuring optimal results and continuous improvement.
              </p>
            </CardContent>
          </Card>

          {/* AI-Driven Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>AI-Driven Insights</span>
              </CardTitle>
              <CardDescription>
                Unlock hidden patterns in your data with AI-powered analytics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Gain a deeper understanding of your performance through personalized insights and actionable recommendations.
              </p>
            </CardContent>
          </Card>

          {/* Goal Setting & Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Goal Setting & Tracking</span>
              </CardTitle>
              <CardDescription>
                Set ambitious goals and track your progress with precision.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Stay motivated and focused with intuitive tools that help you visualize your achievements and milestones.
              </p>
            </CardContent>
          </Card>

          {/* Performance Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Performance Analytics</span>
              </CardTitle>
              <CardDescription>
                Dive deep into your performance metrics with interactive charts and graphs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Analyze your strengths and weaknesses to optimize your training strategy and maximize your potential.
              </p>
            </CardContent>
          </Card>

          {/* Personalized Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Personalized Calendar</span>
              </CardTitle>
              <CardDescription>
                Plan your training sessions and track your progress over time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Stay organized and consistent with a dynamic calendar that adapts to your schedule and goals.
              </p>
            </CardContent>
          </Card>

          {/* Achievements & Rewards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Achievements & Rewards</span>
              </CardTitle>
              <CardDescription>
                Celebrate your successes and earn rewards for your hard work.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Stay motivated and engaged with a gamified experience that recognizes your achievements and milestones.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-gray-600 mb-6">
                Join AthleteGPT today and unlock your full athletic potential.
                Start your journey towards peak performance with our innovative AI-powered platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  Explore Pricing Plans
                </Button>
                <Button variant="outline" size="lg">
                  Sign Up for Free
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
