/**
 * DiscountCodeManager Component
 * 
 * Admin component for creating and managing discount codes.
 * Only available to owner accounts.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Schema for discount code validation
const discountCodeSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters'),
  percentage: z.number().min(1).max(100),
  maxUses: z.number().min(1),
  expiresAt: z.string().optional(),
  isActive: z.boolean().default(true),
});

type DiscountCodeFormValues = z.infer<typeof discountCodeSchema>;

// Mock data for discount codes
const mockDiscountCodes = [
  { id: '1', code: 'WELCOME20', percentage: 20, maxUses: 100, usedCount: 45, isActive: true },
  { id: '2', code: 'SUMMER30', percentage: 30, maxUses: 50, usedCount: 32, isActive: true },
  { id: '3', code: 'SPECIAL50', percentage: 50, maxUses: 20, usedCount: 20, isActive: false },
];

/**
 * DiscountCodeManager Component
 */
const DiscountCodeManager = () => {
  const [discountCodes, setDiscountCodes] = useState(mockDiscountCodes);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [codeToDelete, setCodeToDelete] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form setup
  const form = useForm<DiscountCodeFormValues>({
    resolver: zodResolver(discountCodeSchema),
    defaultValues: {
      code: '',
      percentage: 10,
      maxUses: 100,
      isActive: true,
    },
  });

  // Handle form submission
  const onSubmit = (values: DiscountCodeFormValues) => {
    try {
      setSubmitError(null);
      
      // In a real app, this would be an API call
      const newCode = {
        id: Date.now().toString(),
        code: values.code.toUpperCase(),
        percentage: values.percentage,
        maxUses: values.maxUses,
        usedCount: 0,
        isActive: values.isActive,
        expiresAt: values.expiresAt,
      };
      
      setDiscountCodes([...discountCodes, newCode]);
      form.reset();
      setSubmitSuccess(true);
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
      
    } catch (error) {
      setSubmitError('Failed to create discount code. Please try again.');
      console.error('Error creating discount code:', error);
    }
  };

  // Delete a discount code
  const confirmDelete = (id: string) => {
    setCodeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (codeToDelete) {
      setDiscountCodes(discountCodes.filter(code => code.id !== codeToDelete));
      setDeleteDialogOpen(false);
      setCodeToDelete(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add Discount Code</CardTitle>
          <CardDescription>
            Create new discount codes for your subscription plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Code</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., WELCOME20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Percentage</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1} 
                          max={100} 
                          {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxUses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Uses</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1}
                          {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiresAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date (Optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Make this discount code available for use
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {submitError && (
                <Alert variant="destructive">
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}

              {submitSuccess && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <AlertDescription>
                    Discount code created successfully!
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Discount Code
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Discount Codes</CardTitle>
          <CardDescription>
            Manage your existing discount codes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discountCodes.map((code) => (
                <TableRow key={code.id}>
                  <TableCell className="font-medium">{code.code}</TableCell>
                  <TableCell>{code.percentage}%</TableCell>
                  <TableCell>
                    {code.usedCount} / {code.maxUses}
                  </TableCell>
                  <TableCell>
                    {code.isActive ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => confirmDelete(code.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this discount code. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DiscountCodeManager;
