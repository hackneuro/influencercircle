
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, FileText, ExternalLink, Check, X, Search, Key, Copy, Trash2, Link2, Tag, UserPlus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Application {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  email: string;
  mobile: string;
  linkedin_url: string;
  objective: string;
  cv_url: string;
  status: string;
  created_at: string;
  referral_code?: string | null;
  referral_campaign_code?: string | null;
  referral_campaign_title?: string | null;
  referral_campaign_location?: string | null;
  referrer_user_id?: string | null;
  referrer_name?: string | null;
  referrer_username?: string | null;
  user_logged?: boolean;
  onboarding_format?: string | null;
  connect_link_token?: string | null;
  machine_id?: string | null;
  machine_name?: string | null;
  campaigns?: {
    campaign_name: string;
    opportunity_title: string;
    location: string;
  };
}

export default function AdminApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingRole, setCheckingRole] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [selectedAppFormat2, setSelectedAppFormat2] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [processing, setProcessing] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkCreating, setLinkCreating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [generatedLinkToken, setGeneratedLinkToken] = useState("");
  const [generatedPayload, setGeneratedPayload] = useState<{ email: string; name: string; phone: string } | null>(null);
  const [proceedUrl, setProceedUrl] = useState("");
  const [proceedSaving, setProceedSaving] = useState(false);
  const [linkCancelling, setLinkCancelling] = useState(false);
  const [linkRevoked, setLinkRevoked] = useState(false);
  const [promoCreating, setPromoCreating] = useState(false);
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [promoLink, setPromoLink] = useState("");
  const [promoPayload, setPromoPayload] = useState<{ email: string; name: string; phone: string } | null>(null);

  const [format2ModalOpen, setFormat2ModalOpen] = useState(false);
  const [format2Creating, setFormat2Creating] = useState(false);
  const [format2Link, setFormat2Link] = useState("");
  const [format2Payload, setFormat2Payload] = useState<{ email: string; name: string; phone: string } | null>(null);
  const [format2ProceedUrl, setFormat2ProceedUrl] = useState("");

  const [machineNames, setMachineNames] = useState<Record<string, string>>({});
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [appToReject, setAppToReject] = useState<Application | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const deleteApplication = async (app: Application) => {
    const deleteAuthUser = app.status === "approved"
      ? window.confirm("This application is approved. Delete the user account too? (OK = delete user + application, Cancel = delete application only)")
      : false;

    const confirmed = window.confirm(`Delete application for ${app.email}? This cannot be undone.`);
    if (!confirmed) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("Not authenticated");

      const response = await fetch("/api/admin/applications/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          applicationId: app.id,
          email: app.email,
          cvUrl: app.cv_url,
          deleteAuthUser
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to delete");

      setApplications(prev => prev.filter(a => a.id !== app.id));
      toast.success("Deleted");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete");
    }
  };

  const createMaskedLink = async (app: Application) => {
    try {
      setLinkCreating(true);
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("Not authenticated");

      const phone = String(app.mobile || "").replace(/\D/g, "");
      const name = `${app.first_name} ${app.last_name}`.trim();

      const response = await fetch("/api/admin/applications/link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          applicationId: app.id,
          email: app.email,
          name,
          phone
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to generate link");

      const url = `${window.location.origin}${result.path}`;
      setGeneratedLink(url);
      setGeneratedLinkToken(String(result.token || ""));
      setGeneratedPayload({ email: app.email, name, phone });
      setProceedUrl("");
      setLinkRevoked(false);
      setLinkModalOpen(true);
      toast.success("Link generated");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate link");
    } finally {
      setLinkCreating(false);
    }
  };

  const saveProceedUrl = async () => {
    try {
      setProceedSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("Not authenticated");
      if (!generatedLinkToken) throw new Error("Missing link token");
      if (!proceedUrl.trim()) throw new Error("Proceed URL is required");

      const response = await fetch("/api/admin/applications/link", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          token: generatedLinkToken,
          proceedUrl: proceedUrl.trim()
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to save proceed URL");

      toast.success("Proceed URL saved");
    } catch (error: any) {
      toast.error(error.message || "Failed to save proceed URL");
    } finally {
      setProceedSaving(false);
    }
  };

  const setGeneratedLinkActive = async (active: boolean) => {
    try {
      setLinkCancelling(true);
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("Not authenticated");
      if (!generatedLinkToken) throw new Error("Missing link token");

      const response = await fetch("/api/admin/applications/link", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ token: generatedLinkToken, active })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to update link");

      setLinkRevoked(!active);
      toast.success(active ? "Link reactivated" : "Link cancelled");
    } catch (error: any) {
      toast.error(error.message || "Failed to update link");
    } finally {
      setLinkCancelling(false);
    }
  };

  const createPromo49Link = async (app: Application) => {
    try {
      setPromoCreating(true);
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("Not authenticated");

      const phone = String(app.mobile || "").replace(/\D/g, "");
      const name = `${app.first_name} ${app.last_name}`.trim();

      const response = await fetch("/api/admin/applications/promo49br", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          applicationId: app.id,
          email: app.email,
          name,
          phone
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to generate promo link");

      const url = `${window.location.origin}${result.path}`;
      setPromoLink(url);
      setPromoPayload({ email: app.email, name, phone });
      setPromoModalOpen(true);
      toast.success("Promo link generated");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate promo link");
    } finally {
      setPromoCreating(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.replace("/login");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (profile?.role !== "admin") {
          router.replace("/dashboard");
          return;
        }

        await fetchApplications();
      } finally {
        setCheckingRole(false);
      }
    })();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/admin/applications');
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const { data } = await response.json();
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  if (checkingRole) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
        <p className="text-slate-500 text-sm">Checking access...</p>
      </div>
    );
  }

  const handleUserLoggedClick = (app: Application) => {
    setSelectedApp(app);
    setPassword("");
    setConfirmPassword("");
    setIsModalOpen(true);
  };

  const handleFormat2Click = (e: React.MouseEvent, app: Application) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedAppFormat2(app);
    setPassword("");
    setConfirmPassword("");
    setFormat2ProceedUrl("");
    setFormat2ModalOpen(true);
  };

  const handleFormat2Confirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppFormat2) return;

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!format2ProceedUrl.trim()) {
      toast.error("Proceed URL is required");
      return;
    }

    try {
      setFormat2Creating(true);
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("Not authenticated");

      const response = await fetch('/api/admin/applications/format2', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          applicationId: selectedAppFormat2.id,
          email: selectedAppFormat2.email,
          password: password,
          firstName: selectedAppFormat2.first_name,
          lastName: selectedAppFormat2.last_name,
          role: selectedAppFormat2.role,
          proceedUrl: format2ProceedUrl.trim()
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create Format 2 onboarding');
      }

      setApplications(apps => apps.map(app => 
        app.id === selectedAppFormat2.id ? { ...app, status: 'approved' } : app
      ));
      
      const url = `${window.location.origin}${result.path}`;
      setFormat2Link(url);
      setFormat2Payload({ 
        email: selectedAppFormat2.email, 
        name: `${selectedAppFormat2.first_name} ${selectedAppFormat2.last_name}`.trim(), 
        phone: String(selectedAppFormat2.mobile || "").replace(/\D/g, "")
      });

      toast.success(`User created for ${selectedAppFormat2.email}`);
    } catch (error: any) {
      console.error('Error creating Format 2 onboarding:', error);
      toast.error(error.message || 'Failed to create Format 2 onboarding');
    } finally {
      setFormat2Creating(false);
    }
  };

  const handleUserLoggedConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setProcessing(true);
      const response = await fetch('/api/admin/applications/user-logged', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: selectedApp.id,
          email: selectedApp.email,
          password: password,
          firstName: selectedApp.first_name,
          lastName: selectedApp.last_name,
          role: selectedApp.role,
          machineName: machineNames[selectedApp.id] || ""
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to approve application');
      }

      setApplications(apps => apps.map(app => 
        app.id === selectedApp.id ? { ...app, status: 'approved' } : app
      ));
      
      toast.success(`User created for ${selectedApp.email}`);
      setIsModalOpen(false);
      setSelectedApp(null);
    } catch (error: any) {
      console.error('Error approving application:', error);
      toast.error(error.message || 'Failed to approve application');
    } finally {
      setProcessing(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string, reason?: string) => {
    try {
      const response = await fetch('/api/admin/applications/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus, reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      setApplications(apps => apps.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      ));
      toast.success(`Application ${newStatus}`);
      
      if (newStatus === 'rejected') {
        setRejectModalOpen(false);
        setAppToReject(null);
        setRejectReason("");
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleRejectClick = (app: Application) => {
    setAppToReject(app);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === "all" || app.status === filter;
    const matchesSearch = 
      app.first_name.toLowerCase().includes(search.toLowerCase()) ||
      app.last_name.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase()) ||
      app.role.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const totalCount = applications.length;
  const filteredCount = filteredApplications.length;
  const pendingCount = applications.filter(a => a.status === "pending").length;
  const approvedCount = applications.filter(a => a.status === "approved").length;
  const rejectedCount = applications.filter(a => a.status === "rejected").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Application Approvals</h1>
          <p className="text-slate-500">Manage incoming applications for Influencer Circle</p>
          <div className="mt-1 text-[11px] font-semibold text-slate-400">build PROMO49BR 2026-03-11-02</div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">Total: {totalCount}</span>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold">Showing: {filteredCount}</span>
            <span className="px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-800 font-semibold">Pending: {pendingCount}</span>
            <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-800 font-semibold">Approved: {approvedCount}</span>
            <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-800 font-semibold">Rejected: {rejectedCount}</span>
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 border-b border-slate-200">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
            filter === 'all' ? 'bg-white border border-b-0 border-slate-200 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent'
          }`}
        >
          All Status ({totalCount})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
            filter === 'approved' ? 'bg-white border border-b-0 border-slate-200 text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent'
          }`}
        >
          Approved ({approvedCount})
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
            filter === 'rejected' ? 'bg-white border border-b-0 border-slate-200 text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent'
          }`}
        >
          Rejected ({rejectedCount})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
            filter === 'pending' ? 'bg-white border border-b-0 border-slate-200 text-yellow-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent'
          }`}
        >
          Pending ({pendingCount})
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Campaign</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Links</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No applications found
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">
                        {app.first_name} {app.last_name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(app.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-1">
                        {app.campaigns ? (
                          <div>
                            <div className="font-bold text-purple-600">{app.campaigns.campaign_name}</div>
                            <div className="text-slate-600">{app.campaigns.opportunity_title}</div>
                            <div className="text-slate-400">{app.campaigns.location}</div>
                          </div>
                        ) : null}
                        {app.referrer_name || app.referrer_username ? (
                          <div className="text-slate-700">
                            User:{" "}
                            {app.referrer_username ? (
                              <Link href={`/${app.referrer_username}`} target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline">
                                {app.referrer_name || app.referrer_username}
                              </Link>
                            ) : (
                              <span className="font-bold">{app.referrer_name || app.referrer_username}</span>
                            )}
                          </div>
                        ) : (
                          <div className="text-slate-400 italic">User: none</div>
                        )}
                        {!app.campaigns && app.referral_campaign_title ? (
                          <div className="text-slate-700">
                            <span className="font-bold">{app.referral_campaign_title}</span>
                            {app.referral_campaign_location ? (
                              <span className="text-slate-500"> · {app.referral_campaign_location}</span>
                            ) : null}
                          </div>
                        ) : null}
                        {!app.campaigns ? (
                          <div className="text-slate-400 text-xs italic">General</div>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {app.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="text-slate-600">{app.email}</div>
                      <div className="text-slate-500 text-xs">{app.mobile}</div>
                    </td>
                    <td className="px-6 py-4 space-y-2">
                      {app.linkedin_url && (
                        <a 
                          href={app.linkedin_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" /> LinkedIn
                        </a>
                      )}
                      {app.cv_url && (
                        <a 
                          href={app.cv_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-slate-600 hover:text-slate-900"
                        >
                          <FileText className="h-3 w-3" /> View CV
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${app.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          app.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <button
                          onClick={() => createPromo49Link(app)}
                          disabled={promoCreating}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                          title="Generate PROMO49BR link"
                        >
                          <Tag className="h-4 w-4" />
                          PROMO49BR
                        </button>
                        <button
                          onClick={() => createMaskedLink(app)}
                          disabled={linkCreating}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 transition-colors disabled:opacity-50 flex items-center gap-2"
                          title="Generate Link"
                        >
                          <Link2 className="h-4 w-4" />
                          LINK
                        </button>
                        <button
                          onClick={(e) => handleFormat2Click(e, app)}
                          disabled={format2Creating || linkCreating || promoCreating}
                          className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors flex items-center gap-1.5 disabled:opacity-50"
                          title="Format 2 Entering"
                        >
                          <UserPlus className="h-3.5 w-3.5" />
                          Format 2 Entering
                        </button>
                        <button
                          onClick={() => handleUserLoggedClick(app)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Create User (User logged)"
                        >
                          <Key className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => updateStatus(app.id, 'approved')}
                          className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                          title="Approve"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => updateStatus(app.id, 'rejected')}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="Reject"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteApplication(app)}
                          className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        {app.user_logged && app.machine_id ? (
                          <div className="flex flex-col gap-1 bg-slate-50 p-2 rounded border border-slate-200 text-left mt-2 w-full">
                            <div className="text-xs text-slate-500 font-semibold">Machine Info</div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono bg-white px-2 py-1 rounded border border-slate-200">
                                {app.machine_id}
                              </span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(app.machine_id || "");
                                  toast.success("Machine ID copied");
                                }}
                                className="p-1 hover:bg-slate-200 rounded text-slate-500"
                                title="Copy Machine ID"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </div>
                            {app.machine_name && (
                              <div className="text-xs text-slate-600 mt-1">
                                <span className="font-semibold">Name:</span> {app.machine_name}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 w-full justify-end mt-2">
                            <input
                              type="text"
                              placeholder="Machine name (optional)"
                              className="text-xs px-2 py-1.5 rounded border border-slate-200 w-36 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              value={machineNames[app.id] || ""}
                              onChange={(e) => setMachineNames(prev => ({ ...prev, [app.id]: e.target.value }))}
                            />
                            <button
                              onClick={() => handleUserLoggedClick(app)}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors whitespace-nowrap"
                              title="User logged (create user in database)"
                            >
                              User logged
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 m-4">
            <h2 className="text-xl font-bold text-slate-900 mb-2">User Logged</h2>
            <p className="text-slate-500 mb-6 text-sm">
              Create the user account in Supabase for <strong>{selectedApp.email}</strong>.
              <br/><br/>
              <span className="text-amber-600 font-medium">Important:</span> The user will need this password to log in. Please copy and send it to them securely.
            </p>
            
            <form onSubmit={handleUserLoggedConfirm} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none pr-10 font-mono"
                    placeholder="Enter password (min 6 chars)"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(password);
                      toast.success("Password copied");
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-slate-100 transition-colors"
                    title="Copy Password"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="text"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  placeholder="Confirm password"
                  required
                  minLength={6}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors text-sm font-medium"
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create User'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {format2ModalOpen && selectedAppFormat2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-xl p-6 m-4">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Format 2 Entering</h2>
            
            {!format2Link ? (
              <>
                <p className="text-slate-500 mb-6 text-sm">
                  Create the user account in Supabase for <strong>{selectedAppFormat2.email}</strong>.
                  <br/><br/>
                  <span className="text-amber-600 font-medium">Important:</span> The user will need this password to log in. Please copy and send it to them securely.
                </p>
                
                <form onSubmit={handleFormat2Confirm} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none pr-10 font-mono"
                          placeholder="Password (min 6 chars)"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(password);
                            toast.success("Password copied");
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-slate-100 transition-colors"
                          title="Copy Password"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="text"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                        placeholder="Confirm password"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Proceed URL (user is redirected after clicking Proceed)</label>
                    <input
                      value={format2ProceedUrl}
                      onChange={(e) => setFormat2ProceedUrl(e.target.value)}
                      placeholder="https://www.influencercircle.net/..."
                      required
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                    />
                    <div className="text-xs text-slate-500">
                      Allowed: https://*.influencercircle.net/... or a relative path
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setFormat2ModalOpen(false);
                        setSelectedAppFormat2(null);
                      }}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors text-sm font-medium"
                      disabled={format2Creating}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
                      disabled={format2Creating}
                    >
                      {format2Creating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Format 2 Account'
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm text-emerald-800">
                  User created successfully! Now copy the generated link below.
                </div>

                {format2Payload && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm">
                    <pre className="whitespace-pre-wrap break-words text-slate-800">{JSON.stringify({ ...format2Payload, channel: "linkedin", format: "format2" }, null, 2)}</pre>
                  </div>
                )}

                <div className="relative">
                  <input
                    value={format2Link}
                    readOnly
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none pr-10 font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(format2Link);
                      toast.success("Link copied");
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-slate-100 transition-colors"
                    title="Copy Link"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setFormat2ModalOpen(false);
                      setSelectedAppFormat2(null);
                      setFormat2Link("");
                    }}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {linkModalOpen && generatedPayload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-xl p-6 m-4">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Generated Link</h2>
            <p className="text-slate-500 mb-4 text-sm">
              Copy this link and send it to the user via WhatsApp.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm mb-4">
              <pre className="whitespace-pre-wrap break-words text-slate-800">{JSON.stringify({ ...generatedPayload, channel: "linkedin" }, null, 2)}</pre>
            </div>

            <div className="relative mb-6">
              <input
                value={generatedLink}
                readOnly
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none pr-10 font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(generatedLink);
                  toast.success("Link copied");
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-slate-100 transition-colors"
                title="Copy Link"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 mb-6">
              <label className="text-sm font-bold text-slate-700">Proceed URL (user is redirected after clicking Proceed)</label>
              <div className="flex gap-2">
                <input
                  value={proceedUrl}
                  onChange={(e) => setProceedUrl(e.target.value)}
                  placeholder="https://www.influencercircle.net/..."
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={saveProceedUrl}
                  disabled={proceedSaving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
                >
                  {proceedSaving ? "Saving..." : "Save"}
                </button>
              </div>
              <div className="text-xs text-slate-500">
                Allowed: https://*.influencercircle.net/... or a relative path like /dashboard/linkedin
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setGeneratedLinkActive(linkRevoked)}
                disabled={linkCancelling}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-bold mr-auto disabled:opacity-50 ${
                  linkRevoked ? "text-emerald-700 hover:bg-emerald-50" : "text-red-600 hover:bg-red-50"
                }`}
              >
                {linkCancelling ? (linkRevoked ? "Reactivating..." : "Cancelling...") : (linkRevoked ? "Reactivate link" : "Cancel link (expire)")}
              </button>
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {promoModalOpen && promoPayload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-xl p-6 m-4">
            <h2 className="text-xl font-bold text-slate-900 mb-2">PROMO49BR Link</h2>
            <p className="text-slate-500 mb-4 text-sm">
              Copy this link and send it to the user via WhatsApp.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm mb-4">
              <pre className="whitespace-pre-wrap break-words text-slate-800">{JSON.stringify({ ...promoPayload, channel: "payment", promo: "PROMO49BR" }, null, 2)}</pre>
            </div>

            <div className="relative mb-6">
              <input
                value={promoLink}
                readOnly
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none pr-10 font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(promoLink);
                  toast.success("Link copied");
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-slate-100 transition-colors"
                title="Copy Link"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPromoModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
