
import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { supabase } from '@/integrations/supabase/client';
import { CustomWorld } from '../steps/world';

BeforeAll(async function() {
  // Set up test database state
  await setupTestDatabase();
});

AfterAll(async function() {
  // Clean up test database state
  await cleanupTestDatabase();
});

Before(async function(this: CustomWorld) {
  await this.init();
});

After(async function(this: CustomWorld) {
  await this.cleanup();
});

async function setupTestDatabase() {
  // Create test user
  const { error: authError } = await supabase.auth.signUp({
    email: 'test@example.com',
    password: 'testpassword123'
  });

  if (authError) {
    console.error('Error creating test user:', authError);
  }

  // Initialize test data
  const testData = {
    posts: [
      {
        content: 'Test post 1',
        user_id: 'test-user-id'
      },
      {
        content: 'Test post 2',
        user_id: 'test-user-id'
      }
    ]
  };

  // Insert test data
  const { error: dbError } = await supabase
    .from('posts')
    .insert(testData.posts);

  if (dbError) {
    console.error('Error inserting test data:', dbError);
  }
}

async function cleanupTestDatabase() {
  // Clean up test data
  const tables = ['posts', 'post_likes', 'post_replies'];
  
  for (const table of tables) {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('user_id', 'test-user-id');

    if (error) {
      console.error(`Error cleaning up ${table}:`, error);
    }
  }
}
