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
 * Comprime e redimensiona uma imagem no navegador antes do upload
 * Reduz fotos pesadas (de 5MB~20MB) para ~150KB~400KB em formato WebP de alta fidelidade
 */
export async function compressImage(
  file: File, 
  maxWidth = 1920, 
  maxHeight = 1920, 
  quality = 0.82
): Promise<File> {
  // Se não for imagem (ex: PDF), mantém o arquivo original
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let { width, height } = img;

        // Mantém a proporção redimensionando se ultrapassar o limite máximo
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        // Renderiza com suavização máxima
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Converte para WebP moderno de alta eficiência
        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              resolve(file);
              return;
            }

            const newFileName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
            const compressedFile = new File([blob], newFileName, {
              type: 'image/webp',
              lastModified: Date.now(),
            });

            console.log(
              `[Otimizador de Imagem] ${file.name}: ${(file.size / 1024).toFixed(0)}KB ➔ ${(compressedFile.size / 1024).toFixed(0)}KB (-${Math.round((1 - compressedFile.size / file.size) * 100)}%)`
            );

            resolve(compressedFile);
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

/**
 * Upload de arquivo para o bucket `machado_construtora` com compressão automática
 * @param file Arquivo File do navegador
 * @param folder Subpasta opcional (ex: 'portfolio', 'documentos', 'curriculos')
 * @param shouldCompress Se deve aplicar compressão inteligente (default: true para imagens)
 * @returns URL pública permanente do arquivo
 */
export async function uploadImageToBucket(
  file: File, 
  folder: string = 'portfolio',
  shouldCompress: boolean = true
): Promise<string> {
  const processedFile = shouldCompress ? await compressImage(file) : file;

  const fileExt = processedFile.name.split('.').pop() || 'webp';
  const cleanFileName = processedFile.name
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-');
  const uniqueName = `${folder}/${cleanFileName}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabaseStorage.storage
    .from(SUPABASE_BUCKET)
    .upload(uniqueName, processedFile, {
      cacheControl: '31536000', // 1 ano de cache CDN
      upsert: true,
      contentType: processedFile.type || 'image/webp',
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
