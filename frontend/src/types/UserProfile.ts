export type UserProfile = {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
  subscription_id: number | null;
  playlist_limit: number | null;
  early_access: number | null;
  subscription_name: string | null;
  price: number | null;
};
