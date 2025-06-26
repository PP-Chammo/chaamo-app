export interface AuthStore {
  isAuthenticated: boolean;
}

export const authStore: AuthStore = {
  isAuthenticated: false,
};
