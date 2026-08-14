# Подключение Supabase

1. Создайте или откройте один проект Supabase.
2. Откройте SQL Editor, вставьте весь файл `supabase/setup.sql` и нажмите Run.
3. В окне Connect скопируйте Project URL и Publishable key.
4. Заполните локальный `.env` по образцу `.env.example`.
5. Перезапустите `npm.cmd run dev`.

Для GitHub Pages добавьте те же значения в Settings -> Secrets and variables -> Actions:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Важно: пока в приложении нет авторизации, любой посетитель с адресом сайта может изменять каталог.
