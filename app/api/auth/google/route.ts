import { NextRequest, NextResponse } from 'next/server';
import { createGoogleOAuthClient } from '@/lib/google/oauth-client';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();
    
    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 401 });
    }
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const googleOAuth = createGoogleOAuthClient();
    const authUrl = googleOAuth.getAuthorizationUrl(user.id); // Use user ID as state

    return NextResponse.json({ authUrl }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
