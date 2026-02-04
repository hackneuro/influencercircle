import { Linkedin, Instagram, MessageSquare as WhatsApp, Shield, Info } from "lucide-react";

export default function MessagingPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
        <p className="font-semibold">Funcionalidade não disponível no momento.</p>
      </div>
      {false && (<>
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Connected Messaging</h1>
        <p className="text-slate-500">Connect your WhatsApp and Linkedin message in a single place. Integrate with Automatic answers and IA systems so you can improve the management of your channels. Also integrate messages from sales people/ representatives that you want to monitor (WhatsApp or Linkedin).</p>
      </div>

      {/* Login Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button className="flex flex-col items-center justify-center gap-4 p-8 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all group">
          <div className="p-4 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
            <Linkedin className="h-8 w-8 text-[#0077b5]" />
          </div>
          <span className="font-bold text-slate-900">Login on Linkedin Messages</span>
        </button>

        {/* <button className="flex flex-col items-center justify-center gap-4 p-8 bg-white border border-slate-200 rounded-2xl hover:border-pink-500 hover:shadow-lg transition-all group">
          <div className="p-4 bg-pink-50 rounded-full group-hover:bg-pink-100 transition-colors">
            <Instagram className="h-8 w-8 text-[#E1306C]" />
          </div>
          <span className="font-bold text-slate-900">Login on Instagram Messages</span>
        </button> */}

        <button className="flex flex-col items-center justify-center gap-4 p-8 bg-white border border-slate-200 rounded-2xl hover:border-green-500 hover:shadow-lg transition-all group">
          <div className="p-4 bg-green-50 rounded-full group-hover:bg-green-100 transition-colors">
            <WhatsApp className="h-8 w-8 text-[#25D366]" />
          </div>
          <span className="font-bold text-slate-900 text-center">Login on WhatsApp Messages<br /><span className="text-xs font-normal text-slate-500">(Business or Personal)</span></span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">How it works:</h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="p-2 bg-blue-50 rounded-lg h-fit">
              <Linkedin className="h-5 w-5 text-[#0077b5]" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 block mb-1">Linkedin</span>
              <p className="text-sm text-slate-600 leading-relaxed">
                once you are logged your Linkedin in our platform (can be free) you can just click on the bottom above to link your messages into our messaging system and start using it.
              </p>
            </div>
          </div>

          {/* <div className="flex gap-3">
            <div className="p-2 bg-pink-50 rounded-lg h-fit">
              <Instagram className="h-5 w-5 text-[#E1306C]" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 block mb-1">Instagram</span>
              <p className="text-sm text-slate-600 leading-relaxed">
                once you are logged your Instagram in our platform (can be free) you can just click on the bottom above your messages into our messaging system and start using it.
              </p>
            </div>
          </div> */}

          <div className="flex gap-3">
            <div className="p-2 bg-green-50 rounded-lg h-fit">
              <WhatsApp className="h-5 w-5 text-[#25D366]" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 block mb-1">Whatsapp</span>
              <p className="text-sm text-slate-600 leading-relaxed">
                click on the bottom above, read the QR code with your Whatsapp Account (go on Linked Device {'>'} click on Linked a Device {'>'} Scan the QR Code)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security Note */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="font-bold text-slate-900">Security Note</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Your privacy is our priority. That is why we never ask for your ID or password. You log in to LinkedIn directly through our secure log into our platform, ensuring your credentials remain private (and you are the only one with access to them). If you wish to disconnect your accounts, you can do so instantly via changing your password directly on Linkedin, your Profile Settings in the Platform, or simply reach out to our support team for assistance. As soon as you ask to unlog it is done.
          </p>
        </div>

        {/* General Note */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-5 w-5 text-blue-600" />
            <h3 className="font-bold text-slate-900">Note</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Connecting your social accounts is a key step (and therefore, mandatory) to unlocking the full power of Influencer Circle / Viralmind. This allows our AI to craft personalized intelligence and execute strategic cross-engagement actions tailored to your profile. If you have any questions, we’re here to help! Message us here or via WhatsApp.
          </p>
        </div>
      </div>
      </>)}
    </div>
  );
}
