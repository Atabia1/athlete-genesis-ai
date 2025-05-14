/**
 * Test Page
 * 
 * This is a minimal test page to verify that the application is working correctly.
 * It includes examples of various UI components to test that they render properly.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Check, Info, X } from 'lucide-react';

/**
 * TestPage Component
 * 
 * This component renders a test page with various UI components.
 */
const TestPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const [activeTab, setActiveTab] = useState('tab1');
  
  // Function to test error handling
  const testErrorHandling = () => {
    try {
      // Intentionally cause an error
      throw new Error('This is a test error');
    } catch (error) {
      console.error('Test error caught:', error);
      window.APP_ERROR_HANDLER?.displayErrorUI({
        message: 'Test error triggered manually',
        timestamp: new Date().toISOString(),
        source: 'TestPage',
        metadata: { test: true }
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Application Test Page</CardTitle>
          <CardDescription>
            This page tests various UI components to ensure they render correctly.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Test basic components */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Components</h2>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="default">Default Button</Button>
              <Button variant="destructive">Destructive Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="link">Link Button</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="test-input">Test Input</Label>
                <Input id="test-input" placeholder="Enter some text" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="test-switch">Test Switch</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="test-switch"
                    checked={switchValue}
                    onCheckedChange={setSwitchValue}
                  />
                  <span>{switchValue ? 'On' : 'Off'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Test tabs */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Tabs Component</h2>
            
            <Tabs defaultValue="tab1" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1" className="p-4 border rounded-md mt-2">
                <h3 className="font-medium">Tab 1 Content</h3>
                <p>This is the content for tab 1.</p>
              </TabsContent>
              <TabsContent value="tab2" className="p-4 border rounded-md mt-2">
                <h3 className="font-medium">Tab 2 Content</h3>
                <p>This is the content for tab 2.</p>
              </TabsContent>
              <TabsContent value="tab3" className="p-4 border rounded-md mt-2">
                <h3 className="font-medium">Tab 3 Content</h3>
                <p>This is the content for tab 3.</p>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Test dialog */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Dialog Component</h2>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Test Dialog</DialogTitle>
                  <DialogDescription>
                    This is a test dialog to verify that dialogs render correctly.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p>Dialog content goes here.</p>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsDialogOpen(false)}>
                    Continue
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Test popover */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Popover Component</h2>
            
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline">Open Popover</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h3 className="font-medium">Popover Title</h3>
                  <p>This is a test popover to verify that popovers render correctly.</p>
                  <Button size="sm" onClick={() => setIsPopoverOpen(false)}>
                    Close
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Test error handling */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Error Handling</h2>
            
            <Button variant="destructive" onClick={testErrorHandling}>
              Test Error Handling
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back
          </Button>
          <Button onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TestPage;
