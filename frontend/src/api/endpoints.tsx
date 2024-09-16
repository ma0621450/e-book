export const API_BASE_URL = "/api";

export const router = {
  user: {
    register: `${API_BASE_URL}/register`,
    login: `${API_BASE_URL}/login`,
    logout: `${API_BASE_URL}/logout`,
  },
  content: {
    createContent: `${API_BASE_URL}/createContent`,
    updateContent: (id: string) => `${API_BASE_URL}/updateContent/${id}`,
    singlePost: (id: string) => `${API_BASE_URL}/post/${id}`,
    fetchContent: `${API_BASE_URL}/content`,
    fetchPurchasedContent: `${API_BASE_URL}/purchased-content`,
    purchaseContent: `${API_BASE_URL}/purchase`,
    togglePublish: (contentId: string) =>
      `${API_BASE_URL}/content/${contentId}/publish`,
    fetchAuthorPosts: (id: string) => `${API_BASE_URL}/author/${id}/posts`,
    checkUserPurchasedContent: (postId: number) =>
      `${API_BASE_URL}/posts/${postId}/purchased`,
  },
  author: {
    editAuthorProfile: `${API_BASE_URL}/editBio`,
    fetchAuthorProfile: `${API_BASE_URL}/author-profile`,
    fetchAuthorPublications: `${API_BASE_URL}/publications`,
    fetchAuthor_Profile: (id: string) => `${API_BASE_URL}/author/${id}`,
    grantAccess: `${API_BASE_URL}/grant-access`,
    fetchNotifications: `${API_BASE_URL}/notifications`,
    markNotificationRead: (id: string) =>
      `${API_BASE_URL}/notifications/${id}/mark-read`,
  },
  admin: {
    blockUser: (id: string) => `${API_BASE_URL}/block-user/${id}`,
    unblockUser: (id: string) => `${API_BASE_URL}/unblock-user/${id}`,
    verifyAuthor: (id: string) => `${API_BASE_URL}/admin/verify-author/${id}`,
    fetchAuthors: `${API_BASE_URL}/admin/authors`,
    getUserIds: `${API_BASE_URL}/get-user-ids`,
  },
};
