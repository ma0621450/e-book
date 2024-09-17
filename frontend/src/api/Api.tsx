import { apiRequest } from "./axiosInstance";
import { router } from "./endpoints";
import {
  FormValues,
  Post,
  Author,
  User,
  AuthorProfile,
  GrantAccessResponse,
} from "../interfaces";

// Register user
export const registerUser = async (formData: FormData): Promise<void> => {
  const response = await apiRequest<any>(
    router.user.register,
    "post",
    formData
  );
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
};

// Login user
export const loginUser = async (
  formData: FormData
): Promise<{ user: User; author: Author }> => {
  const response = await apiRequest<{ user: User; author: Author }>(
    router.user.login,
    "post",
    formData
  );
  if (response.error) {
    throw new Error(response.error);
  }
  if (!response.data) {
    throw new Error("User not found.");
  }
  return response.data;
};

// Fetch post by ID
export const fetchPostById = async (id: string): Promise<Post> => {
  const response = await apiRequest<Post>(router.content.singlePost(id), "get");
  if (response.error) {
    throw new Error(response.error);
  }
  if (!response.data) {
    throw new Error("Post not found.");
  }
  return response.data;
};

// Create or update content
export const saveContent = async (
  id: string | null,
  formData: FormData
): Promise<void> => {
  const url = id
    ? router.content.updateContent(id)
    : router.content.createContent;
  const method = id ? "put" : "post";
  const response = await apiRequest<any>(url, method, formData);
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
};

// Fetch purchased content
export const fetchPurchasedContent = async (): Promise<any> => {
  const response = await apiRequest<any>(
    router.content.fetchPurchasedContent,
    "get"
  );
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
};

// Fetch author profile
export const fetchAuthorProfile = async (): Promise<AuthorProfile> => {
  const response = await apiRequest<AuthorProfile>(
    router.author.fetchAuthorProfile,
    "get"
  );
  if (response.error) {
    throw new Error(response.error);
  }
  if (!response.data) {
    throw new Error("Author profile data is missing.");
  }
  return response.data;
};

// Fetch author profile by ID
export const fetchAuthorProfileById = async (
  id: string
): Promise<AuthorProfile> => {
  const response = await apiRequest<AuthorProfile>(
    router.author.fetchAuthor_Profile(id),
    "get"
  );
  if (response.error) {
    throw new Error(response.error);
  }
  if (!response.data) {
    throw new Error("Author profile data is missing.");
  }
  return response.data;
};

// Update author bio and profile picture
export const updateBioAndPfp = async (
  bio: string,
  pfp: File | null
): Promise<void> => {
  const formData = new FormData();
  formData.append("bio", bio);
  if (pfp) {
    formData.append("pfp", pfp);
  }
  const response = await apiRequest<any>(
    router.author.editAuthorProfile,
    "post",
    formData
  );
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
};

// Fetch author publications
export const fetchAuthorPublications = async (): Promise<any> => {
  const response = await apiRequest<any>(
    router.author.fetchAuthorPublications,
    "get"
  );
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
};

// Check if user has purchased content
export const checkPostPurchased = async (postId: number): Promise<boolean> => {
  const response = await apiRequest<{ purchased: boolean }>(
    router.content.checkUserPurchasedContent(postId),
    "get"
  );
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data?.purchased || false;
};

// Fetch content
export const fetchContent = async (page = 1): Promise<any> => {
  const response = await apiRequest<any>(
    `${router.content.fetchContent}?page=${page}`,
    "get"
  );
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
};

// Fetch author posts
export const fetchAuthorPosts = async (id: string): Promise<any> => {
  const response = await apiRequest<any>(
    router.content.fetchAuthorPosts(id),
    "get"
  );
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
};

// Fetch authors
export const fetchAuthors = async (): Promise<any> => {
  const response = await apiRequest<any>(router.admin.fetchAuthors, "get");
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
};

// Verify author
export const verifyAuthor = async (id: string): Promise<void> => {
  const response = await apiRequest<void>(
    router.admin.verifyAuthor(id),
    "post"
  );
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
};

// Block or unblock user
export const blockUnblockUser = async (
  id: string,
  isBlocked: boolean
): Promise<void> => {
  const url = isBlocked
    ? router.admin.unblockUser(id)
    : router.admin.blockUser(id);
  const response = await apiRequest<void>(url, "post");
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
};

// Purchase content
export const purchaseContent = async (contentId: string): Promise<void> => {
  const response = await apiRequest<any>(
    router.content.purchaseContent,
    "post",
    { content_id: contentId }
  );
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
};

// Logout
export const logout = async (): Promise<void> => {
  const response = await apiRequest<void>(router.user.logout, "post");
  if (response.error) {
    throw new Error(response.error);
  }
  localStorage.removeItem("user");
  localStorage.removeItem("author");
  return response.data;
};

// Fetch notifications
export const fetchNotifications = async (): Promise<any> => {
  const response = await apiRequest<any>(
    router.author.fetchNotifications,
    "get"
  );
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
};

// Grant access
export const grantAccess = async (
  userIds: number[],
  contentId: number
): Promise<GrantAccessResponse> => {
  const response = await apiRequest<GrantAccessResponse>(
    router.author.grantAccess,
    "post",
    { userIds, contentId }
  );
  if (response.error) {
    throw new Error(response.error);
  }
  if (!response.data) {
    throw new Error("Grant access response data is missing.");
  }
  return response.data;
};

// Mark notification as read
export const markNotificationAsRead = async (id: string): Promise<void> => {
  const response = await apiRequest<void>(
    router.author.markNotificationRead(id),
    "patch"
  );
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
};

// Toggle publish
export const togglePublish = async (contentId: string): Promise<void> => {
  const response = await apiRequest<any>(
    router.content.togglePublish(contentId),
    "patch"
  );
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
};

// Get user IDs
export const getUserIds = async (emails: string[]): Promise<any> => {
  const response = await apiRequest<any>(router.admin.getUserIds, "post", {
    emails,
  });
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
};
