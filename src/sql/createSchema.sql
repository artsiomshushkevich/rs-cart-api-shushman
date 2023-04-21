CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

drop table if exists orders;
drop table if exists cart_items;
drop table if exists carts;

CREATE TYPE cart_status AS ENUM ('ORDERED', 'OPEN');

CREATE TABLE carts (
   id uuid DEFAULT uuid_generate_v4(),
   user_id uuid NOT NULL,
   created_at date DEFAULT NOW(),
   updated_at date DEFAULT NOW(),
   status cart_status DEFAULT 'OPEN',
   PRIMARY KEY (id)
);

CREATE TABLE cart_items (
   cart_id uuid NOT NULL,
   product_id uuid NOT NULL,
   count int NOT NULL,
   CONSTRAINT fk_cart_id
        FOREIGN KEY (cart_id) 
        REFERENCES carts(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE orders (
   id uuid NOT NULL,
   cart_id uuid NOT NULL,
   user_id uuid NOT NULL,
   payment jsonb NOT NULL,
   address jsonb NOT NULL,
   total int NOT NULL,
   comments text,
   status text,
   PRIMARY KEY (id),
   CONSTRAINT fk_cart_id
        FOREIGN KEY (cart_id) 
        REFERENCES carts(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);