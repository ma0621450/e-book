export interface FormValues {
  email: string;
  username?: string;
  password: string;
  role?: string;
}

export interface PostAuthor {
  id: number;
  user: {
    username: string;
  };
  bio: string;
  is_verified: boolean;
}

export interface Post {
  id: number;
  title: string;
  body?: string;
  type: string;
  price: number;
  cover_img: string;
  is_published?: boolean;
  author?: PostAuthor;
  hasPurchased?: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role_id: number;
  deleted_at?: string | null;
}

export interface Author {
  id: string;
  user: User;
  is_verified: boolean;
}

export interface AuthorProfile {
  bio: string;
  is_verified: boolean;
  pfp?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
}

export interface GrantAccessResponse {
  success: boolean;
  message: string;
}
