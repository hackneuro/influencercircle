import Link from "next/link";

export default function PucAngelsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          PUC Angels Partnership
        </h1>
        
        <div className="space-y-6 text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          <p>
            We truly believe that education can change the world. Therefore we are fostering PUC angels (a non profit association) to help them go international.
          </p>
          
          <p>
            We are currently building our integration with them, so, if you also want to support them, go to <a href="https://news.pucangels.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">https://news.pucangels.org</a> and click on admission.
          </p>
        </div>
      </div>
    </div>
  );
}
