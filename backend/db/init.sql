-- ota pgcrypto-laajennus käyttöön (hashaukset yms.)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- pudota vanhat taulut
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS users;

-- luo käyttäjätaulu
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(60) UNIQUE NOT NULL,
  hashed_password VARCHAR(255) NOT NULL,
  admin BOOLEAN DEFAULT FALSE,
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- luo esinettaulu
CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image TEXT,
  category VARCHAR(100) NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- neljä feikkikäyttäjää, salasana "testi"
INSERT INTO users (name, email, hashed_password, admin) VALUES
  ('terhitestaaja', 'terhitestaaja@testimail.com', crypt('testi', gen_salt('bf')), FALSE),
  ('teppotestaaja', 'teppotestaaja@testimail.com', crypt('testi', gen_salt('bf')), FALSE),
  ('teemutestaaja', 'teemutestaaja@testimail.com', crypt('testi', gen_salt('bf')), FALSE),
  ('terotestaaja', 'terotestaaja@testimail.com', crypt('testi', gen_salt('bf')), FALSE);

-- 15 esinettä uploads-kansion kuvilla
INSERT INTO items (name, price, description, image, category, owner_id) VALUES
  ('Teekannu',    15.00, 'Ruostumaton teräksestä valmistettu teekannu.',       'uploads/teekannu.png',       'Home & Kitchen',          (SELECT id FROM users WHERE email='terhitestaaja@testimail.com')),
  ('Tehosekoitin',20.00, 'Tehokas tehosekoitin keittiöön.',                     'uploads/tehosekoitin.png',   'Electronics',             (SELECT id FROM users WHERE email='teppotestaaja@testimail.com')),
  ('Teippirulla',  3.50, 'Monikäyttöinen teippirulla korjauksiin.',             'uploads/teippirulla.png',    'Tools & Home Improvement', (SELECT id FROM users WHERE email='teemutestaaja@testimail.com')),
  ('Tekohampaat', 50.00, 'Laadukkaat proteesit.',                                'uploads/tekohampaat.png',    'Industrial & Scientific', (SELECT id FROM users WHERE email='terotestaaja@testimail.com')),
  ('Telaketju',   25.00, 'Kestävät ketjut koneisiin.',                            'uploads/telaketju.png',      'Automotive',             (SELECT id FROM users WHERE email='terhitestaaja@testimail.com')),
  ('Teleskooppi',150.00, 'Kaukoputki tähtien katseluun.',                        'uploads/teleskooppi.png',    'Electronics',             (SELECT id FROM users WHERE email='teppotestaaja@testimail.com')),
  ('Televisio',  300.00, '4K HDR -televisio.',                                   'uploads/televisio.png',      'Electronics',             (SELECT id FROM users WHERE email='teemutestaaja@testimail.com')),
  ('Teltta',      35.00, 'Retkiteltta kahdelle hengelle.',                        'uploads/teltta.png',         'Sports & Outdoors',       (SELECT id FROM users WHERE email='terotestaaja@testimail.com')),
  ('Terasbetoni',100.00, 'Vahvaa teräsbetonia rakennuksiin.',                    'uploads/terasbetoni.png',     'Industrial & Scientific', (SELECT id FROM users WHERE email='terhitestaaja@testimail.com')),
  ('Terassituoli',40.00, 'Mukava puinen terassituoli.',                           'uploads/terassituoli.png',   'Furniture',               (SELECT id FROM users WHERE email='teppotestaaja@testimail.com')),
  ('Termari',      5.50, 'Lämpöä pitävä termospullo.',                           'uploads/termari.png',        'Home & Kitchen',          (SELECT id FROM users WHERE email='teemutestaaja@testimail.com')),
  ('Termiitti',    8.00, 'Koristeellinen termiitti-hahmo.',                       'uploads/termiitti.png',      'Other',                   (SELECT id FROM users WHERE email='terotestaaja@testimail.com')),
  ('Terraario',   60.00, 'Lasinen terraario lemmikille.',                         'uploads/terraario.png',      'Pet Supplies',            (SELECT id FROM users WHERE email='terhitestaaja@testimail.com')),
  ('Terrieri',   500.00, 'Terrierirotuinen lemmikkikoira.',                        'uploads/terrieri.png',       'Pet Supplies',            (SELECT id FROM users WHERE email='teppotestaaja@testimail.com')),
  ('Terveyskirja', 9.99, 'Opas terveelliseen elämäntapaan.',                       'uploads/terveyskirja.png',   'Other',                   (SELECT id FROM users WHERE email='teemutestaaja@testimail.com'));
