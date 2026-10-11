import type { Opportunity } from '../types/opportunity';

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
).replace(/\/$/, '');

export class ApiError extends Error {
  statusCode: number;
  details?: string[];

  constructor(message: string, statusCode: number, details?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const isJson = response.headers
    .get('content-type')
    ?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    let errorMessage = 'An unexpected error occurred';
    let details: string[] | undefined;

    if (data) {
      if (Array.isArray(data.message)) {
        errorMessage = data.message.join(', ');
        details = data.message;
      } else if (typeof data.message === 'string') {
        errorMessage = data.message;
      } else if (data.error) {
        errorMessage = data.error;
      }
    } else {
      errorMessage = response.statusText || `HTTP Error ${response.status}`;
    }

    throw new ApiError(errorMessage, response.status, details);
  }

  return data as T;
}

export const api = {
  /**
   * GET /api/opportunities
   */
  async getOpportunities(statusFilter?: string): Promise<Opportunity[]> {
    const url = new URL(`${API_BASE_URL}/opportunities`);
    if (statusFilter && statusFilter !== 'All') {
      url.searchParams.set('status', statusFilter);
    }
    const response = await fetch(url.toString());
    return handleResponse<Opportunity[]>(response);
  },

  /**
   * GET /api/opportunities/:id
   */
  async getOpportunity(id: string): Promise<Opportunity> {
    const response = await fetch(`${API_BASE_URL}/opportunities/${id}`);
    return handleResponse<Opportunity>(response);
  },

  /**
   * POST /api/opportunities
   */
  async createOpportunity(data: Omit<Opportunity, '_id' | 'createdAt' | 'updatedAt'>): Promise<Opportunity> {
    const response = await fetch(`${API_BASE_URL}/opportunities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Opportunity>(response);
  },

  /**
   * PUT /api/opportunities/:id
   */
  async updateOpportunity(id: string, data: Partial<Opportunity>): Promise<Opportunity> {
    const response = await fetch(`${API_BASE_URL}/opportunities/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Opportunity>(response);
  },

  /**
   * Mark opportunity as Closed via PUT
   */
  async closeOpportunity(id: string): Promise<Opportunity> {
    return this.updateOpportunity(id, { status: 'Closed' });
  },

  /**
   * DELETE /api/opportunities/:id
   */
  async deleteOpportunity(id: string): Promise<{ message: string; id: string }> {
    const response = await fetch(`${API_BASE_URL}/opportunities/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<{ message: string; id: string }>(response);
  },
};
