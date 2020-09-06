CREATE DATABASE ChatDB;

CREATE TABLE users(
    userid uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    user_gender VARCHAR(255) NOT NULL,
    user_birthdate DATE NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    account_status VARCHAR(255) NOT NULL
);

CREATE TABLE user_friends(
    friedship_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid,
    friend_id uuid,
    friend_status VARCHAR(255) NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_f FOREIGN KEY(user_id) REFERENCES users(userid),
    CONSTRAINT user_f2 FOREIGN KEY(friend_id) REFERENCES users(userid)
);

CREATE TABLE chats(
    chat_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid,
    friend_id uuid,
    message_status VARCHAR(255) NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_f FOREIGN KEY(user_id) REFERENCES users(userid),
    CONSTRAINT user_f2 FOREIGN KEY(friend_id) REFERENCES users(userid)
);