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

export interface UserProviderProps {
  children: React.ReactNode;
}

export interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  author: Author | null;
  setAuthor: React.Dispatch<React.SetStateAction<Author | null>>;
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
}

export interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
}

export interface PrivateRouteProps {
  role: number | number[];
  children?: React.ReactNode;
}

export interface PostCardProps {
  post: Post;
}

export interface Notification {
  id: number;
  message: string;
}

export interface HandleNotificationClickProps {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

export interface GrantAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  emails: string;
  setEmails: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  error?: string;
  success?: string;
}

export interface AuthorPostCardProps {
  content: Post;
  onPublish: (id: number) => void;
}

export interface ActionButtonProps {
  postId: number;
  hasPurchased: boolean;
}
