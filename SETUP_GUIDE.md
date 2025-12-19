
# Guida Integrazione Stripe & Supabase (VS Code)

Segui questa guida sequenziale per attivare i pagamenti e le funzionalità avanzate.

## 1. Prerequisiti
Apri il terminale di VS Code ed esegui:
```bash
npm install
```

## 2. Collegamento a Supabase
1.  **Login**:
    ```bash
    npx supabase login
    ```
2.  **Link al progetto cloud**:
    Trova il tuo Project ID su Supabase (es. `abcdefghijklm`) ed esegui:
    ```bash
    npx supabase link --project-ref IL_TUO_PROJECT_ID
    ```

## 3. Configurazione Segreti (Sicurezza)
Imposta le chiavi API di Stripe nel backend sicuro di Supabase.

1.  **Stripe Secret Key** (da [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)):
    ```bash
    npx supabase secrets set STRIPE_SECRET_KEY=sk_test_...
    ```

2.  **Stripe Webhook Secret** (Vedi punto 5):
    *Questo lo imposterai DOPO il deploy del webhook.*

## 4. Deploy del Backend (Edge Functions)
I file delle funzioni sono già nella cartella `supabase/functions`. Pubblicali con:

```bash
npx supabase functions deploy create-checkout --no-verify-jwt
npx supabase functions deploy stripe-webhook --no-verify-jwt
```

## 5. Attivazione Webhook Stripe
1.  Copia l'URL del webhook ottenuto dal deploy.
2.  Vai su [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks).
3.  Crea un nuovo endpoint selezionando l'evento: `checkout.session.completed`.
4.  Salva e copia il "Signing Secret" (`whsec_...`).
5.  Impostalo su Supabase:
    ```bash
    npx supabase secrets set STRIPE_WEBHOOK_SIGNING_SECRET=whsec_...
    ```

## 6. Configurazione Database (SQL)
Vai su Supabase Dashboard > SQL Editor ed esegui questi script:

### Tabella Acquisti
```sql
create table purchases (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  course_id text not null,
  stripe_payment_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table purchases enable row level security;
create policy "Users can view own purchases" on purchases for select using ( auth.uid() = user_id );
create policy "Service role inserts" on purchases for insert with check ( true );
```

### Tabella Progresso Lezioni
```sql
create table lesson_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  course_id text not null,
  lesson_id text not null,
  completed boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, lesson_id)
);

alter table lesson_progress enable row level security;
create policy "Gli utenti possono gestire il proprio progresso" 
on lesson_progress for all 
using ( auth.uid() = user_id );
```

### Tabella Community Chat (NUOVA)
```sql
create table community_messages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  user_name text not null,
  text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table community_messages enable row level security;
create policy "Tutti gli autenticati possono leggere i messaggi" on community_messages for select using ( auth.role() = 'authenticated' );
create policy "Gli utenti possono inviare messaggi" on community_messages for insert with check ( auth.uid() = user_id );

-- ABILITA IL REALTIME: Vai su Supabase Dashboard > Database > Replication > 'supabase_realtime' publication
-- e aggiungi la tabella community_messages, oppure usa il comando SQL:
alter publication supabase_realtime add table community_messages;
```
