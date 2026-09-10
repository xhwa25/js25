import type { VisitorComment } from '../types/comment'
import { supabase, supabaseConfigError } from './supabase'

const COMMENT_COLUMNS = 'id, place_id, nickname, content, created_at'

export interface CreateCommentInput {
  placeId: number
  nickname: string | null
  content: string
}

export async function getComments(placeId: number): Promise<VisitorComment[]> {
  if (!supabase) {
    throw new Error(supabaseConfigError ?? 'Supabase is not configured.')
  }

  const { data, error } = await supabase
    .from('comments')
    .select(COMMENT_COLUMNS)
    .eq('place_id', placeId)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []) as VisitorComment[]
}

export async function createComment(input: CreateCommentInput): Promise<VisitorComment> {
  if (!supabase) {
    throw new Error(supabaseConfigError ?? 'Supabase is not configured.')
  }

  const { data, error } = await supabase
    .from('comments')
    .insert({
      place_id: input.placeId,
      nickname: input.nickname,
      content: input.content,
    })
    .select(COMMENT_COLUMNS)
    .single()

  if (error) {
    throw error
  }

  return data as VisitorComment
}
