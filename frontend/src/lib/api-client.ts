import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest: any = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
              const response = await this.client.post('/auth/refresh', {
                refreshToken,
              });

              const { accessToken } = response.data;
              this.setToken(accessToken);

              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            this.clearTokens();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }

  private clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  async register(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) {
    const response = await this.client.post('/auth/register', data);
    const { accessToken, refreshToken } = response.data;
    this.setToken(accessToken);
    if (typeof window !== 'undefined') {
      localStorage.setItem('refreshToken', refreshToken);
    }
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    const { accessToken, refreshToken } = response.data;
    this.setToken(accessToken);
    if (typeof window !== 'undefined') {
      localStorage.setItem('refreshToken', refreshToken);
    }
    return response.data;
  }

  async logout() {
    this.clearTokens();
  }

  async getProfile() {
    const response = await this.client.get('/auth/profile');
    return response.data;
  }

  async getRedditAccounts(active?: boolean) {
    const response = await this.client.get('/reddit/accounts', {
      params: { active },
    });
    return response.data;
  }

  async createRedditAccount(data: any) {
    const response = await this.client.post('/reddit/accounts', data);
    return response.data;
  }

  async syncAccount(accountId: string) {
    const response = await this.client.post(`/reddit/accounts/${accountId}/sync`);
    return response.data;
  }

  async syncAllAccounts() {
    const response = await this.client.post('/reddit/sync-all');
    return response.data;
  }

  async getPosts(filters?: {
    accountIds?: string[];
    startDate?: string;
    endDate?: string;
    sentiment?: string;
    tickers?: string[];
    limit?: number;
    offset?: number;
  }) {
    const params: any = {};
    if (filters?.accountIds) params.accountIds = filters.accountIds.join(',');
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;
    if (filters?.sentiment) params.sentiment = filters.sentiment;
    if (filters?.tickers) params.tickers = filters.tickers.join(',');
    if (filters?.limit) params.limit = filters.limit;
    if (filters?.offset) params.offset = filters.offset;

    const response = await this.client.get('/posts', { params });
    return response.data;
  }

  async getTopPosts(days?: number, limit?: number) {
    const response = await this.client.get('/posts/top', {
      params: { days, limit },
    });
    return response.data;
  }

  async getPost(id: string) {
    const response = await this.client.get(`/posts/${id}`);
    return response.data;
  }

  async getSentimentTrends(days?: number) {
    const response = await this.client.get('/analysis/sentiment', {
      params: { days },
    });
    return response.data;
  }

  async getTrendingTickers(days?: number, limit?: number) {
    const response = await this.client.get('/analysis/tickers', {
      params: { days, limit },
    });
    return response.data;
  }

  async getSectorDistribution(days?: number) {
    const response = await this.client.get('/analysis/sectors', {
      params: { days },
    });
    return response.data;
  }

  async getTrendingThemes(days?: number, limit?: number) {
    const response = await this.client.get('/analysis/themes', {
      params: { days, limit },
    });
    return response.data;
  }

  async getCurrentStrategy() {
    const response = await this.client.get('/strategy/current');
    return response.data;
  }

  async getStrategyHistory(limit?: number) {
    const response = await this.client.get('/strategy/history', {
      params: { limit },
    });
    return response.data;
  }

  async generateStrategy(days?: number) {
    const response = await this.client.post('/strategy/generate', null, {
      params: { days },
    });
    return response.data;
  }

  async saveStrategy(strategyId: string, notes?: string) {
    const response = await this.client.post(`/strategy/save/${strategyId}`, { notes });
    return response.data;
  }

  async getSavedStrategies() {
    const response = await this.client.get('/strategy/saved');
    return response.data;
  }

  async getWatchlists() {
    const response = await this.client.get('/watchlists');
    return response.data;
  }

  async createWatchlist(data: any) {
    const response = await this.client.post('/watchlists', data);
    return response.data;
  }

  async updateWatchlist(id: string, data: any) {
    const response = await this.client.put(`/watchlists/${id}`, data);
    return response.data;
  }

  async deleteWatchlist(id: string) {
    const response = await this.client.delete(`/watchlists/${id}`);
    return response.data;
  }

  async addTickerToWatchlist(watchlistId: string, ticker: string, notes?: string) {
    const response = await this.client.post(`/watchlists/${watchlistId}/tickers`, {
      ticker,
      notes,
    });
    return response.data;
  }

  async removeTickerFromWatchlist(watchlistId: string, ticker: string) {
    const response = await this.client.delete(`/watchlists/${watchlistId}/tickers/${ticker}`);
    return response.data;
  }
}

export const apiClient = new ApiClient();
