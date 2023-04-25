CREATE TABLE server_users
(
    user_id     BIGINT REFERENCES users (id),
    server_id   BIGSERIAL REFERENCES servers (id),
    created_at DATE DEFAULT NOW(),
    updated_at DATE DEFAULT NOW()

);
