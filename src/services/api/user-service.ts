
import { SupabaseService } from './supabase-service';
import { UserProfile } from '@/types/user';

export interface SupabaseQueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  ascending?: boolean;
  filters?: Array<{ column: string; operator: string; value: any }>;
}

export interface UserServiceOptions {
  supabaseService: SupabaseService;
}

export class UserService {
  private readonly supabaseService: SupabaseService;

  constructor(options: UserServiceOptions) {
    this.supabaseService = options.supabaseService;
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const result = await this.supabaseService.getClient()
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      return result.data ? result.data as UserProfile : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get user profile: ${errorMessage}`);
    }
  }

  async updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const result = await this.supabaseService.getClient()
        .from('user_profiles')
        .update(profile)
        .eq('id', userId)
        .select('*')
        .single();

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.data as UserProfile;
    } catch (error) {
      console.error('Error updating user profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to update user profile: ${errorMessage}`);
    }
  }

  async deleteUserAccount(userId: string): Promise<void> {
    try {
      const result = await this.supabaseService.getClient()
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Error deleting user account:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to delete user account: ${errorMessage}`);
    }
  }

  async fetchAllUserProfiles(options: SupabaseQueryOptions = {}): Promise<UserProfile[]> {
    return this.supabaseService.fetchData<UserProfile>('user_profiles', options);
  }

  async createUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    return this.supabaseService.insertData<UserProfile>('user_profiles', profile);
  }

  async fetchUserProfileById(profileId: string): Promise<UserProfile> {
    const profiles = await this.supabaseService.fetchData<UserProfile>('user_profiles', {
      filters: [{ column: 'id', operator: 'eq', value: profileId }],
    });
    
    if (!profiles || profiles.length === 0) {
      throw new Error(`User profile with id ${profileId} not found`);
    }
    return profiles[0];
  }

  async replaceUserProfile(profileId: string, profile: Partial<UserProfile>): Promise<UserProfile> {
    return this.supabaseService.updateData<UserProfile>('user_profiles', profileId, profile);
  }

  async removeUserProfile(profileId: string): Promise<void> {
    await this.supabaseService.deleteData('user_profiles', profileId);
  }

  async queryUserProfiles(query: (queryBuilder: any) => any): Promise<UserProfile[]> {
    return this.supabaseService.query<UserProfile>('user_profiles', query);
  }
}

export const mockUserService = new UserService({
  supabaseService: new SupabaseService()
});

export default UserService;
