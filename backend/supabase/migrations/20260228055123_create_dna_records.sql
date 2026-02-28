-- Create dna_records table
CREATE TABLE dna_records (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dna_hash      VARCHAR(64) UNIQUE NOT NULL,
  dna_sequence  TEXT[] NOT NULL,
  is_mutant     BOOLEAN NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Index for stats queries (COUNT by is_mutant)
CREATE INDEX idx_dna_is_mutant ON dna_records (is_mutant);
