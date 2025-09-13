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
    user_id INT REFERENCES users(id) ON DELETE CASCADE, -- owner of this agent
    name VARCHAR(100),         -- e.g. "Work Persona", "Casual Mode"
    tone VARCHAR(50),          -- high-level descriptor ("formal", "casual", etc.)
    metadata JSONB,            -- flexible config: filler words, slang, disclaimers, goals
    created_at TIMESTAMP DEFAULT NOW()
);

-- AGENT INSTANCES: a one-off runtime version of an agent for a specific call
-- Stores temporary state/context unique to that call
CREATE TABLE agent_instances (
    id SERIAL PRIMARY KEY,
    agent_id INT REFERENCES agents(id) ON DELETE CASCADE, -- base agent this instance is derived from
    call_id INT REFERENCES calls(id) ON DELETE CASCADE,   -- call this instance belongs to
    state JSONB,               -- ephemeral data: short-term memory, extracted facts, call summary
    created_at TIMESTAMP DEFAULT NOW(),
    ended_at TIMESTAMP
);

-- CALLS: represents each impersonation session
-- Tracks lifecycle of a phone call where an agent_instance participates
CREATE TABLE calls (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,  -- which user owns this call
    agent_instance_id INT REFERENCES agent_instances(id) ON DELETE SET NULL, -- instance active in call
    started_at TIMESTAMP DEFAULT NOW(),
    ended_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active' -- active, ended, failed
);

-- MESSAGES: every utterance that occurs in a call (caller input, agent response, etc.)
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    call_id INT REFERENCES calls(id) ON DELETE CASCADE, -- which call this message belongs to
    sender VARCHAR(50), -- 'caller', 'user', or 'agent'
    content TEXT,       -- raw text transcript of speech
    created_at TIMESTAMP DEFAULT NOW()
);
