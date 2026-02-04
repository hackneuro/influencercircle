import OnboardingForm from "@/components/OnboardingForm";

export default function OnboardingPage() {
  return (
    <main className="space-y-6">
      <section className="card p-6">
        <h1 className="text-2xl font-semibold mb-2">Join Influencer Circle</h1>
        <p className="text-sm text-ic-subtext">
          Complete the onboarding steps to create your profile and choose a plan.
        </p>
      </section>
      <OnboardingForm />
    </main>
  );
}

