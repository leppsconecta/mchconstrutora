import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const BUCKET = 'machado_construtora';
const SCHEMA = 'machado_construtora';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Erro: VITE_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não definidos no ambiente.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  db: { schema: SCHEMA }
});

const mimeTypes = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif'
};

/**
 * Faz upload de um arquivo local para o bucket Supabase Storage
 */
export async function uploadLocalFile(localFilePath, remoteFolder = 'portfolio') {
  if (!fs.existsSync(localFilePath)) {
    throw new Error(`Arquivo não encontrado: ${localFilePath}`);
  }

  const fileBuffer = fs.readFileSync(localFilePath);
  const ext = path.extname(localFilePath).toLowerCase() || '.jpg';
  const baseName = path.basename(localFilePath, ext)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-');

  const remoteName = `${remoteFolder}/${baseName}-${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(remoteName, fileBuffer, {
      contentType,
      cacheControl: '31536000',
      upsert: true
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(remoteName);
  return data.publicUrl;
}

/**
 * Cadastra ou atualiza um item no portfólio
 */
export async function savePortfolioItem(projectData) {
  const {
    id,
    title,
    category = 'Construção Civil',
    location = '',
    timeframe = '',
    description = '',
    image,
    gallery = [],
    highlights = [],
    order_index,
    is_active = true
  } = projectData;

  // Se não foi passado order_index, pega o próximo
  let order = order_index;
  if (order === undefined) {
    const { count } = await supabase.from('portfolio').select('*', { count: 'exact', head: true });
    order = (count || 0) + 1;
  }

  const payload = {
    id: id || `proj-${Date.now()}`,
    title,
    category,
    location,
    timeframe,
    description,
    image: image || gallery[0] || '',
    gallery,
    highlights,
    order_index: order,
    is_active,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('portfolio')
    .upsert(payload)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Se executado via CLI com arquivo JSON
if (process.argv[2]) {
  const jsonPath = path.resolve(process.argv[2]);
  const config = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  savePortfolioItem(config)
    .then((res) => {
      console.log('Projeto salvo com sucesso:', JSON.stringify(res, null, 2));
    })
    .catch((err) => {
      console.error('Erro ao salvar projeto:', err);
      process.exit(1);
    });
}

