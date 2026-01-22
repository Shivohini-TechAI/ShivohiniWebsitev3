-- Add columns for service interest flow state management
ALTER TABLE whatsapp_users 
ADD COLUMN IF NOT EXISTS service_flow_step text,
ADD COLUMN IF NOT EXISTS service_request_data jsonb DEFAULT '{}'::jsonb;

-- Comment on columns for clarity
COMMENT ON COLUMN whatsapp_users.service_flow_step IS 'Current step in the service interest negotiation flow';
COMMENT ON COLUMN whatsapp_users.service_request_data IS 'Temporary storage for service request details (agenda, time, etc.)';
