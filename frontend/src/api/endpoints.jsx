export const API_BASE_URL = "/api";

export const router = {
  user: {
    register: `${API_BASE_URL}/register`,
    login: `${API_BASE_URL}/login`,
    logout: `${API_BASE_URL}/logout`,
  },
  content: {
    createContent: `${API_BASE_URL}/createContent`,
    updateContent: (id) => `${API_BASE_URL}/updateContent/${id}`,
    singlePost: (id) => `${API_BASE_URL}/post/${id}`,
    fetchContent: `${API_BASE_URL}/content`,
    fetchPurchasedContent: `${API_BASE_URL}/purchased-content`,
    purchaseContent: `${API_BASE_URL}/purchase`,
    togglePublish: (contentId) =>
      `${API_BASE_URL}/content/${contentId}/publish`,
    fetchAuthorPosts: (id) => `${API_BASE_URL}/author/${id}/posts`,
  },
  author: {
    editAuthorProfile: `${API_BASE_URL}/editBio`,
    fetchAuthorProfile: `${API_BASE_URL}/author-profile`,
    fetchAuthorPublications: `${API_BASE_URL}/publications`,
    fetchAuthor_Profile: (id) => `${API_BASE_URL}/author/${id}`,
    grantAccess: `${API_BASE_URL}/grant-access`,
    markNotificationRead: (id) =>
      `${API_BASE_URL}/notifications/${id}/mark-read`,
  },
  admin: {
    blockUser: (id) => `${API_BASE_URL}/block-user/${id}`,
    unblockUser: (id) => `${API_BASE_URL}/unblock-user/${id}`,
    verifyAuthor: (id) => `${API_BASE_URL}/admin/verify-author/${id}`,
    fetchAuthors: `${API_BASE_URL}/admin/authors`,
    getUserIds: `${API_BASE_URL}/get-user-ids`,
  },
};
