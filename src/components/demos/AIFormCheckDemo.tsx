
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

const AIFormCheckDemo = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    experience: 'beginner',
    goals: '',
    terms: false,
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    age: '',
    goals: '',
    terms: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<'success' | 'error' | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = 'checked' in e.target ? e.target.checked : false;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setFormErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: typeof formErrors = { ...formErrors };

    if (!formData.name) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!formData.age) {
      newErrors.age = 'Age is required';
      isValid = false;
    } else if (isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      newErrors.age = 'Age must be a positive number';
      isValid = false;
    }

    if (!formData.goals) {
      newErrors.goals = 'Goals are required';
      isValid = false;
    }

    if (!formData.terms) {
      newErrors.terms = 'You must accept the terms';
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionResult(null); // Reset previous result

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    // Simulate success/error randomly
    if (Math.random() > 0.5) {
      setSubmissionResult('success');
    } else {
      setSubmissionResult('error');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Form Check Demo</CardTitle>
        <CardDescription>
          This form demonstrates client-side validation and simulated submission.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john.doe@example.com"
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="30"
            />
            {formErrors.age && (
              <p className="text-red-500 text-sm mt-1">{formErrors.age}</p>
            )}
          </div>

          <div>
            <Label>Experience Level</Label>
            <RadioGroup
              defaultValue={formData.experience}
              onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="beginner" id="beginner" />
                <Label htmlFor="beginner">Beginner</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <Label htmlFor="intermediate">Intermediate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advanced" id="advanced" />
                <Label htmlFor="advanced">Advanced</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="goals">Goals</Label>
            <Textarea
              id="goals"
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              placeholder="What are your fitness goals?"
            />
            {formErrors.goals && (
              <p className="text-red-500 text-sm mt-1">{formErrors.goals}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
            />
            <Label htmlFor="terms">I agree to the terms and conditions</Label>
            {formErrors.terms && (
              <p className="text-red-500 text-sm mt-1">{formErrors.terms}</p>
            )}
          </div>

          <Button disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>

          {submissionResult === 'success' && (
            <div className="bg-green-100 text-green-800 p-2 rounded flex items-center">
              <CheckCircle className="mr-2 h-4 w-4" />
              Form submitted successfully!
            </div>
          )}

          {submissionResult === 'error' && (
            <div className="bg-red-100 text-red-800 p-2 rounded flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Form submission failed. Please try again.
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default AIFormCheckDemo;
