// Script de criação ou atualização do usuário administrador no Supabase Auth.
// Uso: npm run admin:create
//
// Lê do .env:
// - VITE_SUPABASE_URL
// - SUPABASE_SERVICE_ROLE_KEY
// - ADMIN_INITIAL_PASSWORD (ou ADMIN_NEW_PASSWORD)
// - ADMIN_EMAIL (opcional, padrão: admin@construcoesmachado.com.br)
// - ADMIN_NAME (opcional, padrão: adm)

import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@construcoesmachado.com.br').toLowerCase().trim();
const ADMIN_NAME = process.env.ADMIN_NAME || 'adm';

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || process.env.ADMIN_NEW_PASSWORD;

const missing = [
  ['VITE_SUPABASE_URL', url],
  ['SUPABASE_SERVICE_ROLE_KEY', serviceKey],
  ['ADMIN_INITIAL_PASSWORD', initialPassword],
]
  .filter(([, v]) => !v)
  .map(([k]) => k);

if (missing.length) {
  console.error(`❌ Variáveis ausentes no .env: ${missing.join(', ')}`);
  process.exit(1);
}

if (initialPassword.length < 8) {
  console.error('❌ A senha precisa ter pelo menos 8 caracteres.');
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

console.log(`🚀 Configurando usuário admin: ${ADMIN_EMAIL} (${ADMIN_NAME})...`);

const app_metadata = { machado_role: 'admin' };
const user_metadata = { name: ADMIN_NAME, must_change_password: false };

// Tenta criar o usuário diretamente
const { data, error } = await admin.auth.admin.createUser({
  email: ADMIN_EMAIL,
  password: initialPassword,
  email_confirm: true,
  app_metadata,
  user_metadata,
});

if (!error && data?.user) {
  console.log(`\n✅ Usuário criado com sucesso!`);
  console.log(`📧 E-mail: ${data.user.email}`);
  console.log(`👤 Nome: ${ADMIN_NAME}`);
  console.log(`🆔 ID: ${data.user.id}`);
  console.log(`🔐 Permissão: Administrador Geral (machado_role: admin)`);
  console.log(`\nVocê já pode fazer login em /admin/login diretamente.`);
} else if (error && (error.code === 'email_exists' || /already.*registered/i.test(error.message))) {
  // Se já existe, atualiza a senha e permissões do usuário
  console.log(`ℹ️ Usuário ${ADMIN_EMAIL} já existe no Supabase Auth. Atualizando senha e credenciais...`);
  const { data: list, error: listErr } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (listErr) {
    console.error('❌ Falha ao buscar lista de usuários:', listErr.message);
    process.exit(1);
  }

  const existing = list.users.find((u) => u.email?.toLowerCase() === ADMIN_EMAIL);
  if (!existing) {
    console.error('❌ Usuário não localizado na lista.');
    process.exit(1);
  }

  const { error: updErr } = await admin.auth.admin.updateUserById(existing.id, {
    password: initialPassword,
    app_metadata,
    user_metadata,
    email_confirm: true,
  });

  if (updErr) {
    console.error('❌ Falha ao atualizar credenciais do usuário:', updErr.message);
    process.exit(1);
  }

  console.log(`\n✅ Senha e permissões de ${ADMIN_EMAIL} atualizadas com sucesso!`);
  console.log(`👤 Nome: ${ADMIN_NAME}`);
  console.log(`\nVocê já pode fazer login em /admin/login com a nova senha.`);
} else {
  console.error('❌ Erro ao configurar admin:', error?.message || error);
  process.exit(1);
}
