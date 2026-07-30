import { useState, useEffect } from "react";
import { User, Store, Palette, Shield, Save, Check, Eye, EyeOff, ImagePlus, Trash2, Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { useApp } from "@/app/providers/AppProvider";

import { supabase } from "@/lib/supabase";
import { businessService } from "../../onboarding/services/business.service";
import type { Business } from "../../onboarding/types";

// --- Validation Schemas ---
const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
});

const storeSchema = z.object({
  storeName: z.string().min(2, "Store name must be at least 2 characters."),
  currency: z.string(),
  taxRate: z.string().min(0, "Tax rate cannot be negative."),
});

const securitySchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number."),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type SettingsTab = "profile" | "store" | "appearance" | "security";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and application preferences.
          </p>
        </div>
      </div>
      
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 mt-6">
        <aside className="lg:w-1/4">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            <SettingsNavLink 
              icon={<User size={18} />} 
              title="Profile" 
              active={activeTab === "profile"} 
              onClick={() => setActiveTab("profile")} 
            />
            <SettingsNavLink 
              icon={<Store size={18} />} 
              title="Store Details" 
              active={activeTab === "store"} 
              onClick={() => setActiveTab("store")} 
            />
            <SettingsNavLink 
              icon={<Palette size={18} />} 
              title="Appearance" 
              active={activeTab === "appearance"} 
              onClick={() => setActiveTab("appearance")} 
            />
            <SettingsNavLink 
              icon={<Shield size={18} />} 
              title="Security" 
              active={activeTab === "security"} 
              onClick={() => setActiveTab("security")} 
            />
          </nav>
        </aside>
        
        <div className="flex-1 lg:max-w-2xl" key={activeTab}>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            {activeTab === "profile" && <ProfileSettings />}
            {activeTab === "store" && <StoreSettings />}
            {activeTab === "appearance" && <AppearanceSettings />}
            {activeTab === "security" && <SecuritySettings />}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsNavLink({ 
  icon, 
  title, 
  active, 
  onClick 
}: { 
  icon: React.ReactNode; 
  title: string; 
  active: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
        active ? "bg-muted text-foreground" : "text-muted-foreground"
      )}
    >
      <span className={cn("text-muted-foreground", active && "text-foreground")}>{icon}</span>
      <span>{title}</span>
    </button>
  );
}

// --- Specific Settings Sections ---

