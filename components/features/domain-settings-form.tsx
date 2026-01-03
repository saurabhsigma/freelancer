"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Check, AlertCircle, Copy, ExternalLink } from "lucide-react";
import { getDomainConfig, updateDomainConfig, activateSubdomain, verifyCustomDomain } from "@/server/actions/domain";
import { useToast } from "@/components/ui/use-toast";

interface DomainSettings {
    customDomain: string | null;
    subdomain: string | null;
    customDomainVerified: boolean;
    subdomainActive: boolean;
    dnsTxtRecord: string | null;
}

export function DomainSettingsForm({ username }: { username: string }) {
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [domains, setDomains] = useState<DomainSettings>({
        customDomain: null,
        subdomain: null,
        customDomainVerified: false,
        subdomainActive: false,
        dnsTxtRecord: null
    });
    const [formData, setFormData] = useState({
        customDomain: "",
        subdomain: ""
    });
    const { toast } = useToast();

    useEffect(() => {
        setIsMounted(true);
        loadDomainConfig();
    }, []);

    const loadDomainConfig = async () => {
        const result = await getDomainConfig();
        if (!result.error) {
            setDomains(result as DomainSettings);
            setFormData({
                customDomain: result.customDomain || "",
                subdomain: result.subdomain || ""
            });
        }
    };

    const handleSubdomainChange = async () => {
        if (!formData.subdomain.trim()) {
            toast({ title: "Error", description: "Subdomain cannot be empty", variant: "destructive" });
            return;
        }

        setLoading(true);
        const result = await updateDomainConfig({ subdomain: formData.subdomain });
        setLoading(false);

        if (result.error) {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        } else {
            toast({ title: "Success", description: "Subdomain updated successfully" });
            loadDomainConfig();
        }
    };

    const handleActivateSubdomain = async () => {
        setLoading(true);
        const result = await activateSubdomain(domains.subdomain || "");
        setLoading(false);

        if (result.error) {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        } else {
            toast({ title: "Success", description: result.message });
            loadDomainConfig();
        }
    };

    const handleCustomDomainSubmit = async () => {
        if (!formData.customDomain.trim()) {
            toast({ title: "Error", description: "Domain cannot be empty", variant: "destructive" });
            return;
        }

        setLoading(true);
        const result = await updateDomainConfig({ customDomain: formData.customDomain });
        setLoading(false);

        if (result.error) {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        } else {
            toast({ title: "Success", description: "Custom domain configured. Please verify DNS records." });
            loadDomainConfig();
        }
    };

    const handleVerifyDomain = async () => {
        setLoading(true);
        const result = await verifyCustomDomain();
        setLoading(false);

        if (result.error) {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        } else {
            toast({ title: "Success", description: result.message });
            loadDomainConfig();
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: "Copied!", description: "Text copied to clipboard" });
    };

    if (!isMounted) return null;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Domain Settings</h2>
                <p className="text-muted-foreground mt-2">
                    Use your own domain or a free subdomain for your portfolio
                </p>
            </div>

            <Tabs defaultValue="subdomain" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="subdomain">Free Subdomain</TabsTrigger>
                    <TabsTrigger value="custom">Custom Domain</TabsTrigger>
                </TabsList>

                <TabsContent value="subdomain" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="w-5 h-5" />
                                Free Subdomain
                            </CardTitle>
                            <CardDescription>
                                Get a free subdomain on our platform
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="subdomain">Subdomain</Label>
                                <div className="flex gap-2">
                                    <div className="flex-1 flex items-center gap-2 px-3 rounded-md border bg-muted">
                                        <Input
                                            id="subdomain"
                                            placeholder="yourname"
                                            value={formData.subdomain}
                                            onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.toLowerCase() })}
                                            className="border-0 bg-transparent"
                                        />
                                        <span className="text-sm text-muted-foreground">.freelancer.app</span>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Your portfolio will be accessible at: <code className="bg-muted px-2 py-1 rounded">yourname.freelancer.app</code>
                                </p>
                            </div>

                            {domains.subdomain && (
                                <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="font-medium text-blue-900 dark:text-blue-100">
                                                {domains.subdomain}.freelancer.app
                                            </p>
                                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                                {domains.subdomainActive ? "🟢 Active" : "🟡 Configured but not active"}
                                            </p>
                                        </div>
                                        <a
                                            href={`https://${domains.subdomain}.freelancer.app`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Button
                                    onClick={handleSubdomainChange}
                                    disabled={loading || !formData.subdomain.trim()}
                                    className="flex-1"
                                >
                                    {loading ? "Updating..." : "Save Subdomain"}
                                </Button>
                                {domains.subdomain && !domains.subdomainActive && (
                                    <Button
                                        variant="outline"
                                        onClick={handleActivateSubdomain}
                                        disabled={loading}
                                    >
                                        Activate
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="custom" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="w-5 h-5" />
                                Custom Domain
                            </CardTitle>
                            <CardDescription>
                                Connect your own domain to your portfolio
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="customDomain">Your Domain</Label>
                                <Input
                                    id="customDomain"
                                    placeholder="myportfolio.com"
                                    value={formData.customDomain}
                                    onChange={(e) => setFormData({ ...formData, customDomain: e.target.value.toLowerCase() })}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Enter your domain name (e.g., myportfolio.com or portfolio.yourname.com)
                                </p>
                            </div>

                            {domains.customDomain && (
                                <div className="space-y-3">
                                    <div className={`rounded-lg border p-3 ${
                                        domains.customDomainVerified
                                            ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900"
                                            : "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900"
                                    }`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="font-medium">
                                                {domains.customDomainVerified ? "✓ Verified" : "⚠ Waiting for verification"}
                                            </p>
                                        </div>
                                        <p className="text-sm">{domains.customDomain}</p>
                                    </div>

                                    {!domains.customDomainVerified && domains.dnsTxtRecord && (
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-semibold">DNS Verification Required</h4>
                                            <p className="text-xs text-muted-foreground">
                                                Add this TXT record to your domain's DNS settings:
                                            </p>
                                            <div className="bg-muted rounded-lg p-3 flex items-center justify-between">
                                                <code className="text-xs font-mono break-all">{domains.dnsTxtRecord}</code>
                                                <button
                                                    onClick={() => copyToClipboard(domains.dnsTxtRecord!)}
                                                    className="ml-2 p-2 hover:bg-slate-300 dark:hover:bg-slate-600 rounded"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                                                <li>Go to your domain registrar (GoDaddy, Namecheap, etc.)</li>
                                                <li>Find the DNS/MX Records section</li>
                                                <li>Add a new TXT record with the value above</li>
                                                <li>Wait 24-48 hours for DNS to propagate</li>
                                                <li>Click "Verify Domain" when ready</li>
                                            </ol>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Button
                                    onClick={handleCustomDomainSubmit}
                                    disabled={loading || !formData.customDomain.trim()}
                                    className="flex-1"
                                >
                                    {loading ? "Saving..." : "Save Domain"}
                                </Button>
                                {domains.customDomain && !domains.customDomainVerified && (
                                    <Button
                                        variant="outline"
                                        onClick={handleVerifyDomain}
                                        disabled={loading}
                                    >
                                        Verify Domain
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
