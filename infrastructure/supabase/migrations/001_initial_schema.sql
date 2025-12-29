-- GSE 1000 - Schema Inicial do Banco de Dados
-- Supabase Migration

-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Clientes
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    cpf_cnpj VARCHAR(18),
    cep VARCHAR(10),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Pedidos
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, quoted, paid, sourcing, inspecting, shipping, delivered, cancelled
    vin VARCHAR(17),
    part_description TEXT,
    part_photo_url TEXT,
    part_identified_by_ai BOOLEAN DEFAULT false,
    ai_confidence DECIMAL(5,2),
    total_cost_brl DECIMAL(10,2),
    total_cost_usd DECIMAL(10,2),
    margin_percentage DECIMAL(5,2) DEFAULT 30.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de Cotações (múltiplas opções por pedido)
CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    source_url TEXT NOT NULL,
    source_marketplace VARCHAR(100), -- ebay, rockauto, taobao, etc
    part_price_usd DECIMAL(10,2) NOT NULL,
    shipping_usd DECIMAL(10,2) NOT NULL,
    ncm_code VARCHAR(10),
    import_tax_brl DECIMAL(10,2),
    total_cost_brl DECIMAL(10,2) NOT NULL,
    estimated_delivery_days INTEGER,
    seller_reputation_score DECIMAL(3,2),
    is_selected BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Inspeções
CREATE TABLE inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    quote_id UUID REFERENCES quotes(id),
    agent_location VARCHAR(100), -- china, usa, japan, etc
    inspection_photos TEXT[], -- Array de URLs
    inspection_video_url TEXT,
    ai_audit_status VARCHAR(50), -- pending, approved, rejected, needs_review
    ai_audit_confidence DECIMAL(5,2),
    human_review_required BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Rastreios
CREATE TABLE tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    tracking_number VARCHAR(100),
    carrier VARCHAR(100), -- dhl, fedex, shippo, etc
    status VARCHAR(50), -- label_created, in_transit, customs, delivered
    current_location TEXT,
    estimated_delivery_date DATE,
    tracking_url TEXT,
    events JSONB, -- Array de eventos de rastreio
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Pagamentos
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    stripe_payment_intent_id VARCHAR(255),
    pix_code TEXT,
    amount_brl DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL, -- pending, paid, failed, refunded
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Agentes Locais
CREATE TABLE local_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    whatsapp VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    reputation_score DECIMAL(3,2) DEFAULT 5.0,
    total_orders INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Logs de Agentes IA (para auditoria)
CREATE TABLE agent_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_type VARCHAR(50) NOT NULL, -- hunter, fiscal, concierge, auditor
    order_id UUID REFERENCES orders(id),
    action VARCHAR(100) NOT NULL,
    input_data JSONB,
    output_data JSONB,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    execution_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_orders_client_id ON orders(client_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_quotes_order_id ON quotes(order_id);
CREATE INDEX idx_tracking_order_id ON tracking(order_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_agent_logs_order_id ON agent_logs(order_id);
CREATE INDEX idx_agent_logs_agent_type ON agent_logs(agent_type);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tracking_updated_at BEFORE UPDATE ON tracking
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) - Ativar depois de configurar autenticação
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = client_id);



