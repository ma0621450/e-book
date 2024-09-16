import axios from "axios";
import { router } from "./endpoints";
import { getCsrfToken } from "./utils";

const csrfToken: string = getCsrfToken() || "";

// Helper function to handle API errors
const handleError = (
  error: unknown,
  defaultMessage: string = "An unexpected error occurred."
): void => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      if (error.response.status === 422) {
        const validationErrors = error.response.data.errors;

        if (validationErrors && typeof validationErrors === "object") {
          const errorMessages = Object.values(
            validationErrors
          ).flat() as string[];
          throw new Error(errorMessages.join(", "));
        } else {
          throw new Error("Validation failed but errors format is unexpected.");
        }
      } else if (error.response.status >= 500) {
        throw new Error("Server error, please try again later.");
      } else {
        throw new Error(error.response.data.message || defaultMessage);
      }
    } else {
      throw new Error(error.message || defaultMessage);
    }
  } else if (error instanceof Error) {
    throw new Error(error.message || defaultMessage);
  } else {
    throw new Error(defaultMessage);
  }
};

// Register user
export const registerUser = async (formData: FormData): Promise<any> => {
  try {
    const response = await axios.post(router.user.register, formData, {
      headers: { "X-CSRF-TOKEN": csrfToken },
    });
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw error;
  }
};

// Login user
export const loginUser = async (
  email: string,
  password: string
): Promise<any> => {
  try {
    const response = await axios.post(
      router.user.login,
      { email, password },
      { headers: { "X-CSRF-TOKEN": csrfToken } }
    );
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw error;
  }
};

// Fetch post by ID
export const fetchPostbyId = async (id: string): Promise<any> => {
  try {
    const response = await axios.get(router.content.singlePost(id));
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw error;
  }
};

// Create or update content
export const saveContent = async (
  id: string | null,
  formData: FormData
): Promise<any> => {
  try {
    const url = id
      ? router.content.updateContent(id)
      : router.content.createContent;
    const response = await axios({
      method: id ? "put" : "post",
      url,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        "X-CSRF-TOKEN": csrfToken,
      },
    });

    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw error;
  }
};

// Fetch purchased content
export const fetchPurchasedContent = async (): Promise<any> => {
  try {
    const response = await axios.get(router.content.fetchPurchasedContent);
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw error;
  }
};

// Fetch author profile
interface AuthorProfile {
  bio: string;
  is_verified: boolean;
}

export const fetchAuthorProfile = async (): Promise<AuthorProfile> => {
  try {
    const response = await axios.get<AuthorProfile>(
      router.author.fetchAuthorProfile
    );
    return response.data;
  } catch (error) {
    // Handle the error appropriately
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }
    throw new Error("An unexpected error occurred.");
  }
};

// Define the type for the author profile data
interface AuthorProfile {
  bio: string;
  is_verified: boolean;
  pfp: string; // or other fields as needed
  // Add additional fields based on your API response
}

// Fetch author profile by ID
// API function to fetch author profile by ID
// Fetch author profile by ID
export const fetchAuthorProfileById = async (
  id: string
): Promise<AuthorProfile> => {
  try {
    const response = await axios.get<AuthorProfile>(
      router.author.fetchAuthor_Profile(id)
    );
    return response.data;
  } catch (error) {
    handleError(error, "Error fetching author profile");
    throw error;
  }
};

// Update author bio and profile picture
export const updateBioAndPfp = async (
  bio: string,
  pfp: File | null
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("bio", bio);
    if (pfp) {
      formData.append("pfp", pfp);
    }

    const response = await axios.post(
      router.author.editAuthorProfile,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRF-TOKEN": csrfToken,
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw error;
  }
};

// Fetch author publications
export const fetchAuthorPublications = async (): Promise<any> => {
  try {
    const response = await axios.get(router.author.fetchAuthorPublications);
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw error;
  }
};
// check if user has purchased content
export const checkPostPurchased = async (postId: number): Promise<boolean> => {
  try {
    const response = await axios.get(
      router.content.checkUserPurchasedContent(postId)
    );
    return response.data.purchased;
  } catch (error) {
    console.error("Failed to check if post is purchased", error);
    throw error;
  }
};

