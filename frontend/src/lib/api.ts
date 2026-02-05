import { cache, CACHE_KEYS, CACHE_TTL } from './cache'

const API_BASE_URL = '/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adminToken');
  }
  return null;
};

// Helper function to make API requests with caching
const apiRequest = async (endpoint: string, options: RequestInit = {}, cacheKey?: string, cacheTTL?: number) => {
  const token = getAuthToken();
  
  // Check cache for GET requests
  if ((!options.method || options.method === 'GET') && cacheKey) {
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return cachedData
    }
  }
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  
  // Cache successful GET responses
  if ((!options.method || options.method === 'GET') && cacheKey && result.success) {
    cache.set(cacheKey, result, cacheTTL || CACHE_TTL.MEDIUM)
  }
  
  // Invalidate related cache on mutations
  if (options.method && ['POST', 'PUT', 'DELETE'].includes(options.method)) {
    invalidateRelatedCache(endpoint)
  }

  return result;
};

// Helper function to invalidate related cache entries
const invalidateRelatedCache = (endpoint: string) => {
  if (endpoint.includes('/stories')) {
    cache.delete(CACHE_KEYS.STORIES)
    cache.delete(CACHE_KEYS.ADMIN_STORIES)
    // Clear category-specific caches
    const categories = ['personal', 'work', 'lifestyle', 'popular', 'recent']
    categories.forEach(cat => cache.delete(CACHE_KEYS.STORIES_BY_CATEGORY(cat)))
  }
  
  if (endpoint.includes('/profile')) {
    cache.delete(CACHE_KEYS.PROFILE)
    cache.delete(CACHE_KEYS.ADMIN_PROFILE)
  }
  
  if (endpoint.includes('/gallery')) {
    cache.delete(CACHE_KEYS.GALLERY)
    cache.delete(CACHE_KEYS.ADMIN_GALLERY)
    cache.delete(CACHE_KEYS.INSTAGRAM_POSTS)
  }
  
  if (endpoint.includes('/settings')) {
    cache.delete(CACHE_KEYS.SETTINGS)
    cache.delete(CACHE_KEYS.ADMIN_SETTINGS)
  }
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.data.token) {
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  logout: async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
  },

  verifyToken: async () => {
    return apiRequest('/auth/verify-token');
  },

  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};

