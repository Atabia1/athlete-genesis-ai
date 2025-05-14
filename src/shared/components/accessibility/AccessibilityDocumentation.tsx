/**
 * AccessibilityDocumentation Component
 * 
 * This component displays the accessibility documentation in the application.
 * It's useful for developers and testers who need to understand the accessibility
 * features and guidelines.
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/shared/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { FileText, Code, CheckSquare, HelpCircle } from 'lucide-react';

interface AccessibilityDocumentationProps {
  /** Whether the documentation dialog is open */
  open?: boolean;
  /** Callback when the dialog is opened or closed */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Component that displays accessibility documentation
 */
export function AccessibilityDocumentation({
  open,
  onOpenChange,
}: AccessibilityDocumentationProps) {
  const [documentation, setDocumentation] = useState<string>('');

  // Fetch the documentation when the component mounts
  useEffect(() => {
    fetch('/src/shared/docs/ACCESSIBILITY.md')
      .then(response => response.text())
      .then(text => {
        setDocumentation(text);
      })
      .catch(error => {
        console.error('Failed to load accessibility documentation:', error);
        setDocumentation('Failed to load documentation. Please check the console for errors.');
      });
  }, []);

  // Parse the markdown into sections
  const sections = {
    introduction: extractSection(documentation, '## Introduction', '## Accessibility Features'),
    features: extractSection(documentation, '## Accessibility Features', '## Development Guidelines'),
    guidelines: extractSection(documentation, '## Development Guidelines', '## Testing'),
    testing: extractSection(documentation, '## Testing', '## Resources'),
    resources: extractSection(documentation, '## Resources', '')
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Accessibility Documentation
          </DialogTitle>
          <DialogDescription>
            Guidelines and resources for implementing accessibility features in the application.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="introduction" className="flex-1 overflow-hidden">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="introduction">
              <HelpCircle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Introduction</span>
            </TabsTrigger>
            <TabsTrigger value="features">
              <CheckSquare className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Features</span>
            </TabsTrigger>
            <TabsTrigger value="guidelines">
              <Code className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Guidelines</span>
            </TabsTrigger>
            <TabsTrigger value="testing">
              <CheckSquare className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Testing</span>
            </TabsTrigger>
            <TabsTrigger value="resources">
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Resources</span>
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4">
            <TabsContent value="introduction" className="markdown-content">
              <MarkdownContent content={sections.introduction} />
            </TabsContent>
            <TabsContent value="features" className="markdown-content">
              <MarkdownContent content={sections.features} />
            </TabsContent>
            <TabsContent value="guidelines" className="markdown-content">
              <MarkdownContent content={sections.guidelines} />
            </TabsContent>
            <TabsContent value="testing" className="markdown-content">
              <MarkdownContent content={sections.testing} />
            </TabsContent>
            <TabsContent value="resources" className="markdown-content">
              <MarkdownContent content={sections.resources} />
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * AccessibilityDocumentationButton Component
 * 
 * This component provides a button to open the accessibility documentation.
 */
export function AccessibilityDocumentationButton({
  className,
}: {
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className={className}
      >
        <FileText className="h-4 w-4 mr-2" />
        Accessibility Docs
      </Button>
      <AccessibilityDocumentation
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}

/**
 * Extract a section from the markdown content
 */
function extractSection(content: string, startHeading: string, endHeading: string): string {
  const startIndex = content.indexOf(startHeading);
  if (startIndex === -1) return '';

  const endIndex = endHeading ? content.indexOf(endHeading) : content.length;
  if (endIndex === -1) return content.slice(startIndex);

  return content.slice(startIndex, endIndex);
}

/**
 * Simple markdown renderer
 */
function MarkdownContent({ content }: { content: string }) {
  // This is a very simple markdown renderer
  // In a real application, you would use a proper markdown library
  const html = content
    // Convert headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Convert lists
    .replace(/^\* (.*$)/gm, '<li>$1</li>')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.*$)/gm, '<li>$2</li>')
    // Convert code blocks
    .replace(/```(.+?)```/gs, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Convert paragraphs
    .replace(/\n\n/g, '</p><p>')
    // Convert links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  return (
    <div
      className="prose prose-sm dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: `<p>${html}</p>` }}
    />
  );
}

/**
 * Example usage:
 * 
 * function DeveloperTools() {
 *   return (
 *     <div>
 *       <h2>Developer Tools</h2>
 *       <div className="flex gap-2">
 *         <AccessibilityDocumentationButton />
 *         <OtherDevTools />
 *       </div>
 *     </div>
 *   );
 * }
 */
