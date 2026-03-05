
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envConfig = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '.env.local')));

const supabase = createClient(
  envConfig.NEXT_PUBLIC_SUPABASE_URL,
  envConfig.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function testBuckets() {
  console.log('Testing Bucket Creation...');

  // 1. Try to create 'applications' bucket
  const { data: bucketData, error: bucketError } = await supabase
    .storage
    .createBucket('applications', {
      public: false, // Admin only
      fileSizeLimit: 1048576, // 1MB
      allowedMimeTypes: ['application/json']
    });

  if (bucketError) {
    console.log('Bucket creation failed (might already exist):', bucketError.message);
  } else {
    console.log('Bucket "applications" created successfully');
  }

  // 2. Try to create 'cvs' bucket if not exists
  const { data: cvBucketData, error: cvBucketError } = await supabase
    .storage
    .createBucket('cvs', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
    });
    
  if (cvBucketError) {
    console.log('Bucket "cvs" creation failed (might already exist):', cvBucketError.message);
  } else {
    console.log('Bucket "cvs" created successfully');
  }

  // 3. List buckets
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error('Error listing buckets:', listError);
  } else {
    console.log('Current Buckets:', buckets.map(b => b.name));
  }
}

testBuckets();
