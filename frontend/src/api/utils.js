export const getCsrfToken = () => {
  return document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");
};

export const saveUserToLocalStorage = (user, author) => {
  localStorage.setItem("user", JSON.stringify(user));

  if (author) {
    localStorage.setItem("author", JSON.stringify(author));
  } else {
    localStorage.removeItem("author");
  }
};

export const removeAuthorFromLocalStorage = () => {
  localStorage.removeItem("author");
};

export const getRoleBasedRoute = (roleId) => {
  const roleRoutes = {
    1: "/",
    2: "/author/profile/edit",
    3: "/admin",
  };

  return roleRoutes[roleId] || "/";
};
