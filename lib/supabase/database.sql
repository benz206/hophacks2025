-- AGENTS: reusable personas linked to a user
-- Think of this as a "template" for how the user wants to sound/behave
CREATE TABLE agents (
    id SERIAL PRIMARY KEY,
    agent_id INT,
    user_id INT REFERENCES users(id) ON DELETE CASCADE, -- owner of this agent
    metadata JSONB,            -- flexible config: filler words, slang, disclaimers, goals
    created_at TIMESTAMP DEFAULT NOW()
);
