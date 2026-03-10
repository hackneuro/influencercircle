
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, Plus, Copy, Check, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Campaign {
  id: string;
  opportunity_title: string;
  campaign_name: string;
  location: string;
  created_at: string;
}

export default function AdminCampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  const [formData, setFormData] = useState({
    opportunity_title: "",
    campaign_name: "",
    location: ""
  });

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

        await fetchCampaigns();
      } finally {
        setCheckingRole(false);
      }
    })();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      // Fetch from our API which handles Storage/DB abstraction
      const res = await fetch('/api/admin/campaigns');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast.error('Failed to load campaigns');
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch('/api/admin/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create');
      }

      const data = await res.json();
      setCampaigns([data, ...campaigns]);
      setFormData({ opportunity_title: "", campaign_name: "", location: "" });
      toast.success("Campaign created successfully");
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast.error(error.message || 'Failed to create campaign');
    } finally {
      setCreating(false);
    }
  };

  const copyLink = (id: string) => {
    const origin = window.location.origin;
    const link = `${origin}/apply?campaign_id=${id}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    toast.success("Apply link copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteCampaign = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign? Existing applications will still keep the ID.")) return;

    try {
      const res = await fetch(`/api/admin/campaigns?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');

      setCampaigns(campaigns.filter(c => c.id !== id));
      toast.success("Campaign deleted");
    } catch (error) {
      toast.error("Failed to delete campaign");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campaigns</h1>
          <p className="text-slate-500">Create and manage application campaigns</p>
        </div>
      </div>

      {/* Create Form */}
      <div className="card p-6">
        <h2 className="text-lg font-bold mb-4">Create New Campaign</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Campaign Name (Internal)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Summer Tech 2026"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={formData.campaign_name}
              onChange={e => setFormData({...formData, campaign_name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Opportunity Title (Public)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Senior Developer Role"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={formData.opportunity_title}
              onChange={e => setFormData({...formData, opportunity_title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Location (Public)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. São Paulo, Brazil (Hybrid)"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
            />
          </div>
          <button 
            type="submit" 
            disabled={creating}
            className="btn btn-primary w-full md:w-auto"
          >
            {creating ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus className="h-4 w-4 mr-2" />}
            Create Campaign
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Campaign Name</th>
                <th className="px-6 py-4">Opportunity</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Created At</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Loading...
                  </td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No campaigns found. Create one above.
                  </td>
                </tr>
              ) : (
                campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {campaign.campaign_name}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {campaign.opportunity_title}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {campaign.location}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => copyLink(campaign.id)}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors tooltip-trigger relative group"
                          title="Copy Apply Link"
                        >
                          {copiedId === campaign.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => deleteCampaign(campaign.id)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
