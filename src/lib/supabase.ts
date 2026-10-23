import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://txlvjukmjjfjufwkkrzm.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4bHZqdWttampmanVmd2trcnptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5MzA0MDUsImV4cCI6MjA1NjUwNjQwNX0.UQFz5ZoGivjGzy2-XADgRKqqH3Cm2bM5jSqPFHzjzaQ';
export const SUPABASE_SCHEMA = 'machado_construtora';
export const SUPABASE_BUCKET = 'machado_construtora';

/**
 * Cliente Supabase padrão já apontado para o schema `machado_construtora`
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  db: {
    schema: SUPABASE_SCHEMA,
  },
});

/**
 * Cliente padrão para operações de Storage (os buckets ficam no schema `storage`)
 */
export const supabaseStorage = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Upload de arquivo para o bucket `machado_construtora`
 * @param file Arquivo File do navegador
 * @param folder Subpasta opcional (ex: 'cases', 'documentos', 'curriculos')
 * @returns URL pública permanente do arquivo
 */
export async function uploadImageToBucket(file: File, folder: string = 'cases'): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'jpg';
  const cleanFileName = file.name
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-');
  const uniqueName = `${folder}/${cleanFileName}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabaseStorage.storage
    .from(SUPABASE_BUCKET)
    .upload(uniqueName, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type || 'image/jpeg',
    });

  if (uploadError) {
    console.error('Erro no upload para o Supabase Storage:', uploadError);
    throw uploadError;
  }

  const { data } = supabaseStorage.storage
    .from(SUPABASE_BUCKET)
    .getPublicUrl(uniqueName);

  return data.publicUrl;
}

/**
 * Remove um arquivo do bucket `machado_construtora` pela URL pública ou caminho relativo
 */
export async function deleteImageFromBucket(urlOrPath: string): Promise<boolean> {
  if (!urlOrPath || urlOrPath === '#' || urlOrPath.startsWith('data:')) {
    return false;
  }

  try {
    let filePath = urlOrPath;

    // Se for URL completa, extrai apenas o caminho após o nome do bucket
    if (urlOrPath.includes(`${SUPABASE_BUCKET}/`)) {
      filePath = urlOrPath.split(`${SUPABASE_BUCKET}/`)[1];
      if (filePath.includes('?')) {
        filePath = filePath.split('?')[0];
      }
    }

    filePath = decodeURIComponent(filePath);

    const { error } = await supabaseStorage.storage
      .from(SUPABASE_BUCKET)
      .remove([filePath]);

    if (error) {
      console.warn('Aviso ao remover arquivo do bucket:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('Erro ao processar remoção do bucket:', err);
    return false;
  }
}
