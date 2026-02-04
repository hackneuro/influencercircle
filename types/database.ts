export type ProfileRow = {
  id: string;
  username: string | null;
  name: string;
  email: string;
  whatsapp: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  bio: string | null;
  tags: string[] | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  objective: string | null;
  market_objective: string | null;
  location_objective: string | null;
  average_content_price: number | null;
  about_yourself: string | null;
  plan: "member" | "elite" | "advisor";
  role: "user" | "influencer" | "admin";
  is_premium: boolean;
  is_public: boolean;
  advisor_sub_choices: string[] | null;
  influencer_channels: string[] | null;
  student_level: string[] | null;
  company_type: string[] | null;
  investor_type: string[] | null;
  executive_experience: string[] | null;
  user_types: string[] | null;
  region: string | null;
  disclaimer_accepted: boolean;
  campaign_preference: string | null;
  social_cause_preference: string | null;
  created_at: string;
  updated_at: string;
  image?: string;
  resume_url?: string;
  show_email?: boolean;
  show_phone?: boolean;
  verified?: boolean;
  price?: string;
  flag?: string;
  isPucAngel?: boolean;
  expertise?: string[];
  categories?: string[];
  stats?: {
    linkedin: { followers: string; engagement: string };
    instagram: { followers: string; engagement: string };
  };
  location?: string;
};

export type ServiceRow = {
  id: string;
  owner_id: string | null;
  title: string;
  description: string | null;
  category: string | null;
  price: number;
  currency: string;
  stripe_price_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "completed"
  | "failed"
  | "canceled"
  | "refunded";

export type OrderRow = {
  id: string;
  buyer_id: string;
  service_id: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  post_url: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

