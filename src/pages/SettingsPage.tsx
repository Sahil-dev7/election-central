import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Lock, 
  Globe, 
  Palette,
  Shield,
  Save,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    electionAlerts: true,
    resultUpdates: true,
  });

  const [preferences, setPreferences] = useState({
    language: "hi",
    theme: "light",
    twoFactorAuth: false,
  });

  const handleSave = () => {
    toast({
      title: "सेटिंग्स सहेजी गईं",
      description: "आपकी प्राथमिकताएं सफलतापूर्वक अपडेट कर दी गई हैं।",
    });
  };

  return (
    <DashboardLayout userRole={user?.role || "voter"} userName={user?.name || "User"}>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <SettingsIcon className="w-6 h-6" />
            सेटिंग्स
          </h1>
          <p className="text-muted-foreground mt-1">
            अपनी खाता प्राथमिकताएं और सेटिंग्स प्रबंधित करें
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                प्रोफ़ाइल सेटिंग्स
              </CardTitle>
              <CardDescription>
                अपनी व्यक्तिगत जानकारी अपडेट करें
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">पूरा नाम</Label>
                <Input id="name" defaultValue={user?.name} placeholder="आपका नाम" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">ईमेल पता</Label>
                <Input id="email" type="email" defaultValue={user?.email} placeholder="email@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">मोबाइल नंबर</Label>
                <Input id="phone" placeholder="+91 98765 43210" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="voterId">मतदाता पहचान पत्र</Label>
                <Input id="voterId" placeholder="ABC1234567" disabled />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                सूचना सेटिंग्स
              </CardTitle>
              <CardDescription>
                अपनी अधिसूचना प्राथमिकताएं प्रबंधित करें
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">ईमेल सूचनाएं</p>
                  <p className="text-sm text-muted-foreground">ईमेल द्वारा अपडेट प्राप्त करें</p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, email: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS सूचनाएं</p>
                  <p className="text-sm text-muted-foreground">टेक्स्ट संदेश द्वारा अलर्ट</p>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, sms: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">चुनाव अलर्ट</p>
                  <p className="text-sm text-muted-foreground">नए चुनावों की सूचना</p>
                </div>
                <Switch
                  checked={notifications.electionAlerts}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, electionAlerts: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">परिणाम अपडेट</p>
                  <p className="text-sm text-muted-foreground">लाइव परिणाम की सूचना</p>
                </div>
                <Switch
                  checked={notifications.resultUpdates}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, resultUpdates: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                सुरक्षा सेटिंग्स
              </CardTitle>
              <CardDescription>
                अपने खाते की सुरक्षा प्रबंधित करें
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">दो-कारक प्रमाणीकरण</p>
                  <p className="text-sm text-muted-foreground">अतिरिक्त सुरक्षा परत</p>
                </div>
                <Switch
                  checked={preferences.twoFactorAuth}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, twoFactorAuth: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>पासवर्ड बदलें</Label>
                <Input type="password" placeholder="वर्तमान पासवर्ड" />
                <Input type="password" placeholder="नया पासवर्ड" />
                <Input type="password" placeholder="पासवर्ड की पुष्टि करें" />
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                प्राथमिकताएं
              </CardTitle>
              <CardDescription>
                अपनी प्रदर्शन प्राथमिकताएं कस्टमाइज़ करें
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>भाषा</Label>
                <Select
                  value={preferences.language}
                  onValueChange={(value) => 
                    setPreferences(prev => ({ ...prev, language: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hi">हिंदी</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ta">தமிழ்</SelectItem>
                    <SelectItem value="te">తెలుగు</SelectItem>
                    <SelectItem value="mr">मराठी</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>थीम</Label>
                <Select
                  value={preferences.theme}
                  onValueChange={(value) => 
                    setPreferences(prev => ({ ...prev, theme: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">लाइट</SelectItem>
                    <SelectItem value="dark">डार्क</SelectItem>
                    <SelectItem value="system">सिस्टम</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button variant="destructive" onClick={logout} className="sm:w-auto">
            <LogOut className="w-4 h-4 mr-2" />
            लॉग आउट
          </Button>
          <Button onClick={handleSave} className="sm:w-auto">
            <Save className="w-4 h-4 mr-2" />
            परिवर्तन सहेजें
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
