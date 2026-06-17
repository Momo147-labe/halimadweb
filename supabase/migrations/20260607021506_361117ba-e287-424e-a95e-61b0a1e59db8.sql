
ALTER TABLE public.settings
  ADD COLUMN IF NOT EXISTS whatsapp_mode smallint NOT NULL DEFAULT 1 CHECK (whatsapp_mode BETWEEN 1 AND 4),
  ADD COLUMN IF NOT EXISTS whatsapp_agents jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS delivery_fee_gnf integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS free_delivery_threshold_gnf integer;
