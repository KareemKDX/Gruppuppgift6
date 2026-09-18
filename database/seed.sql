-- TESTDATA FÖR UTVECKLING
-- Kör efter schema.sql: psql -d Gruppuppgift6 -f database/seed.sql

INSERT INTO songs (artist, title, album, duration, release_type)
VALUES
    ('Bob Marley', 'Three Little Birds', 'Exodus', 180, 'released'),
    ('A Tribe Called Quest', 'Can I Kick It?', 'Peoples Instinctive Travels', 251, 'released'),
    ('Daft Punk', 'One More Time', 'Discovery', 320, 'released'),
    ('Nina Simone', 'Feeling Good', 'I Put a Spell on You', 175, 'released'),
    ('Fela Kuti', 'Zombie', 'Zombie', 744, 'released'),
    ('Timbuktu', 'Alla vill till himmelen', 'Sagolandet', 224, 'released'),
    ('Toots and the Maytals', 'Pressure Drop', 'Monkey Man', 172, 'released'),
    ('Kraftwerk', 'The Model', 'Die Mensch-Maschine', 218, 'released'),
    ('Missy Elliott', 'Get Ur Freak On', 'Miss E... So Addictive', 203, 'early_access'),
    ('Burna Boy', 'Ye', 'Outside', 213, 'early_access'),
    ('Frankie Knuckles', 'Your Love', 'Your Love', 355, 'early_access'),
    ('Ebba Grön', 'Staten och kapitalet', 'Kärlek och uppror', 198, 'early_access');