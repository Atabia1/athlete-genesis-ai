import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Shield,
  Eye,
  EyeOff,
  Share2,
  UserPlus,
  QrCode,
  Copy,
  CheckCircle,
  Download,
  Settings
} from 'lucide-react';

const CoachSharing = () => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState('strength-program');
  const [shareMode, setShareMode] = useState('link');
  const [accessType, setAccessType] = useState('view');
  const [isPublic, setIsPublic] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const programs = [
    {
      id: 'strength-program',
      title: 'Advanced Strength Program',
      description: '12-week progressive overload program',
      type: 'workout',
      clients: 8,
      lastUpdated: '2024-01-15',
      isPublic: false
    },
    {
      id: 'nutrition-plan',
      title: 'Athlete Nutrition Plan',
      description: 'High-protein meal plan for muscle gain',
      type: 'nutrition',
      clients: 12,
      lastUpdated: '2024-01-20',
      isPublic: true
    },
    {
      id: 'recovery-protocol',
      title: 'Recovery Protocol',
      description: 'Post-workout recovery techniques',
      type: 'recovery',
      clients: 5,
      lastUpdated: '2024-01-25',
      isPublic: false
    }
  ];

  const handleCopyLink = () => {
    const shareLink = `https://athletegpt.com/share/${selectedProgram}?access=${accessType}`;
    
    try {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleInvite = () => {
    console.log(`Inviting ${inviteEmail} to ${selectedProgram} with ${accessType} access`);
    setInviteEmail('');
  };

  const handleDownload = () => {
    console.log(`Downloading ${selectedProgram} as PDF`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'workout':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Workout</Badge>;
      case 'nutrition':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Nutrition</Badge>;
      case 'recovery':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700">Recovery</Badge>;
      default:
        return <Badge variant="outline">Other</Badge>;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Share2 className="h-5 w-5 mr-2" />
            Coach Sharing Center
          </CardTitle>
          <CardDescription>
            Share your programs and plans with clients and other coaches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {programs.map((program) => (
                <Card key={program.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{program.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {program.description}
                        </CardDescription>
                      </div>
                      {getTypeIcon(program.type)}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {program.clients} clients
                      </div>
                      <div className="flex items-center">
                        {program.isPublic ? (
                          <Eye className="h-4 w-4 mr-1 text-green-500" />
                        ) : (
                          <EyeOff className="h-4 w-4 mr-1" />
                        )}
                        {program.isPublic ? 'Public' : 'Private'}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedProgram(program.id);
                          setShareDialogOpen(true);
                        }}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        onClick={handleDownload}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Sharing Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Default Access Level</h4>
                      <p className="text-sm text-gray-500">Set the default access for new shares</p>
                    </div>
                    <Select defaultValue="view">
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Access" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">View Only</SelectItem>
                        <SelectItem value="comment">Comment</SelectItem>
                        <SelectItem value="edit">Edit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Public Discovery</h4>
                      <p className="text-sm text-gray-500">Allow your public programs to be discovered</p>
                    </div>
                    <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Client Notifications</h4>
                      <p className="text-sm text-gray-500">Notify clients when you share programs</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Branding</h4>
                      <p className="text-sm text-gray-500">Include your branding on shared programs</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share Program</DialogTitle>
                <DialogDescription>
                  Share your program with clients or other coaches
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex justify-center space-x-4 py-4">
                <Button
                  variant={shareMode === 'link' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShareMode('link')}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Share Link
                </Button>
                <Button
                  variant={shareMode === 'invite' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShareMode('invite')}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite
                </Button>
                <Button
                  variant={shareMode === 'qr' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShareMode('qr')}
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  QR Code
                </Button>
              </div>
              
              {shareMode === 'link' && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Access Control</span>
                  </div>
                  
                  <Select value={accessType} onValueChange={setAccessType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select access type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">View Only</SelectItem>
                      <SelectItem value="comment">Comment</SelectItem>
                      <SelectItem value="edit">Edit</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="public-link" checked={isPublic} onCheckedChange={setIsPublic} />
                    <label htmlFor="public-link" className="text-sm font-medium">
                      Anyone with the link can access
                    </label>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button className="flex-1" onClick={handleCopyLink}>
                      {copied ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
              
              {shareMode === 'invite' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email Address</label>
                    <div className="flex mt-1">
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="client@example.com"
                        className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Button className="rounded-l-none" onClick={handleInvite}>
                        Invite
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Access Level</label>
                    <Select value={accessType} onValueChange={setAccessType} className="mt-1">
                      <SelectTrigger>
                        <SelectValue placeholder="Select access type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">View Only</SelectItem>
                        <SelectItem value="comment">Comment</SelectItem>
                        <SelectItem value="edit">Edit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Personal Message</label>
                    <Textarea
                      placeholder="Add a personal message to your invitation..."
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
              
              {shareMode === 'qr' && (
                <div className="space-y-4 flex flex-col items-center">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                      <QrCode className="h-24 w-24 text-gray-400" />
                    </div>
                  </div>
                  
                  <Button variant="outline" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download QR Code
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachSharing;
