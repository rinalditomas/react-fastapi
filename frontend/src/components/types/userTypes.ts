export interface Connection {
  user_id: number;
  connected_user_id: number;
  id: number;
  created_at: string;
}

export interface User {
  name: string;
  email: string;
  id: string;
  created_at: string;
  last_updated_at: string | null;
}
