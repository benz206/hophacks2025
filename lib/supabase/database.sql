-- USERS: stores the actual people who own agents
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),          -- full name of the user
    phone_number VARCHAR(20),   -- optional, for call routing
    email VARCHAR(150),         -- optional, for login/identification
    created_at TIMESTAMP DEFAULT NOW()
);

-- AGENTS: reusable personas linked to a user
-- Think of this as a "template" for how the user wants to sound/behave
CREATE TABLE agents (
    id SERIAL PRIMARY KEY,
    agent_id INT,
    user_id INT REFERENCES users(id) ON DELETE CASCADE, -- owner of this agent
    metadata JSONB,            -- flexible config: filler words, slang, disclaimers, goals
    created_at TIMESTAMP DEFAULT NOW()
);