// Fetch content
export const fetchContent = async (page = 1): Promise<any> => {
  try {
    const response = await axios.get(
      `${router.content.fetchContent}?page=${page.toString()}`
    );
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw error;
  }
};

// Fetch author posts
export const fetchAuthorPosts = async (id: string): Promise<any> => {
  try {
    const response = await axios.get(router.content.fetchAuthorPosts(id));
    return response.data;
  } catch (error: unknown) {
    handleError(error, "Error fetching author posts");
    throw error;
  }
};

// Fetch authors
export const fetchAuthors = async (): Promise<any> => {
  try {
    const response = await axios.get(router.admin.fetchAuthors);
    return response.data;
  } catch (error: unknown) {
    handleError(error, "Error fetching authors");
    throw error;
  }
};

// Verify author
export const verifyAuthor = async (id: string): Promise<void> => {
  try {
    await axios.post(
      router.admin.verifyAuthor(id),
      {},
      { headers: { "X-CSRF-TOKEN": csrfToken } }
    );
  } catch (error: unknown) {
    handleError(error, "Error verifying author");
    throw error;
  }
};

// Block or unblock user
export const blockUnblockUser = async (
  id: string,
  isBlocked: boolean
): Promise<void> => {
  const url = isBlocked
    ? router.admin.unblockUser(id)
    : router.admin.blockUser(id);
  try {
    await axios.post(url, {}, { headers: { "X-CSRF-TOKEN": csrfToken } });
  } catch (error: unknown) {
    handleError(error, `Error ${isBlocked ? "unblocking" : "blocking"} user`);
    throw error;
  }
};

// Purchase content
export const purchaseContent = async (contentId: string): Promise<any> => {
  try {
    const response = await axios.post(
      router.content.purchaseContent,
      { content_id: contentId },
      { headers: { "X-CSRF-TOKEN": csrfToken } }
    );
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw error;
  }
};

// Logout
export const logout = async (): Promise<void> => {
  try {
    await axios.post(router.user.logout);
    localStorage.removeItem("user");
    localStorage.removeItem("author");
  } catch (error: unknown) {
    handleError(error);
    throw error;
  }
};

// Fetching Notifications
export const fetchNotifications = async (): Promise<any> => {
  try {
    const response = await axios.get(router.author.fetchNotifications);
    return response.data;
  } catch (error: unknown) {
    handleError(error, "Error fetching notifications");
    throw error;
  }
};

// Grant access
interface GrantAccessRequest {
  userIds: number[];
  contentId: number;
}

interface GrantAccessResponse {
  success: boolean;
  message: string;
  // Add other fields based on your API response
}

export const grantAccess = async (
  userIds: number[],
  contentId: number
): Promise<GrantAccessResponse> => {
  try {
    const response = await axios.post<GrantAccessResponse>(
      router.author.grantAccess,
      { userIds, contentId },
      { headers: { "X-CSRF-TOKEN": csrfToken } }
    );
    return response.data;
  } catch (error: unknown) {
    handleError(error, "Error granting access");
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (id: string): Promise<void> => {
  try {
    await axios.patch(
      router.author.markNotificationRead(id),
      {},
      { headers: { "X-CSRF-TOKEN": csrfToken } }
    );
  } catch (error: unknown) {
    handleError(error, "Error marking notification as read");
    throw error;
  }
};

// Toggle publish
export const togglePublish = async (contentId: any): Promise<any> => {
  try {
    const response = await axios.patch(
      router.content.togglePublish(contentId),
      {},
      { headers: { "X-CSRF-TOKEN": csrfToken } }
    );
    return response.data;
  } catch (error: unknown) {
    handleError(error, "Error toggling publish status");
    throw error;
  }
};

// Get user IDs
export const getUserIds = async (emails: string[]): Promise<any> => {
  try {
    const response = await axios.post(router.admin.getUserIds, { emails });
    return response.data;
  } catch (error: unknown) {
    handleError(error, "Error fetching user IDs");
    throw error;
  }
};
