/**
 * Discount Code Manager Component
 * 
 * This component allows administrators to:
 * - Create new discount codes
 * - View existing discount codes
 * - Deactivate discount codes
 * - Track discount code usage
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useFeatureAccess } from '@/context/FeatureAccessContext';
import paystackService, { DiscountCode, PaymentPlan } from '@/services/api/paystack-service';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';
import { 
  Tag, 
  Plus, 
  Trash2, 
  Calendar, 
  Percent, 
  DollarSign, 
  AlertCircle, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';

/**
 * Format date
 */
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Discount Code Manager Component
 */
const DiscountCodeManager = () => {
  const { user } = useAuth();
  const { isOwner } = useFeatureAccess();
  
  // State
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [selectedCode, setSelectedCode] = useState<DiscountCode | null>(null);
  
  // New discount code form state
  const [newCode, setNewCode] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    maxUses: 100,
    expiryDate: '',
    planIds: [] as string[],
    isActive: true
  });
  
  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load discount codes
        const codes = await paystackService.listDiscountCodes();
        setDiscountCodes(codes);
        
        // Load plans
        const availablePlans = await paystackService.listPlans();
        setPlans(availablePlans);
      } catch (error) {
        console.error('Error loading discount codes:', error);
        toast({
          title: 'Error loading data',
          description: 'We couldn\'t load the discount codes. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user && isOwner) {
      loadData();
    }
  }, [user, isOwner]);
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCode(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle type change
  const handleTypeChange = (value: string) => {
    setNewCode(prev => ({
      ...prev,
      type: value as 'percentage' | 'fixed'
    }));
  };
  
  // Handle plan selection
  const handlePlanSelection = (planId: string, checked: boolean) => {
    setNewCode(prev => {
      if (checked) {
        return {
          ...prev,
          planIds: [...prev.planIds, planId]
        };
      } else {
        return {
          ...prev,
          planIds: prev.planIds.filter(id => id !== planId)
        };
      }
    });
  };
  
  // Create discount code
  const handleCreateDiscountCode = async () => {
    try {
      setIsLoading(true);
      
      // Validate form
      if (!newCode.code) {
        throw new Error('Discount code is required');
      }
      
      if (newCode.value <= 0) {
        throw new Error('Discount value must be greater than 0');
      }
      
      if (newCode.type === 'percentage' && newCode.value > 100) {
        throw new Error('Percentage discount cannot exceed 100%');
      }
      
      // Create discount code
      const discountCode = await paystackService.createDiscountCode({
        code: newCode.code.toUpperCase(),
        type: newCode.type,
        value: newCode.type === 'fixed' ? newCode.value * 100 : newCode.value, // Convert to smallest currency unit for fixed amount
        maxUses: newCode.maxUses,
        expiryDate: newCode.expiryDate || undefined,
        planIds: newCode.planIds.length > 0 ? newCode.planIds : undefined,
        isActive: newCode.isActive
      });
      
      // Update state
      setDiscountCodes(prev => [...prev, discountCode]);
      
      // Reset form
      setNewCode({
        code: '',
        type: 'percentage',
        value: 0,
        maxUses: 100,
        expiryDate: '',
        planIds: [],
        isActive: true
      });
      
      // Close dialog
      setShowCreateDialog(false);
      
      // Show success toast
      toast({
        title: 'Discount code created',
        description: `Discount code ${discountCode.code} has been created successfully.`,
        variant: 'default',
      });
    } catch (error) {
      console.error('Error creating discount code:', error);
      toast({
        title: 'Error creating discount code',
        description: error instanceof Error ? error.message : 'An error occurred while creating the discount code.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Deactivate discount code
  const handleDeactivateDiscountCode = async () => {
    if (!selectedCode) return;
    
    try {
      setIsLoading(true);
      
      // Deactivate discount code
      await paystackService.deactivateDiscountCode(selectedCode.id);
      
      // Update state
      setDiscountCodes(prev => 
        prev.map(code => 
          code.id === selectedCode.id 
            ? { ...code, isActive: false } 
            : code
        )
      );
      
      // Close dialog
      setShowDeactivateDialog(false);
      setSelectedCode(null);
      
      // Show success toast
      toast({
        title: 'Discount code deactivated',
        description: `Discount code ${selectedCode.code} has been deactivated.`,
        variant: 'default',
      });
    } catch (error) {
      console.error('Error deactivating discount code:', error);
      toast({
        title: 'Error deactivating discount code',
        description: 'We couldn\'t deactivate the discount code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // If not owner, show access denied
  if (!isOwner) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access this page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <div className="ml-4">
              <h3 className="text-lg font-medium">Administrator Access Required</h3>
              <p className="text-gray-500">
                Only administrators can manage discount codes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Discount Code Management</h2>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Discount Code
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Discount Code</DialogTitle>
              <DialogDescription>
                Create a new discount code for your customers
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="code">Discount Code</Label>
                <Input
                  id="code"
                  name="code"
                  placeholder="e.g., SUMMER20"
                  value={newCode.code}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-gray-500">
                  This is the code customers will enter at checkout
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <RadioGroup value={newCode.type} onValueChange={handleTypeChange}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percentage" id="percentage" />
                    <Label htmlFor="percentage" className="flex items-center">
                      <Percent className="h-4 w-4 mr-2" />
                      Percentage
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed" className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Fixed Amount
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="value">
                  {newCode.type === 'percentage' ? 'Percentage (%)' : 'Amount'}
                </Label>
                <Input
                  id="value"
                  name="value"
                  type="number"
                  min="0"
                  max={newCode.type === 'percentage' ? '100' : undefined}
                  placeholder={newCode.type === 'percentage' ? '10' : '20'}
                  value={newCode.value || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxUses">Maximum Uses</Label>
                <Input
                  id="maxUses"
                  name="maxUses"
                  type="number"
                  min="1"
                  placeholder="100"
                  value={newCode.maxUses || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={newCode.expiryDate}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Applicable Plans (Optional)</Label>
                <p className="text-xs text-gray-500 mb-2">
                  If none selected, the discount applies to all plans
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {plans.map(plan => (
                    <div key={plan.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`plan-${plan.id}`}
                        checked={newCode.planIds.includes(plan.id)}
                        onCheckedChange={(checked) => 
                          handlePlanSelection(plan.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={`plan-${plan.id}`}>{plan.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={newCode.isActive}
                  onCheckedChange={(checked) => 
                    setNewCode(prev => ({ ...prev, isActive: checked }))
                  }
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateDiscountCode}
                disabled={isLoading || !newCode.code || newCode.value <= 0}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Discount Code'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Discount Codes</CardTitle>
          <CardDescription>
            Manage your discount codes and track their usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && discountCodes.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : discountCodes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {discountCodes.map(code => (
                  <TableRow key={code.id}>
                    <TableCell className="font-medium">{code.code}</TableCell>
                    <TableCell>
                      {code.type === 'percentage' ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          <Percent className="h-3 w-3 mr-1" />
                          Percentage
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <DollarSign className="h-3 w-3 mr-1" />
                          Fixed
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {code.type === 'percentage' ? (
                        `${code.value}%`
                      ) : (
                        `${(code.value / 100).toFixed(2)}`
                      )}
                    </TableCell>
                    <TableCell>
                      {code.usedCount} / {code.maxUses}
                    </TableCell>
                    <TableCell>
                      {code.expiryDate ? formatDate(code.expiryDate) : 'No expiry'}
                    </TableCell>
                    <TableCell>
                      {code.isActive ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {code.isActive && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCode(code);
                            setShowDeactivateDialog(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No Discount Codes</h3>
              <p className="text-gray-500 mt-2">
                You haven't created any discount codes yet.
              </p>
              <Button 
                className="mt-4"
                onClick={() => setShowCreateDialog(true)}
              >
                Create Your First Discount Code
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Deactivate Discount Code Dialog */}
      <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate Discount Code</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate the discount code "{selectedCode?.code}"? 
              Customers will no longer be able to use this code.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeactivateDiscountCode}
              className="bg-red-500 hover:bg-red-600"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DiscountCodeManager;
