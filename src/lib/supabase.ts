import { createClient } from '@supabase/supabase-js'

// Publishable key는 브라우저용 공개 키입니다. 데이터 접근은 Supabase RLS 정책이 제한합니다.
const supabaseUrl = 'https://pdsqurqlajgohrvcnoye.supabase.co'
const supabasePublishableKey = 'sb_publishable_Aw7S0vWKmq7XxgDMk-_eXQ_t8_mBbD4'

export const supabase = createClient(supabaseUrl, supabasePublishableKey)
