
/**
 * Accessibility Documentation Component
 * 
 * This component provides comprehensive documentation about accessibility
 * features and guidelines for the application.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Info, ExternalLink } from 'lucide-react';

export function AccessibilityDocumentation() {
  const features = [
    {
      title: 'Keyboard Navigation',
      status: 'implemented',
      description: 'Full keyboard support for all interactive elements',
      details: [
        'Tab navigation through all focusable elements',
        'Arrow key navigation in menus and lists',
        'Enter and Space activation for buttons',
        'Escape key to close modals and dropdowns'
      ]
    },
    {
      title: 'Screen Reader Support',
      status: 'implemented',
      description: 'Comprehensive ARIA labels and semantic markup',
      details: [
        'Proper heading hierarchy (h1-h6)',
        'ARIA labels for interactive elements',
        'Live regions for dynamic content',
        'Descriptive alt text for images'
      ]
    },
    {
      title: 'High Contrast Mode',
      status: 'implemented',
      description: 'Enhanced visibility for users with visual impairments',
      details: [
        'Increased color contrast ratios',
        'Clear focus indicators',
        'Readable text on all backgrounds',
        'Distinctive interactive elements'
      ]
    },
    {
      title: 'Reduced Motion',
      status: 'implemented',
      description: 'Respect for users who prefer reduced motion',
      details: [
        'Disabled animations when requested',
        'Static alternatives to moving content',
        'Reduced parallax effects',
        'Instant transitions option'
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'implemented':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'partial':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'implemented':
        return <Badge variant="default" className="bg-green-100 text-green-800">Implemented</Badge>;
      case 'partial':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Partial</Badge>;
      default:
        return <Badge variant="outline">Planned</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Accessibility Documentation</h1>
        <p className="text-gray-600">
          Our commitment to making the application accessible to all users.
        </p>
      </div>

      <div className="grid gap-6">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(feature.status)}
                  {feature.title}
                </CardTitle>
                {getStatusBadge(feature.status)}
              </div>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feature.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{detail}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Additional Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold">WCAG 2.1 Guidelines</h4>
              <p className="text-sm text-gray-600">
                We follow the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Keyboard Shortcuts</h4>
              <p className="text-sm text-gray-600">
                Press Alt + A to open accessibility settings from anywhere in the application.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Screen Reader Testing</h4>
              <p className="text-sm text-gray-600">
                This application has been tested with NVDA, JAWS, and VoiceOver.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AccessibilityDocumentation;
