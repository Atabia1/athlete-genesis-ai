import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useUser } from '@/context/UserContext';
import {
  User,
  Mail,
  Lock,
  Calendar,
  MapPin,
  Phone,
  Weight,
  Ruler,
  Activity,
  Heart,
  ArrowRight,
  Info,
  Globe,
  Flag
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';

// Define the form schema with Zod
const signUpSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),

  // Demographics
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "non-binary", "prefer-not-to-say"]).optional(),
  country: z.string().optional(),

  // Physical Attributes
  height: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  heightUnit: z.enum(["cm", "ft"]).default("cm"),
  weightUnit: z.enum(["kg", "lb"]).default("kg"),

  // Health Information
  activityLevel: z.enum(["sedentary", "lightly-active", "moderately-active", "very-active", "extremely-active"]).optional(),
  sleepHours: z.number().min(1).max(24).optional(),

  // Preferences
  notificationPreferences: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    sms: z.boolean().default(false),
  }),

  // Terms and Privacy
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Type for the form values
type SignUpFormValues = z.infer<typeof signUpSchema>;

// Country options
const countries = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "au", label: "Australia" },
  { value: "ng", label: "Nigeria" },
  { value: "gh", label: "Ghana" },
  { value: "za", label: "South Africa" },
  { value: "ke", label: "Kenya" },
  { value: "in", label: "India" },
  { value: "cn", label: "China" },
  { value: "jp", label: "Japan" },
  { value: "br", label: "Brazil" },
  { value: "mx", label: "Mexico" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "it", label: "Italy" },
  { value: "es", label: "Spain" },
  { value: "ru", label: "Russia" },
  // Add more countries as needed
];

// Activity level options with descriptions
const activityLevels = [
  {
    value: "sedentary",
    label: "Sedentary",
    description: "Little to no exercise, desk job"
  },
  {
    value: "lightly-active",
    label: "Lightly Active",
    description: "Light exercise 1-3 days/week"
  },
  {
    value: "moderately-active",
    label: "Moderately Active",
    description: "Moderate exercise 3-5 days/week"
  },
  {
    value: "very-active",
    label: "Very Active",
    description: "Hard exercise 6-7 days/week"
  },
  {
    value: "extremely-active",
    label: "Extremely Active",
    description: "Hard daily exercise & physical job or training twice daily"
  },
];

/**
 * SignUp Component
 *
 * A comprehensive sign-up page that collects detailed user information
 * before starting the onboarding process.
 */
