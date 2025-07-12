import { authStore } from '../authStore';

describe('authStore', () => {
  it('should have isAuthenticated as false by default', () => {
    expect(authStore.isAuthenticated).toBe(false);
  });
});
