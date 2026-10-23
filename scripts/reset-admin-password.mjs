// Script de uso local para redefinir a senha do usuário administrador no Supabase Auth.
// Uso: npm run admin:reset-password
//
// Lê do .env:
// - VITE_SUPABASE_URL
// - SUPABASE_SERVICE_ROLE_KEY
// - ADMIN_NEW_PASSWORD (ou ADMIN_INITIAL_PASSWORD)

import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@construcoesmachado.com.br').toLowerCase().trim();

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const newPassword = process.env.ADMIN_NEW_PASSWORD || process.env.ADMIN_INITIAL_PASSWORD;

const missing = [
  ['VITE_SUPABASE_URL', url],
  ['SUPABASE_SERVICE_ROLE_KEY', serviceKey],
  ['ADMIN_NEW_PASSWORD ou ADMIN_INITIAL_PASSWORD', newPassword],
]
  .filter(([, v]) => !v)
  .map(([k]) => k);

if (missing.length) {
  console.error(`❌ Variáveis ausentes no .env: ${missing.join(', ')}`);
  process.exit(1);
}

if (newPassword.length < 8) {
  console.error('❌ A senha precisa ter pelo menos 8 caracteres.');
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

console.log(`🔍 Buscando usuário: ${ADMIN_EMAIL}...`);

const { data: list, error: listErr } = await admin.auth.admin.listUsers({ perPage: 1000 });
if (listErr) {
  console.error('❌ Falha ao listar usuários no Supabase:', listErr.message);
  process.exit(1);
}

const existing = list.users.find((u) => u.email?.toLowerCase() === ADMIN_EMAIL);

if (!existing) {
  console.error(`❌ Usuário com e-mail "${ADMIN_EMAIL}" não foi encontrado no Supabase Auth.`);
  console.log('Dica: Execute "npm run admin:create" primeiro para criar a conta.');
  process.exit(1);
}

console.log(`Atualizando senha do usuário ${ADMIN_EMAIL} (ID: ${existing.id})...`);

const { error: updErr } = await admin.auth.admin.updateUserById(existing.id, {
  password: newPassword,
  user_metadata: {
    ...existing.user_metadata,
    name: process.env.ADMIN_NAME || 'adm',
    must_change_password: false,
  },
  app_metadata: {
    ...existing.app_metadata,
    machado_role: 'admin',
  },
});

if (updErr) {
  console.error('❌ Falha ao atualizar senha:', updErr.message);
  process.exit(1);
}

console.log(`\n✅ Senha de "${ADMIN_EMAIL}" redefinida com sucesso!`);
console.log('Você já pode fazer login no painel (/admin/login) diretamente com a nova senha.');
