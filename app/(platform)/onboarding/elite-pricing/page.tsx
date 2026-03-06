import { redirect } from 'next/navigation';

export default function ElitePricingRedirect({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const region = searchParams.region;
  const queryString = region ? `?region=${region}` : '';
  redirect(`/apply/elite-pricing${queryString}`);
}
