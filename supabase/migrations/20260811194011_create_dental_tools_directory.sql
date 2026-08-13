/*
# Справочник инструментов ассистента стоматолога

1. Новые таблицы
  - `dental_tools`
    - `id` (uuid, первичный ключ)
    - `category` (text) — категория инструмента (например "Ротовые зеркала")
    - `name` (text) — название инструмента
    - `storage_location` (text) — где хранится инструмент в кабинете
    - `description` (text) — подробное описание и назначение
    - `tags` (text[]) — список тегов для фильтрации
    - `sort_order` (integer) — порядок отображения
    - `created_at` (timestamptz) — дата создания записи

2. Безопасность
  - Включён RLS на таблице `dental_tools`.
  - Данные справочника публичные и общие для всех ассистентов клиники, вход в приложение не требуется.
  - Добавлена политика чтения (SELECT) для ролей `anon` и `authenticated`, так как приложение работает без авторизации и только отображает справочник.
  - Запись/изменение/удаление через приложение не предусмотрены, поэтому политики на INSERT/UPDATE/DELETE не создаются.

3. Примечания
  - Таблица предзаполняется базовым набором инструментов и материалов, используемых ассистентом стоматолога.
*/

CREATE TABLE IF NOT EXISTS dental_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  storage_location text NOT NULL,
  description text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE dental_tools ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_dental_tools" ON dental_tools;
CREATE POLICY "anon_select_dental_tools" ON dental_tools FOR SELECT
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_dental_tools_category ON dental_tools (category);
