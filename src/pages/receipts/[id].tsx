
/**
 * Receipt Page
 * 
 * This page displays a receipt for a payment transaction.
 * It can be accessed directly via URL or opened in a new tab from the payment history.
 */

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import paystackService, { PaystackTransaction } from '@/services/api/paystack-service';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Printer, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

/**
 * Format date
 */
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format time
 */
const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * Format amount
 */
const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2
  }).format(amount / 100);
};

/**
 * Receipt Page Component
 */
const ReceiptPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [transaction, setTransaction] = useState<PaystackTransaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load transaction data
  useEffect(() => {
    const loadTransaction = async () => {
      if (!id) {
        setError('Transaction ID is required');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Verify transaction
        const transactionData = await paystackService.verifyTransaction(id);
        
        // Check if the transaction belongs to the current user
        if (transactionData.customer.email !== user?.email) {
          setError('You do not have permission to view this receipt');
          setIsLoading(false);
          return;
        }
        
        setTransaction(transactionData);
      } catch (error) {
        console.error('Error loading transaction:', error);
        setError('Failed to load transaction details');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      loadTransaction();
    }
  }, [id, user]);
  
  // Handle print receipt
  const handlePrintReceipt = () => {
    window.print();
  };
  
  // Handle download receipt as PDF
  const handleDownloadReceipt = () => {
    // In a real implementation, you would generate a PDF
    // For this example, we'll just show a toast
    toast({
      title: 'Receipt downloaded',
      description: 'Your receipt has been downloaded as a PDF.',
      variant: 'default',
    });
  };
  
  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium">Loading Receipt</h3>
          <p className="text-gray-500 mt-2">
            Please wait while we load your receipt...
          </p>
        </div>
      </div>
    );
  }
  
  // If error, show error state
  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center">
              <AlertCircle className="h-6 w-6 mr-2" />
              Error Loading Receipt
            </CardTitle>
            <CardDescription>
              We encountered an error while loading your receipt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{error}</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // If no transaction, show not found state
  if (!transaction) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-gray-600 flex items-center">
              <AlertCircle className="h-6 w-6 mr-2" />
              Receipt Not Found
            </CardTitle>
            <CardDescription>
              We couldn't find the receipt you're looking for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              The transaction ID may be invalid or you may not have permission to view this receipt.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-12 px-4 print:py-0 print:px-0">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6 print:hidden">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handlePrintReceipt}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={handleDownloadReceipt}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
        
        <Card className="border-2 print:border-0 print:shadow-none">
          <CardHeader className="text-center border-b">
            <div className="flex justify-center mb-2">
              <img 
                src="/logo.png" 
                alt="Athlete GPT" 
                className="h-12 w-auto" 
              />
            </div>
            <CardTitle className="text-2xl">Payment Receipt</CardTitle>
            <CardDescription>
              Thank you for your payment
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex justify-center">
                {transaction.status === 'success' ? (
                  <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2 text-base flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Payment Successful
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800 border-red-200 px-4 py-2 text-base flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Payment Failed
                  </Badge>
                )}
              </div>
              
              {/* Transaction Details */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-900 mb-3">Transaction Details</h3>
                <div className="grid grid-cols-2 gap-y-3">
                  <div className="text-gray-600">Reference:</div>
                  <div className="font-mono">{transaction.reference}</div>
                  
                  <div className="text-gray-600">Date:</div>
                  <div>{formatDate(transaction.created_at)}</div>
                  
                  <div className="text-gray-600">Time:</div>
                  <div>{formatTime(transaction.created_at)}</div>
                  
                  <div className="text-gray-600">Type:</div>
                  <div>{transaction.plan ? 'Subscription' : 'One-time Payment'}</div>
                  
                  {transaction.plan && (
                    <>
                      <div className="text-gray-600">Plan:</div>
                      <div>{transaction.plan}</div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Customer Details */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Customer Details</h3>
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="text-gray-600">Email:</div>
                  <div>{transaction.customer.email}</div>
                </div>
              </div>
              
              <Separator />
              
              {/* Payment Details */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Payment Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>{formatAmount(transaction.amount)}</span>
                  </div>
                </div>
              </div>
              
              {/* Payment Method */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-900 mb-3">Payment Method</h3>
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="font-medium">Card Payment</p>
                    {transaction.authorization?.last4 && (
                      <p className="text-gray-600 text-sm">
                        **** **** **** {transaction.authorization.last4}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex-col border-t pt-6">
            <p className="text-center text-gray-500 text-sm mb-2">
              This is an automatically generated receipt. For any questions, please contact support.
            </p>
            <p className="text-center text-gray-400 text-xs">
              Athlete GPT • Receipt #{transaction.id} • {formatDate(transaction.created_at)}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ReceiptPage;
