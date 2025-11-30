import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Owner } from '../types';

type AuthStore = {
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExp: number | null;
  refreshTokenExp: number | null;
  owner: Owner | Partial<Owner> | null;

  setTokens: (tokens: {
    accessToken: string;
    refreshToken: string;
    accessTokenExp: number;
    refreshTokenExp: number;
  }) => Promise<void>;

  setOwner: (owner: Owner | Partial<Owner>) => Promise<void>;

  clearAuth: () => Promise<void>;

  loadAuth: () => Promise<void>;
};

// --- Safe SecureStore getter
async function safeGet(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (err) {
    console.warn(`[SecureStore] Failed to read key "${key}"`, err);
    return null;
  }
}

// --- Safe SecureStore deleter
async function safeDelete(key: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (err) {
    console.warn(`[SecureStore] Failed to delete key "${key}"`, err);
  }
}

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  refreshToken: null,
  accessTokenExp: null,
  refreshTokenExp: null,
  owner: null,

  // --- Save all tokens
  setTokens: async ({ accessToken, refreshToken, accessTokenExp, refreshTokenExp }) => {
    await Promise.all([
      SecureStore.setItemAsync('accessToken', accessToken),
      SecureStore.setItemAsync('refreshToken', refreshToken),
      SecureStore.setItemAsync('accessTokenExp', accessTokenExp.toString()),
      SecureStore.setItemAsync('refreshTokenExp', refreshTokenExp.toString()),
    ]);

    set({ accessToken, refreshToken, accessTokenExp, refreshTokenExp });
  },

  // --- Save owner data
  setOwner: async (owner: Owner | Partial<Owner>) => {
    await SecureStore.setItemAsync('owner', JSON.stringify(owner));
    set({ owner });
  },

  // --- Clear all auth data
  clearAuth: async () => {
    await Promise.all([
      safeDelete('accessToken'),
      safeDelete('refreshToken'),
      safeDelete('accessTokenExp'),
      safeDelete('refreshTokenExp'),
      safeDelete('owner'),
    ]);

    set({
      accessToken: null,
      refreshToken: null,
      accessTokenExp: null,
      refreshTokenExp: null,
      owner: null,
    });
  },

  // --- Load all auth data safely
  loadAuth: async () => {
    const [accessToken, refreshToken, accessTokenExpStr, refreshTokenExpStr, ownerStr] =
      await Promise.all([
        safeGet('accessToken'),
        safeGet('refreshToken'),
        safeGet('accessTokenExp'),
        safeGet('refreshTokenExp'),
        safeGet('owner'),
      ]);

    const accessTokenExp = accessTokenExpStr ? parseInt(accessTokenExpStr, 10) : null;
    const refreshTokenExp = refreshTokenExpStr ? parseInt(refreshTokenExpStr, 10) : null;

    // Fallback validation
    const validAccessExp = !isNaN(accessTokenExp ?? NaN) ? accessTokenExp : null;
    const validRefreshExp = !isNaN(refreshTokenExp ?? NaN) ? refreshTokenExp : null;

    let owner: Owner | null = null;
    if (ownerStr) {
      try {
        owner = JSON.parse(ownerStr);
      } catch {
        console.warn('[SecureStore] Corrupted owner data — clearing it.');
        await safeDelete('owner');
      }
    }

    set({
      accessToken: accessToken ?? null,
      refreshToken: refreshToken ?? null,
      accessTokenExp: validAccessExp,
      refreshTokenExp: validRefreshExp,
      owner,
    });
  },
}));
