-- PolicyDesk Initial Schema
-- Creates all core tables for client management, policy tracking,
-- payment tracking, and future reminder logging.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- clients
-- Stores one customer/insured person.
-- =========================================================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- insurance_types
-- Stores agent-defined policy categories (e.g., Vehicle, Life, Health).
-- =========================================================================
CREATE TABLE IF NOT EXISTS insurance_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- policies
-- Stores one insurance policy owned by one client.
-- =========================================================================
CREATE TABLE IF NOT EXISTS policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  insurance_type_id UUID NOT NULL REFERENCES insurance_types(id),
  policy_number TEXT,
  signed_on DATE,
  expires_on DATE,
  premium_amount DECIMAL(10,2),
  due_date DATE,
  frequency TEXT CHECK (frequency IN ('monthly', 'quarterly', 'yearly')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- payments
-- Stores payment tracking entries for each policy premium.
-- =========================================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  policy_id UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
  amount_due DECIMAL(10,2),
  amount_paid DECIMAL(10,2) DEFAULT 0,
  paid_on DATE,
  due_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'overdue')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- reminder_logs (Phase 3)
-- Logs every WhatsApp reminder sent for a payment.
-- =========================================================================
CREATE TABLE IF NOT EXISTS reminder_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  destination_phone TEXT,
  template_name TEXT,
  status TEXT,
  provider_message_id TEXT,
  provider_response TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- Indexes for common query patterns
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_clients_created ON clients(created_at);
CREATE INDEX IF NOT EXISTS idx_policies_client ON policies(client_id);
CREATE INDEX IF NOT EXISTS idx_policies_type ON policies(insurance_type_id);
CREATE INDEX IF NOT EXISTS idx_payments_policy ON payments(policy_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_due_date ON payments(due_date);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_payment ON reminder_logs(payment_id);
