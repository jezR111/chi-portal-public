// src/features/yin/services/insightSyncService.ts
import { createClient } from '@/lib/db/supabase/client';

export class InsightSyncService {
  private static instance: InsightSyncService;
  private syncInterval: NodeJS.Timeout | null = null;
  private isSyncing = false;

  static getInstance(): InsightSyncService {
    if (!InsightSyncService.instance) {
      InsightSyncService.instance = new InsightSyncService();
    }
    return InsightSyncService.instance;
  }

  // Start periodic sync attempts
  startSync() {
    // Try to sync immediately
    this.syncLocalInsights();
    
    // Then check every 30 seconds
    this.syncInterval = setInterval(() => {
      this.syncLocalInsights();
    }, 30000);

    // Also sync when coming back online
    window.addEventListener('online', () => {
      console.log('Back online - attempting sync');
      this.syncLocalInsights();
    });
  }

  stopSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  async syncLocalInsights() {
    if (this.isSyncing) return;
    
    this.isSyncing = true;
    
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        this.isSyncing = false;
        return;
      }

      // Get local insights that haven't been synced
      const wallPosts = JSON.parse(localStorage.getItem('wallOfInsights') || '[]');
      const localOnly = wallPosts.filter((post: any) => post.local === true);
      
      if (localOnly.length === 0) {
        this.isSyncing = false;
        return;
      }

      console.log(`Attempting to sync ${localOnly.length} local insights`);

      // Try to sync each local insight
      for (const localInsight of localOnly) {
        try {
          const { data, error } = await supabase
            .from('community_insights')
            .insert({
              user_id: user.id,
              username: localInsight.author || localInsight.username || 'Anonymous Seeker',
              insight: localInsight.content || localInsight.insight,
              category: localInsight.category || 'manual',
              lesson_id: localInsight.lessonContext?.lessonId,
              lesson_title: localInsight.lessonContext?.lessonTitle,
              chapter_id: localInsight.lessonContext?.chapterId,
              chapter_title: localInsight.lessonContext?.chapterTitle,
              created_at: localInsight.timestamp || localInsight.created_at
            })
            .select()
            .single();

          if (!error && data) {
            // Successfully synced - update local storage
            const updatedPosts = wallPosts.map((post: any) => 
              post.id === localInsight.id 
                ? { ...post, local: false, supabaseId: data.id }
                : post
            );
            
            localStorage.setItem('wallOfInsights', JSON.stringify(updatedPosts));
            console.log(`Successfully synced insight: ${localInsight.id}`);
            
            // Dispatch event to update UI
            window.dispatchEvent(new CustomEvent('insightSynced', { 
              detail: { localId: localInsight.id, supabaseId: data.id }
            }));
          }
        } catch (error) {
          console.error('Error syncing individual insight:', error);
        }
      }
    } catch (error) {
      console.error('Error during sync process:', error);
    } finally {
      this.isSyncing = false;
    }
  }
}