-- Schema for Zero-Cost AI Mock Interview Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Interview Sessions Table
CREATE TABLE IF NOT EXISTS interview_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_title TEXT NOT NULL,
    exp_level TEXT NOT NULL,
    overall_score INTEGER,
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Interview Dialogues Table
CREATE TABLE IF NOT EXISTS interview_dialogues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    q_num INTEGER NOT NULL,
    question TEXT NOT NULL,
    user_answer TEXT,
    score INTEGER,
    mistakes JSONB,
    missing_terms JSONB,
    perfect_ans TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