function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(true);
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
    }
  });

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        reset({
          fullName: user.user_metadata?.full_name || "",
          email: user.email || "",
          phone: user.phone || "",
        });
      }
      setIsLoading(false);
    }
    loadUser();
  }, [reset]);

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    try {
      const { error } = await supabase.auth.updateUser({
        email: data.email,
        phone: data.phone,
        data: { full_name: data.fullName },
      });
      
      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile.");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading profile...</div>;
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Update your personal information and contact details.
        </CardDescription>
      </CardHeader>
      <Separator className="mb-6" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" {...register("fullName")} />
            {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input id="phone" type="tel" {...register("phone")} />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-6">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function StoreSettings() {
  const { refreshBusiness } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<z.infer<typeof storeSchema>>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      storeName: "",
      currency: "USD",
      taxRate: "0",
    }
  });

  useEffect(() => {
    async function loadBusiness() {
      try {
        const b = await businessService.getMine();
        if (b) {
          setBusiness(b);
          if (b.logo_url) {
            setLogoPreview(businessService.getLogoUrl(b.logo_url));
          }
          reset({
            storeName: b.name || "",
            currency: b.currency || "USD",
            taxRate: "0", // Currently not saved in db, but kept for UI
          });
        }
      } catch (error) {
        console.error("Failed to load business", error);
      }
      setIsLoading(false);
    }
    loadBusiness();
  }, [reset]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: z.infer<typeof storeSchema>) => {
    if (!business) return;
    try {
      await businessService.update(business.id, {
        name: data.storeName,
        currency: data.currency,
      });

      if (logoFile) {
        await businessService.uploadLogo(business.id, logoFile);
      }
      
      await refreshBusiness();

      toast.success("Store preferences updated.");
    } catch (error: any) {
      toast.error(error.message || "Failed to update store.");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading store details...</div>;
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Store Details</CardTitle>
        <CardDescription>
          Configure the primary settings for your point of sale system.
        </CardDescription>
      </CardHeader>
      <Separator className="mb-6" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-6 items-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/50 group">
              {logoPreview ? (
                <img src={logoPreview} alt="Store Logo" className="h-full w-full object-cover" />
              ) : (
                <Store className="h-10 w-10 text-muted-foreground/50" />
              )}
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="h-6 w-6 text-white mb-1" />
                <span className="text-[10px] text-white font-medium">Upload</span>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleLogoChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                aria-label="Upload logo"
              />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-sm font-medium mb-1">Store Logo</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Recommended size: 256x256px. Maximum file size: 2MB.
              </p>
              <div className="relative inline-block">
                <Button type="button" variant="outline" size="sm">
                  <ImagePlus className="mr-2 h-4 w-4" />
                  Choose Image
                </Button>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  aria-label="Upload logo"
                />
              </div>
            </div>
          </div>
          
          <Separator />

          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name</Label>
            <Input id="storeName" {...register("storeName")} />
            {errors.storeName && <p className="text-sm text-destructive">{errors.storeName.message}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select 
                defaultValue={business?.currency || "USD"} 
                onValueChange={(val) => setValue("currency", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="CAD">CAD ($)</SelectItem>
                  <SelectItem value="PHP">PHP (₱)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
              <Input id="taxRate" type="number" step="0.01" {...register("taxRate")} />
              {errors.taxRate && <p className="text-sm text-destructive">{errors.taxRate.message}</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-6">
          <Button type="submit" disabled={isSubmitting || !business}>
            {isSubmitting ? "Saving..." : "Save settings"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize how the application looks on your device.
        </CardDescription>
      </CardHeader>
      <Separator className="mb-6" />
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Theme Preference</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Light Theme */}
            <button
              onClick={() => setTheme("light")}
              className={cn(
                "group relative flex flex-col items-start gap-2 rounded-lg border-2 p-4 text-left hover:bg-accent/50 transition-all",
                theme === "light" ? "border-primary" : "border-muted"
              )}
            >
              <div className="w-full rounded-md bg-[#ecedef] p-2 aspect-video flex items-center justify-center shadow-sm">
                <div className="w-full h-full rounded bg-white shadow-sm flex flex-col gap-1 p-2">
                  <div className="w-1/3 h-2 bg-gray-200 rounded"></div>
                  <div className="w-full flex-1 bg-gray-50 rounded border border-gray-100"></div>
                </div>
              </div>
              <div className="flex w-full items-center justify-between mt-2">
                <span className="font-medium text-sm">Light</span>
                {theme === "light" && <Check className="h-4 w-4 text-primary" />}
              </div>
            </button>
            
            {/* Dark Theme */}
            <button
              onClick={() => setTheme("dark")}
              className={cn(
                "group relative flex flex-col items-start gap-2 rounded-lg border-2 p-4 text-left hover:bg-accent/50 transition-all",
                theme === "dark" ? "border-primary" : "border-muted"
              )}
            >
              <div className="w-full rounded-md bg-[#1c1c1c] p-2 aspect-video flex items-center justify-center shadow-sm">
                <div className="w-full h-full rounded bg-zinc-900 shadow-sm flex flex-col gap-1 p-2">
                  <div className="w-1/3 h-2 bg-zinc-800 rounded"></div>
                  <div className="w-full flex-1 bg-zinc-950 rounded border border-zinc-800"></div>
                </div>
              </div>
              <div className="flex w-full items-center justify-between mt-2">
                <span className="font-medium text-sm">Dark</span>
                {theme === "dark" && <Check className="h-4 w-4 text-primary" />}
              </div>
            </button>
            
            {/* System Theme */}
            <button
              onClick={() => setTheme("system")}
              className={cn(
                "group relative flex flex-col items-start gap-2 rounded-lg border-2 p-4 text-left hover:bg-accent/50 transition-all",
                theme === "system" ? "border-primary" : "border-muted"
              )}
            >
              <div className="w-full rounded-md bg-gradient-to-br from-[#ecedef] to-[#1c1c1c] p-2 aspect-video flex items-center justify-center shadow-sm relative overflow-hidden">
                <div className="w-full h-full rounded shadow-sm flex flex-col gap-1 p-2 relative z-10 
                  bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm">
                  <div className="w-1/3 h-2 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                  <div className="w-full flex-1 bg-gray-50/50 dark:bg-zinc-950/50 rounded border border-gray-100 dark:border-zinc-800"></div>
                </div>
              </div>
              <div className="flex w-full items-center justify-between mt-2">
                <span className="font-medium text-sm">System</span>
                {theme === "system" && <Check className="h-4 w-4 text-primary" />}
              </div>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SecuritySettings() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<z.infer<typeof securitySchema>>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    }
  });

  const onSubmit = async (data: z.infer<typeof securitySchema>) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (error) throw error;
      
      toast.success("Password updated successfully.");
      reset(); // Clear the form
    } catch (error: any) {
      toast.error(error.message || "Failed to update password.");
    }
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>
          Manage your password and security preferences.
        </CardDescription>
      </CardHeader>
      <Separator className="mb-6" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input 
                id="newPassword" 
                type={showPassword ? "text" : "password"} 
                className="pr-10" 
                {...register("newPassword")} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input 
                id="confirmPassword" 
                type={showPassword ? "text" : "password"} 
                className="pr-10" 
                {...register("confirmPassword")} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
          </div>
          
          <div className="rounded-md border p-4 bg-muted/30">
            <h4 className="text-sm font-semibold mb-2">Two-Factor Authentication</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Two-factor authentication adds an extra layer of security to your account.
            </p>
            <Button type="button" variant="outline" size="sm" onClick={() => toast.info("2FA is coming soon!")}>
              Enable 2FA
            </Button>
          </div>
          
          <div className="rounded-md border border-destructive/20 p-4 bg-destructive/5 mt-6">
            <h4 className="text-sm font-semibold text-destructive flex items-center mb-2">
              <Trash2 className="mr-2 h-4 w-4" />
              Danger Zone
            </h4>
            <p className="text-sm text-destructive/80 mb-4">
              Permanently delete your account and all of your store data. This action is not reversible, so please continue with caution.
            </p>
            <Button type="button" variant="destructive" size="sm" onClick={() => toast.error("Are you sure? This feature is not yet enabled.")}>
              Delete Account
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-6">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update password"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}