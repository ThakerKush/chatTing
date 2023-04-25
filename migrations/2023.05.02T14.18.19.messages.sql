CREATE TABLE IF NOT EXISTS messages
(
    id        BIGSERIAL NOT NULL,
    user_id    BIGINT REFERENCES users(id),
    server_id  BIGSERIAL REFERENCES servers(id),
    value     TEXT DEFAULT NULL,
    created_at DATE DEFAULT NOW(),
    updated_at DATE DEFAULT NOW()
);