// Stories API
export const storiesAPI = {
  getPublishedStories: async (params?: {
    category?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.sort) searchParams.append('sort', params.sort);
    
    const query = searchParams.toString();
    const cacheKey = params?.category ? CACHE_KEYS.STORIES_BY_CATEGORY(params.category) : CACHE_KEYS.STORIES;
    return apiRequest(`/stories${query ? `?${query}` : ''}`, {}, cacheKey, CACHE_TTL.MEDIUM);
  },

  getPopularStories: async (limit?: number) => {
    return apiRequest(`/stories/popular${limit ? `?limit=${limit}` : ''}`, {}, CACHE_KEYS.STORIES_BY_CATEGORY('popular'), CACHE_TTL.MEDIUM);
  },

  getAdminStories: async (params?: {
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const query = searchParams.toString();
    return apiRequest(`/stories/admin${query ? `?${query}` : ''}`, {}, CACHE_KEYS.ADMIN_STORIES, CACHE_TTL.SHORT);
  },

  getStoryById: async (id: string) => {
    return apiRequest(`/stories/${id}`, {}, CACHE_KEYS.STORY_DETAIL(id), CACHE_TTL.LONG);
  },

  createStory: async (storyData: any) => {
    return apiRequest('/stories', {
      method: 'POST',
      body: JSON.stringify(storyData),
    });
  },

  updateStory: async (id: string, storyData: any) => {
    return apiRequest(`/stories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(storyData),
    });
  },

  deleteStory: async (id: string) => {
    return apiRequest(`/stories/${id}`, {
      method: 'DELETE',
    });
  },

  likeStory: async (id: string) => {
    return apiRequest(`/stories/${id}/like`, {
      method: 'POST',
    });
  },

  addComment: async (id: string, commentData: { name: string; email?: string; text: string }) => {
    return apiRequest(`/stories/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  },
};

// Profile API
export const profileAPI = {
  getPublicProfile: async () => {
    return apiRequest('/profile', {}, CACHE_KEYS.PROFILE, CACHE_TTL.LONG);
  },

  getAdminProfile: async () => {
    return apiRequest('/profile/admin', {}, CACHE_KEYS.ADMIN_PROFILE, CACHE_TTL.MEDIUM);
  },

  updateProfile: async (profileData: any) => {
    return apiRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  uploadProfileImage: async (file: File, alt?: string) => {
    const formData = new FormData();
    formData.append('profileImage', file);
    if (alt) formData.append('alt', alt);

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/profile/upload-image`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message);
    }

    const result = await response.json();
    
    // Transform the response to match frontend expectations
    if (result.success && result.data.profileImage) {
      return {
        ...result,
        data: {
          ...result.data,
          imageUrl: result.data.profileImage.url
        }
      };
    }
    
    return result;
  },

  updateStats: async () => {
    return apiRequest('/profile/stats', {
      method: 'PUT',
    });
  },

  updateServices: async (servicesData: any) => {
    return apiRequest('/profile/services', {
      method: 'PUT',
      body: JSON.stringify(servicesData),
    });
  },
};

// Gallery API
export const galleryAPI = {
  getGalleryImages: async (params?: {
    category?: string;
    isInstagramPost?: boolean;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.isInstagramPost !== undefined) searchParams.append('isInstagramPost', params.isInstagramPost.toString());
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const query = searchParams.toString();
    return apiRequest(`/gallery${query ? `?${query}` : ''}`);
  },

  getInstagramPosts: async (limit?: number) => {
    return apiRequest(`/gallery/instagram${limit ? `?limit=${limit}` : ''}`, {}, CACHE_KEYS.INSTAGRAM_POSTS, CACHE_TTL.LONG);
  },

  getAdminGallery: async (params?: {
    category?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.isActive !== undefined) searchParams.append('isActive', params.isActive.toString());
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const query = searchParams.toString();
    return apiRequest(`/gallery/admin${query ? `?${query}` : ''}`, {}, CACHE_KEYS.ADMIN_GALLERY, CACHE_TTL.SHORT);
  },

  getImageById: async (id: string) => {
    return apiRequest(`/gallery/${id}`);
  },

  uploadImage: async (file: File, imageData: any) => {
    const formData = new FormData();
    formData.append('image', file);
    
    // Add other image data
    Object.keys(imageData).forEach(key => {
      if (imageData[key] !== undefined && imageData[key] !== null) {
        formData.append(key, imageData[key].toString());
      }
    });

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/gallery/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message);
    }

    return response.json();
  },

  updateImage: async (id: string, imageData: any) => {
    return apiRequest(`/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(imageData),
    });
  },

  deleteImage: async (id: string) => {
    return apiRequest(`/gallery/${id}`, {
      method: 'DELETE',
    });
  },

  likeImage: async (id: string) => {
    return apiRequest(`/gallery/${id}/like`, {
      method: 'POST',
    });
  },

  reorderImages: async (imageIds: string[]) => {
    return apiRequest('/gallery/reorder', {
      method: 'PUT',
      body: JSON.stringify({ imageIds }),
    });
  },
};

// Settings API
export const settingsAPI = {
  getPublicSettings: async () => {
    return apiRequest('/settings', {}, CACHE_KEYS.SETTINGS, CACHE_TTL.VERY_LONG);
  },

  getAdminSettings: async () => {
    return apiRequest('/settings/admin', {}, CACHE_KEYS.ADMIN_SETTINGS, CACHE_TTL.LONG);
  },

  updateSettings: async (settingsData: any) => {
    return apiRequest('/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    });
  },

  updateSiteSettings: async (siteData: any) => {
    return apiRequest('/settings/site', {
      method: 'PUT',
      body: JSON.stringify({ site: siteData }),
    });
  },

  updateSocialMediaSettings: async (socialMediaData: any) => {
    return apiRequest('/settings/social-media', {
      method: 'PUT',
      body: JSON.stringify({ socialMedia: socialMediaData }),
    });
  },

  updateContentSettings: async (contentData: any) => {
    return apiRequest('/settings/content', {
      method: 'PUT',
      body: JSON.stringify({ content: contentData }),
    });
  },

  updateNotificationSettings: async (notificationData: any) => {
    return apiRequest('/settings/notifications', {
      method: 'PUT',
      body: JSON.stringify({ notifications: notificationData }),
    });
  },

  updateSecuritySettings: async (securityData: any) => {
    return apiRequest('/settings/security', {
      method: 'PUT',
      body: JSON.stringify({ security: securityData }),
    });
  },

  updateThemeSettings: async (themeData: any) => {
    return apiRequest('/settings/theme', {
      method: 'PUT',
      body: JSON.stringify({ theme: themeData }),
    });
  },

  updateSEOSettings: async (seoData: any) => {
    return apiRequest('/settings/seo', {
      method: 'PUT',
      body: JSON.stringify({ seo: seoData }),
    });
  },

  toggleMaintenanceMode: async (enabled: boolean, message?: string, allowedIPs?: string[]) => {
    return apiRequest('/settings/maintenance', {
      method: 'PUT',
      body: JSON.stringify({ enabled, message, allowedIPs }),
    });
  },

  resetSettings: async () => {
    return apiRequest('/settings/reset', {
      method: 'POST',
    });
  },
};

export default {
  auth: authAPI,
  stories: storiesAPI,
  profile: profileAPI,
  gallery: galleryAPI,
  settings: settingsAPI,
};

// Analytics API
export const analyticsAPI = {
  getDashboardData: async (period?: string) => {
    return apiRequest(`/analytics/dashboard${period ? `?period=${period}` : ''}`, {}, `analytics_dashboard_${period || '7d'}`, CACHE_TTL.SHORT);
  },

  getVisitors: async (page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const query = params.toString();
    return apiRequest(`/analytics/visitors${query ? `?${query}` : ''}`, {}, `analytics_visitors_${page || 1}`, CACHE_TTL.SHORT);
  },

  getComments: async (page?: number, limit?: number, status?: string) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (status) params.append('status', status);
    
    const query = params.toString();
    return apiRequest(`/analytics/comments${query ? `?${query}` : ''}`, {}, `analytics_comments_${status || 'all'}_${page || 1}`, CACHE_TTL.SHORT);
  },

  updateComment: async (id: string, action: string, moderationNotes?: string) => {
    return apiRequest(`/analytics/comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ action, moderationNotes })
    });
  },

  deleteComment: async (id: string) => {
    return apiRequest(`/analytics/comments/${id}`, {
      method: 'DELETE'
    });
  },

  trackPageView: async (data: any) => {
    return apiRequest('/analytics/track', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};