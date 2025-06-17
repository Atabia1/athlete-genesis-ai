
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CheckCircle } from 'lucide-react';

export default function Payment() {
  const navigate = useNavigate();
  
  const paymentOptions = [
    {
      id: 'credit-card',
      label: 'Credit Card',
    },
    {
      id: 'paypal',
      label: 'PayPal',
    },
    {
      id: 'google-pay',
      label: 'Google Pay',
    },
  ];

  const billingPeriods = [
    {
      id: 'monthly',
      label: 'Monthly',
    },
    {
      id: 'yearly',
      label: 'Yearly',
    },
  ];

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentOptions[0].id);
  const [selectedPeriod, setSelectedBillingPeriod] = useState(billingPeriods[0].id);

  const handleSubmit = () => {
    console.log('Payment submitted');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Payment Details</CardTitle>
          <CardDescription className="text-center">
            Securely enter your payment information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Selected Plan</Label>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-3">
                <p className="font-semibold">Pro Plan</p>
                <p className="text-sm text-gray-500">You have selected the Pro Plan.</p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <RadioGroup defaultValue={selectedPaymentMethod} className="grid grid-cols-1 gap-2" onValueChange={setSelectedPaymentMethod}>
              {paymentOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} className="peer sr-only" />
                  <Label
                    htmlFor={option.id}
                    className="cursor-pointer peer-checked:bg-blue-50 peer-checked:text-blue-700 flex items-center justify-between w-full rounded-lg border p-4 font-normal shadow-sm transition-all hover:bg-gray-50 peer-checked:border-2 peer-checked:border-blue-500"
                  >
                    {option.label}
                    {selectedPaymentMethod === option.id && <CheckCircle className="w-5 h-5 ml-2 text-green-500" />}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Billing Period</Label>
            <RadioGroup defaultValue={selectedPeriod} className="grid grid-cols-2 gap-2" onValueChange={setSelectedBillingPeriod}>
              {billingPeriods.map((period) => (
                <div key={period.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={period.id} id={period.id} className="peer sr-only" />
                  <Label
                    htmlFor={period.id}
                    className="cursor-pointer peer-checked:bg-blue-50 peer-checked:text-blue-700 flex items-center justify-center w-full rounded-lg border p-4 font-normal shadow-sm transition-all hover:bg-gray-50 peer-checked:border-2 peer-checked:border-blue-500"
                  >
                    {period.label}
                    {selectedPeriod === period.id && <CheckCircle className="w-5 h-5 ml-2 text-green-500" />}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Button className="w-full" onClick={handleSubmit}>
            Confirm Payment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
