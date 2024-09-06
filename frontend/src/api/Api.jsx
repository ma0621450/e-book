import axios from "axios";
import { router } from "./endpoints";
import { getCsrfToken } from "./utils";

const csrfToken = getCsrfToken();

// Register user
export const registerUser = async (formData) => {
  try {
    const response = await axios.post(router.user.register, formData, {
      headers: { "X-CSRF-TOKEN": csrfToken },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(
      router.user.login,
      { email, password },
      { headers: { "X-CSRF-TOKEN": csrfToken } }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch post by ID
export const fetchPost = async (id) => {
  try {
    const response = await axios.get(router.content.singlePost(id));
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Create or update content
export const saveContent = async (id, content) => {
  try {
    if (id) {
      return await axios.put(router.content.updateContent(id), content, {
        headers: { "X-CSRF-TOKEN": csrfToken },
      });
    } else {
      return await axios.post(router.content.createContent, content, {
        headers: { "X-CSRF-TOKEN": csrfToken },
      });
    }
  } catch (error) {
    handleError(error);
  }
};

// Fetch purchased content
export const fetchPurchasedContent = async () => {
  try {
    const response = await axios.get(router.content.fetchPurchasedContent);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch author profile
export const fetchAuthorProfile = async () => {
  try {
    const response = await axios.get(router.author.fetchAuthorProfile);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Update author bio
export const updateBio = async (bio) => {
  try {
    const response = await axios.post(
      router.author.editAuthorProfile,
      { bio },
      { headers: { "X-CSRF-TOKEN": csrfToken } }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch author publications
export const fetchAuthorPublications = async () => {
  try {
    const response = await axios.get(router.author.fetchAuthorPublications);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch content
export const fetchContent = async () => {
  try {
    const response = await axios.get(router.content.fetchContent);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch author profile by ID
export const fetchAuthor_Profile = async (id) => {
  try {
    const response = await axios.get(router.author.fetchAuthor_Profile(id));
    return response.data;
  } catch (error) {
    handleError(error, "Error fetching author profile");
  }
};

// Fetch author posts
export const fetchAuthorPosts = async (id) => {
  try {
    const response = await axios.get(router.content.fetchAuthorPosts(id));
    return response.data;
  } catch (error) {
    handleError(error, "Error fetching author posts");
  }
};

// Fetch authors
export const fetchAuthors = async () => {
  try {
    const response = await axios.get(router.admin.fetchAuthors);
    return response.data;
  } catch (error) {
    handleError(error, "Error fetching authors");
  }
};

// Verify author
export const verifyAuthor = async (id) => {
  try {
    await axios.post(
      router.admin.verifyAuthor(id),
      {},
      { headers: { "X-CSRF-TOKEN": csrfToken } }
    );
  } catch (error) {
    handleError(error, "Error verifying author");
  }
};

// Block or unblock user
export const blockUnblockUser = async (id, isBlocked) => {
  const url = isBlocked
    ? router.admin.unblockUser(id)
    : router.admin.blockUser(id);
  try {
    await axios.post(url, {}, { headers: { "X-CSRF-TOKEN": csrfToken } });
  } catch (error) {
    handleError(error, `Error ${isBlocked ? "unblocking" : "blocking"} user`);
  }
};

// Purchase content
export const purchaseContent = async (contentId) => {
  try {
    const response = await axios.post(
      router.content.purchaseContent,
      { content_id: contentId },
      { headers: { "X-CSRF-TOKEN": csrfToken } }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Logout
export const logout = async () => {
  try {
    await axios.post(router.user.logout);
  } catch (error) {
    handleError(error);
  }
};

// Mark notification as read
export const markNotificationAsRead = async (id) => {
  try {
    await axios.patch(router.author.markNotificationRead(id));
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

// Toggle publish
export const togglePublish = async (contentId) => {
  try {
    const response = await axios.patch(
      router.content.togglePublish(contentId),
      {},
      { headers: { "X-CSRF-TOKEN": csrfToken } }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error toggling publish status:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get user IDs
export const getUserIds = async (emails) => {
  try {
    const response = await axios.post(router.admin.getUserIds, { emails });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user IDs:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Grant access
export const grantAccess = async (userIds, contentId) => {
  try {
    const response = await axios.post(router.author.grantAccess, {
      userIds,
      contentId,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error granting access:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Error handling function
const handleError = (
  error,
  defaultMessage = "An unexpected error occurred."
) => {
  if (error.response) {
    if (error.response.status === 422) {
      const validationErrors = error.response.data.errors;
      const errorMessages = Object.values(validationErrors).flat();
      throw new Error(errorMessages.join(", "));
    } else if (error.response.status >= 500) {
      throw new Error("Server error, please try again later.");
    } else {
      throw new Error(error.response.data.message || defaultMessage);
    }
  } else {
    throw new Error(defaultMessage);
  }
};