const SignUp = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account");

  // Initialize the form with default values
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      heightUnit: "cm",
      weightUnit: "kg",
      notificationPreferences: {
        email: true,
        push: true,
        sms: false,
      },
      acceptTerms: false,
    },
  });

  // Get the setUserProfile function from the UserContext
  const { setUserProfile } = useUser();

  // Handle form submission
  const onSubmit = (values: SignUpFormValues) => {
    console.log("Form values:", values);

    // Create a new user profile
    const now = new Date().toISOString();
    const userProfile = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      dateOfBirth: values.dateOfBirth,
      gender: values.gender,
      country: values.country,
      height: values.height,
      weight: values.weight,
      heightUnit: values.heightUnit,
      weightUnit: values.weightUnit,
      activityLevel: values.activityLevel,
      sleepHours: values.sleepHours,
      notificationPreferences: values.notificationPreferences,
      createdAt: now,
      lastUpdated: now,
    };

    // Save user data to context (which will also save to localStorage)
    setUserProfile(userProfile);

    // Show success toast
    toast({
      title: "Account created!",
      description: "Your account has been created successfully. Let's start your fitness journey!",
      variant: "default",
    });

    // Navigate to the onboarding flow
    navigate('/onboarding');
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Handle continue button click
  const handleContinue = () => {
    if (activeTab === "account") {
      // Validate account fields
      const accountFields = ["firstName", "lastName", "email", "password", "confirmPassword"];
      const isValid = accountFields.every(field => {
        const result = form.trigger(field as any);
        return result;
      });

      if (isValid) {
        setActiveTab("physical");
      }
    } else if (activeTab === "physical") {
      setActiveTab("preferences");
    } else if (activeTab === "preferences") {
      form.handleSubmit(onSubmit)();
    }
  };

  // Handle back button click
  const handleBack = () => {
    if (activeTab === "physical") {
      setActiveTab("account");
    } else if (activeTab === "preferences") {
      setActiveTab("physical");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Join Athlete GPT</h1>
          <p className="text-gray-600 mt-2">
            Create your account to start your personalized fitness journey
          </p>
        </div>

        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Fill in your details to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                  <TabsList className="grid grid-cols-3 mb-8">
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="physical">Physical Profile</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  </TabsList>

                  {/* Account Information Tab */}
                  <TabsContent value="account" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input className="pl-10" placeholder="John" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input className="pl-10" placeholder="Doe" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input className="pl-10" type="email" placeholder="john.doe@example.com" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input className="pl-10" type="password" {...field} />
                              </div>
                            </FormControl>
                            <FormDescription>
                              At least 8 characters with uppercase, lowercase, and numbers
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input className="pl-10" type="password" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  {/* Physical Profile Tab */}
                  <TabsContent value="physical" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input className="pl-10" type="date" {...field} />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Used to calculate age-appropriate workouts
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <div className="flex items-center space-x-6">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="male" id="male" />
                                    <Label htmlFor="male">Male</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="female" id="female" />
                                    <Label htmlFor="female">Female</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="non-binary" id="non-binary" />
                                    <Label htmlFor="non-binary">Non-binary</Label>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="prefer-not-to-say" id="prefer-not-to-say" />
                                  <Label htmlFor="prefer-not-to-say">Prefer not to say</Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormDescription>
                              Used for personalized fitness recommendations
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <div className="relative">
                                <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                                <SelectTrigger className="pl-10">
                                  <SelectValue placeholder="Select your country" />
                                </SelectTrigger>
                              </div>
                            </FormControl>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country.value} value={country.value}>
                                  <div className="flex items-center">
                                    <Flag className="h-4 w-4 mr-2" />
                                    {country.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Used for regional workout recommendations
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <FormLabel>Height</FormLabel>
                          <div className="flex items-center space-x-2">
                            <FormField
                              control={form.control}
                              name="heightUnit"
                              render={({ field }) => (
                                <FormItem className="space-y-0">
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="flex items-center space-x-2"
                                    >
                                      <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="cm" id="cm" />
                                        <Label htmlFor="cm">cm</Label>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="ft" id="ft" />
                                        <Label htmlFor="ft">ft</Label>
                                      </div>
                                    </RadioGroup>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        <FormField
                          control={form.control}
                          name="height"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="relative">
                                  <Ruler className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input
                                    className="pl-10"
                                    type="number"
                                    placeholder={form.watch("heightUnit") === "cm" ? "175" : "5.9"}
                                    {...field}
                                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <FormLabel>Weight</FormLabel>
                          <div className="flex items-center space-x-2">
                            <FormField
                              control={form.control}
                              name="weightUnit"
                              render={({ field }) => (
                                <FormItem className="space-y-0">
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="flex items-center space-x-2"
                                    >
                                      <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="kg" id="kg" />
                                        <Label htmlFor="kg">kg</Label>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="lb" id="lb" />
                                        <Label htmlFor="lb">lb</Label>
                                      </div>
                                    </RadioGroup>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        <FormField
                          control={form.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="relative">
                                  <Weight className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input
                                    className="pl-10"
                                    type="number"
                                    placeholder={form.watch("weightUnit") === "kg" ? "70" : "154"}
                                    {...field}
                                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Preferences Tab */}
                  <TabsContent value="preferences" className="space-y-6">
                    <FormField
                      control={form.control}
                      name="activityLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Activity Level</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-3"
                            >
                              {activityLevels.map((level) => (
                                <div key={level.value} className="flex items-start space-x-2">
                                  <RadioGroupItem value={level.value} id={level.value} className="mt-1" />
                                  <div>
                                    <Label htmlFor={level.value} className="font-medium">{level.label}</Label>
                                    <p className="text-sm text-gray-500">{level.description}</p>
                                  </div>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormDescription>
                            Used to calculate your daily calorie needs
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sleepHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Average Sleep Hours</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Activity className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                className="pl-10"
                                type="number"
                                placeholder="7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Used to optimize recovery recommendations
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-3">
                      <FormLabel>Notification Preferences</FormLabel>
                      <FormField
                        control={form.control}
                        name="notificationPreferences.email"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Email Notifications</FormLabel>
                              <FormDescription>
                                Receive workout reminders and tips via email
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="notificationPreferences.push"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Push Notifications</FormLabel>
                              <FormDescription>
                                Receive workout reminders and tips via push notifications
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="notificationPreferences.sms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>SMS Notifications</FormLabel>
                              <FormDescription>
                                Receive workout reminders and tips via SMS
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator className="my-4" />

                    <FormField
                      control={form.control}
                      name="acceptTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Accept Terms and Conditions</FormLabel>
                            <FormDescription>
                              I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            {activeTab !== "account" && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            {activeTab === "account" && (
              <div></div> // Empty div to maintain spacing with justify-between
            )}
            <Button
              onClick={handleContinue}
              className="bg-athleteBlue-600 hover:bg-athleteBlue-700"
            >
              {activeTab === "preferences" ? "Create Account" : "Continue"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
