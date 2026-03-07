
export default function SetupPage() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Migration Not Needed</h1>
      <p>The Campaigns feature has been upgraded to use Supabase Storage.</p>
      <p>No database migration is required anymore.</p>
      <p>Please go to <a href="/dashboard/admin/campaigns" className="text-blue-600 underline">Admin Campaigns</a>.</p>
    </div>
  );
}
