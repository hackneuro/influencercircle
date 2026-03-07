
export const dynamic = 'force-dynamic';

export default function TestDeployPage() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Deployment Test</h1>
      <p>If you see this, the deployment is working.</p>
      <p>Timestamp: {new Date().toISOString()}</p>
    </div>
  );
}
