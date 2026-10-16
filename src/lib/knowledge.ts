import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

export interface KnowledgeItem {
  id: number;
  content: string;
  metadata: {
    category: string;
    heading: string;
    title?: string;
    source?: string;
  };
  created_at?: string;
}

function getSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';
  if (!url || !key) {
    throw new Error('Supabase URL or Key is missing in admin environment.');
  }
  return createClient(url, key);
}

function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing in admin environment.');
  }
  return new GoogleGenAI({ apiKey });
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const ai = getGenAI();
  const cleanedText = text.replace(/\n+/g, ' ').trim();
  if (!cleanedText) {
    throw new Error('Text for embedding cannot be empty.');
  }

  const models = ['gemini-embedding-001', 'gemini-embedding-2', 'text-embedding-004'];
  let lastError: unknown = null;

  for (const model of models) {
    try {
      const response = await ai.models.embedContent({
        model,
        contents: cleanedText,
        config: {
          outputDimensionality: 768,
        },
      });

      if (response.embeddings && response.embeddings[0]?.values) {
        return response.embeddings[0].values;
      }
      if ((response as unknown as { embedding?: { values?: number[] } }).embedding?.values) {
        return (response as unknown as { embedding: { values: number[] } }).embedding.values;
      }
    } catch (err) {
      lastError = err;
      continue;
    }
  }

  throw new Error(`Failed to generate embedding: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
}

export async function getAllKnowledge(): Promise<KnowledgeItem[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('personal_knowledge')
    .select('id, content, metadata, created_at')
    .order('id', { ascending: false });

  if (error) {
    throw new Error(`Failed to load knowledge chunks: ${error.message}`);
  }

  return (data || []) as KnowledgeItem[];
}

export async function createKnowledgeItem(
  content: string,
  category: string,
  heading: string
): Promise<KnowledgeItem> {
  const supabase = getSupabase();
  const textToEmbed = `[${category.toUpperCase()}] ${heading}: ${content}`;
  const embedding = await generateEmbedding(textToEmbed);

  const metadata = {
    category,
    heading,
    title: heading,
    source: 'admin-cms',
  };

  const { data, error } = await supabase
    .from('personal_knowledge')
    .insert([
      {
        content,
        metadata,
        embedding,
      },
    ])
    .select('id, content, metadata, created_at')
    .single();

  if (error) {
    throw new Error(`Failed to create knowledge chunk: ${error.message}`);
  }

  return data as KnowledgeItem;
}

export async function updateKnowledgeItem(
  id: number,
  content: string,
  category: string,
  heading: string
): Promise<KnowledgeItem> {
  const supabase = getSupabase();
  const textToEmbed = `[${category.toUpperCase()}] ${heading}: ${content}`;
  const embedding = await generateEmbedding(textToEmbed);

  const metadata = {
    category,
    heading,
    title: heading,
    source: 'admin-cms',
  };

  const { data, error } = await supabase
    .from('personal_knowledge')
    .update({
      content,
      metadata,
      embedding,
    })
    .eq('id', id)
    .select('id, content, metadata, created_at')
    .single();

  if (error) {
    throw new Error(`Failed to update knowledge chunk: ${error.message}`);
  }

  return data as KnowledgeItem;
}

export async function deleteKnowledgeItem(id: number): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from('personal_knowledge').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete knowledge chunk: ${error.message}`);
  }
}
