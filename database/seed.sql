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
    ('Kool & The Gang', 'Summer Madness', 'Light of Worlds', 258, 'released'),
    ('Soul For Real', 'Candy Rain', 'Candy Rain', 271, 'released'),
    ('The Isley Brothers', 'Footsteps in the Dark, Pts. 1 & 2', 'Go for Your Guns', 304, 'early_access'),
    ('Burna Boy', 'Ye', 'Outside', 213, 'early_access'),
    ('Bobby Caldwell', 'My Flame', 'Bobby Caldwell', 253, 'early_access'),
    ('James Brown', 'The Payback', 'The Payback', 459, 'early_access');

/*UPDATE ALL SONG IDS IN TABLE WITH IMAGE URL*/

UPDATE songs SET image_url = CONCAT('https://picsum.photos/300/300?random=', id);