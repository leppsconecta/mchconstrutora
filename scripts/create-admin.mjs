// Script de USO ÚNICO — roda só localmente (Node), nunca no navegador.
// Cria o usuário admin no Supabase Auth usando a service_role.
//
// Uso:  npm run admin:create
// Lê do .env (fora do Git): VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_INITIAL_PASSWORD
// A senha NUNCA é impressa nem gravada em nenhum arquivo por este script.

import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'admin@machadoconstrutora.com.br';
const ADMIN_NAME = 'Administrador MCH';

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const initialPassword = process.env.ADMIN_INITIAL_PASSWORD;

const missing = [
  ['VITE_SUPABASE_URL', url],
  ['SUPABASE_SERVICE_ROLE_KEY', serviceKey],
  ['ADMIN_INITIAL_PASSWORD', initialPassword],
]
  .filter(([, v]) => !v)
  .map(([k]) => k);

if (missing.length) {
  console.error(`Variáveis ausentes no .env: ${missing.join(', ')}`);
  process.exit(1);
}

if (initialPassword.length < 12) {
  console.error('ADMIN_INITIAL_PASSWORD precisa ter pelo menos 12 caracteres.');
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// O papel é gravado em app_metadata (só a service_role escreve ali; o cliente não consegue alterar).
// As políticas RLS do banco checam app_metadata.machado_role = 'admin'.
const app_metadata = { machado_role: 'admin' };

const { data, error } = await admin.auth.admin.createUser({
  email: ADMIN_EMAIL,
  password: initialPassword,
  email_confirm: true,
  app_metadata,
  user_metadata: { name: ADMIN_NAME, must_change_password: true },
});

if (!error) {
  console.log(`Admin criado: ${data.user.email} (id ${data.user.id}).`);
  console.log('Troca de senha obrigatória no primeiro login: ATIVADA.');
} else if (error.code === 'email_exists' || /already.*registered/i.test(error.message)) {
  // Usuário já existe: apenas garante o papel de admin. NÃO altera a senha.
  const { data: list, error: listErr } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (listErr) {
    console.error('Falha ao listar usuários:', listErr.message);
    process.exit(1);
  }
  const existing = list.users.find((u) => u.email?.toLowerCase() === ADMIN_EMAIL);
  if (!existing) {
    console.error('Usuário existente não localizado.');
    process.exit(1);
  }
  const { error: updErr } = await admin.auth.admin.updateUserById(existing.id, { app_metadata });
  if (updErr) {
    console.error('Falha ao atribuir papel admin:', updErr.message);
    process.exit(1);
  }
  console.log(`Usuário já existia (${ADMIN_EMAIL}). Papel admin garantido; senha NÃO foi alterada.`);
} else {
  console.error('Falha ao criar admin:', error.message);
  process.exit(1);
}

console.log('\nLEMBRETE: apague ADMIN_INITIAL_PASSWORD (e, se quiser, SUPABASE_SERVICE_ROLE_KEY) do .env agora.');
