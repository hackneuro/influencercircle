
export const dynamic = 'force-dynamic';

export default function TestDeployPage() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Deployment Test v2</h1>
      <p>If you see this, the NEW deployment (Storage-based) is working.</p>
      <p>Timestamp: {new Date().toISOString()}</p>
    </div>
  );
}
