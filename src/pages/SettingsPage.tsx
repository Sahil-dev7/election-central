import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield,
  Palette,
  Save,
  LogOut,
  Moon,
  Sun,
  Monitor,
  Check
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
    electionAlerts: true,
    resultUpdates: true,
  });

  const [preferences, setPreferences] = useState({
    language: "hi",
    theme: "light",
    twoFactorAuth: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  // Apply theme on change
  useEffect(() => {
    const root = document.documentElement;
    if (preferences.theme === 'dark') {
      root.classList.add('dark');
    } else if (preferences.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    }
  }, [preferences.theme]);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
    toast({
      title: "सेटिंग्स सहेजी गईं",
      description: "आपकी प्राथमिकताएं सफलतापूर्वक अपडेट कर दी गई हैं।",
    });
  };

  const themeOptions = [
    { value: "light", label: "लाइट", icon: Sun },
    { value: "dark", label: "डार्क", icon: Moon },
    { value: "system", label: "सिस्टम", icon: Monitor },
  ];

  return (
    <DashboardLayout userRole={user?.role || "voter"} userName={user?.name || "User"}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-white" />
            </div>
            सेटिंग्स
          </h1>
          <p className="text-muted-foreground">
            अपनी खाता प्राथमिकताएं और सेटिंग्स प्रबंधित करें
          </p>
        </motion.div>

        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="border-b border-border/50 bg-secondary/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">प्रोफ़ाइल सेटिंग्स</CardTitle>
                  <CardDescription>अपनी व्यक्तिगत जानकारी अपडेट करें</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">पूरा नाम</Label>
                  <Input 
                    id="name" 
                    defaultValue={user?.name} 
                    placeholder="आपका नाम"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">ईमेल पता</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    defaultValue={user?.email} 
                    placeholder="email@example.com"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">मोबाइल नंबर</Label>
                  <Input 
                    id="phone" 
                    placeholder="+91 98765 43210"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="voterId" className="text-sm font-medium">मतदाता पहचान पत्र</Label>
                  <Input 
                    id="voterId" 
                    placeholder="ABC1234567" 
                    disabled 
                    className="h-11 bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appearance Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="border-b border-border/50 bg-secondary/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg">प्रदर्शन और भाषा</CardTitle>
                  <CardDescription>थीम और भाषा सेटिंग्स कस्टमाइज़ करें</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Theme Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">थीम चुनें</Label>
                <div className="grid grid-cols-3 gap-3">
                  {themeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setPreferences(prev => ({ ...prev, theme: option.value }))}
                      className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                        preferences.theme === option.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 hover:bg-secondary/50"
                      }`}
                    >
                      {preferences.theme === option.value && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                      <option.icon className={`w-6 h-6 ${preferences.theme === option.value ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`text-sm font-medium ${preferences.theme === option.value ? "text-primary" : "text-foreground"}`}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Language Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">भाषा</Label>
                <Select
                  value={preferences.language}
                  onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger className="h-11 max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hi">हिंदी</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ta">தமிழ்</SelectItem>
                    <SelectItem value="te">తెలుగు</SelectItem>
                    <SelectItem value="mr">मराठी</SelectItem>
                    <SelectItem value="bn">বাংলা</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="border-b border-border/50 bg-secondary/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-election-blue/20 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-election-blue" />
                </div>
                <div>
                  <CardTitle className="text-lg">सूचना सेटिंग्स</CardTitle>
                  <CardDescription>अपनी अधिसूचना प्राथमिकताएं प्रबंधित करें</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[
                  { key: "email", label: "ईमेल सूचनाएं", description: "महत्वपूर्ण अपडेट ईमेल द्वारा प्राप्त करें" },
                  { key: "sms", label: "SMS सूचनाएं", description: "टेक्स्ट संदेश द्वारा अलर्ट प्राप्त करें" },
                  { key: "electionAlerts", label: "चुनाव अलर्ट", description: "नए चुनावों की सूचना प्राप्त करें" },
                  { key: "resultUpdates", label: "परिणाम अपडेट", description: "लाइव परिणामों की सूचना प्राप्त करें" },
                ].map((item, index) => (
                  <div key={item.key}>
                    <div className="flex items-center justify-between py-3">
                      <div className="space-y-0.5">
                        <p className="font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch
                        checked={notifications[item.key as keyof typeof notifications]}
                        onCheckedChange={(checked) => 
                          setNotifications(prev => ({ ...prev, [item.key]: checked }))
                        }
                      />
                    </div>
                    {index < 3 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="border-b border-border/50 bg-secondary/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-success" />
                </div>
                <div>
                  <CardTitle className="text-lg">सुरक्षा सेटिंग्स</CardTitle>
                  <CardDescription>अपने खाते की सुरक्षा प्रबंधित करें</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">दो-कारक प्रमाणीकरण (2FA)</p>
                  <p className="text-sm text-muted-foreground">OTP द्वारा अतिरिक्त सुरक्षा परत</p>
                </div>
                <Switch
                  checked={preferences.twoFactorAuth}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, twoFactorAuth: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-sm font-medium">पासवर्ड बदलें</Label>
                <div className="grid gap-4 max-w-md">
                  <Input type="password" placeholder="वर्तमान पासवर्ड" className="h-11" />
                  <Input type="password" placeholder="नया पासवर्ड" className="h-11" />
                  <Input type="password" placeholder="पासवर्ड की पुष्टि करें" className="h-11" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-between pt-4 pb-8"
        >
          <Button 
            variant="destructive" 
            onClick={async () => {
              await logout();
              window.location.href = "/";
            }} 
            size="lg"
            className="sm:w-auto"
          >
            <LogOut className="w-4 h-4 mr-2" />
            लॉग आउट
          </Button>
          <Button 
            onClick={handleSave} 
            size="lg"
            className="sm:w-auto"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                सहेज रहे हैं...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                परिवर्तन सहेजें
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
