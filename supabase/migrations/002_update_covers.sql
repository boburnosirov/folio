-- ══════════════════════════════════════════════════════════════
--  Folio — update book covers to proper Open Library / Gutenberg images
--  Run in Supabase SQL Editor
-- ══════════════════════════════════════════════════════════════

-- ── Russian Classics ──────────────────────────────────────────
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL267992W-L.jpg' WHERE slug = 'anna-karenina';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL48213W-L.jpg' WHERE slug = 'voyna-i-mir';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL266959W-L.jpg' WHERE slug = 'prestuplenie-i-nakazanie';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL267082W-L.jpg' WHERE slug = 'idiot';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL267093W-L.jpg' WHERE slug = 'bratya-karamazovy';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL8263371W-L.jpg' WHERE slug = 'besy';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL8266534W-L.jpg' WHERE slug = 'zapiski-iz-podpolya';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL8269781W-L.jpg' WHERE slug = 'bednye-lyudi';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL8271563W-L.jpg' WHERE slug = 'igrok';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL8272150W-L.jpg' WHERE slug = 'belye-nochi';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/600/pg600.cover.medium.jpg'  WHERE slug = 'smert-ivana-ilyicha';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/1938/pg1938.cover.medium.jpg' WHERE slug = 'voskreseniye';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/689/pg689.cover.medium.jpg'   WHERE slug = 'kreutzer-sonata';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/2450/pg2450.cover.medium.jpg' WHERE slug = 'detstvo-tolstoy';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/1898/pg1898.cover.medium.jpg' WHERE slug = 'kazaki';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/7986/pg7986.cover.medium.jpg' WHERE slug = 'vishnyovy-sad';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/7986/pg7986.cover.medium.jpg' WHERE slug = 'tri-sestry';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/7986/pg7986.cover.medium.jpg' WHERE slug = 'dyadya-vanya';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/7986/pg7986.cover.medium.jpg' WHERE slug = 'chayka';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/1823/pg1823.cover.medium.jpg' WHERE slug = 'palata-6';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/1823/pg1823.cover.medium.jpg' WHERE slug = 'dama-s-sobachkoy';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/1823/pg1823.cover.medium.jpg' WHERE slug = 'chekhov-rasskazy';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL8258423W-L.jpg' WHERE slug = 'mertvye-dushi';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/4717/pg4717.cover.medium.jpg' WHERE slug = 'revizor';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/1705/pg1705.cover.medium.jpg' WHERE slug = 'taras-bulba';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/1081/pg1081.cover.medium.jpg' WHERE slug = 'shinel';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/1081/pg1081.cover.medium.jpg' WHERE slug = 'vechera-na-khutore';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL8276445W-L.jpg' WHERE slug = 'evgeniy-onegin';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/31516/pg31516.cover.medium.jpg' WHERE slug = 'pikovaya-dama';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/36034/pg36034.cover.medium.jpg' WHERE slug = 'kapitanskaya-dochka';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/27500/pg27500.cover.medium.jpg' WHERE slug = 'boris-godunov';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL8278342W-L.jpg' WHERE slug = 'ottsy-i-deti';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL8279123W-L.jpg' WHERE slug = 'pervaya-lyubov';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/21076/pg21076.cover.medium.jpg' WHERE slug = 'rudin';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/21076/pg21076.cover.medium.jpg' WHERE slug = 'dvoryanskoe-gnezdo';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/2570/pg2570.cover.medium.jpg'   WHERE slug = 'mumu';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/23062/pg23062.cover.medium.jpg' WHERE slug = 'oblomov';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL8280234W-L.jpg' WHERE slug = 'geroy-nashego-vremeni';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/913/pg913.cover.medium.jpg'     WHERE slug = 'demon-lermontov';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/12557/pg12557.cover.medium.jpg' WHERE slug = 'mat-gorky';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/13836/pg13836.cover.medium.jpg' WHERE slug = 'na-dne';

-- ── World Classics ────────────────────────────────────────────
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL1168007W-L.jpg' WHERE slug = 'pride-and-prejudice';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL1176784W-L.jpg' WHERE slug = 'sense-and-sensibility';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL1176850W-L.jpg' WHERE slug = 'emma';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL1176802W-L.jpg' WHERE slug = 'northanger-abbey';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL1176841W-L.jpg' WHERE slug = 'persuasion';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL1176867W-L.jpg' WHERE slug = 'mansfield-park';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/730/pg730.cover.medium.jpg'    WHERE slug = 'oliver-twist';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/766/pg766.cover.medium.jpg'    WHERE slug = 'david-copperfield';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL14906856W-L.jpg' WHERE slug = 'great-expectations';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL14906860W-L.jpg' WHERE slug = 'a-tale-of-two-cities';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/46/pg46.cover.medium.jpg'      WHERE slug = 'a-christmas-carol';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/1023/pg1023.cover.medium.jpg'  WHERE slug = 'bleak-house';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/580/pg580.cover.medium.jpg'    WHERE slug = 'pickwick-papers';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL46277W-L.jpg'   WHERE slug = 'les-miserables';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL8440688W-L.jpg' WHERE slug = 'notre-dame-de-paris';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/32338/pg32338.cover.medium.jpg' WHERE slug = 'toilers-of-the-sea';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL14906869W-L.jpg' WHERE slug = 'three-musketeers';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL45177W-L.jpg'   WHERE slug = 'count-of-monte-cristo';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/1259/pg1259.cover.medium.jpg'  WHERE slug = 'twenty-years-after';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/2759/pg2759.cover.medium.jpg'  WHERE slug = 'queen-margot';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL110769W-L.jpg'   WHERE slug = 'sherlock-holmes-adventures';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL14867049W-L.jpg' WHERE slug = 'hound-of-baskervilles';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/244/pg244.cover.medium.jpg'    WHERE slug = 'study-in-scarlet';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/2097/pg2097.cover.medium.jpg'  WHERE slug = 'sign-of-four';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/834/pg834.cover.medium.jpg'    WHERE slug = 'memoirs-of-sherlock-holmes';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL1172830W-L.jpg'  WHERE slug = 'jane-eyre';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/30486/pg30486.cover.medium.jpg' WHERE slug = 'shirley';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL14978671W-L.jpg' WHERE slug = 'wuthering-heights';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/969/pg969.cover.medium.jpg'    WHERE slug = 'tenant-of-wildfell-hall';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/110/pg110.cover.medium.jpg'    WHERE slug = 'tess-of-the-durbervilles';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/107/pg107.cover.medium.jpg'    WHERE slug = 'far-from-madding-crowd';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/145/pg145.cover.medium.jpg'    WHERE slug = 'middlemarch';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/6688/pg6688.cover.medium.jpg'  WHERE slug = 'mill-on-the-floss';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL14867038W-L.jpg' WHERE slug = 'dorian-gray';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/902/pg902.cover.medium.jpg'    WHERE slug = 'happy-prince-wilde';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL14953720W-L.jpg' WHERE slug = 'treasure-island';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/43/pg43.cover.medium.jpg'      WHERE slug = 'jekyll-and-hyde';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/583/pg583.cover.medium.jpg'    WHERE slug = 'woman-in-white';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/155/pg155.cover.medium.jpg'    WHERE slug = 'the-moonstone';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/599/pg599.cover.medium.jpg'    WHERE slug = 'vanity-fair';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL139720W-L.jpg'   WHERE slug = 'robinson-crusoe';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/370/pg370.cover.medium.jpg'    WHERE slug = 'moll-flanders';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/829/pg829.cover.medium.jpg'    WHERE slug = 'gullivers-travels';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL53908W-L.jpg'    WHERE slug = 'huckleberry-finn';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/74/pg74.cover.medium.jpg'      WHERE slug = 'tom-sawyer';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/86/pg86.cover.medium.jpg'      WHERE slug = 'connecticut-yankee';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL14907230W-L.jpg' WHERE slug = 'call-of-the-wild';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/910/pg910.cover.medium.jpg'    WHERE slug = 'white-fang';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/1074/pg1074.cover.medium.jpg'  WHERE slug = 'sea-wolf';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/2147/pg2147.cover.medium.jpg'  WHERE slug = 'tales-of-mystery-poe';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/33/pg33.cover.medium.jpg'      WHERE slug = 'scarlet-letter';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL102749W-L.jpg'   WHERE slug = 'moby-dick';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL22856W-L.jpg'    WHERE slug = 'don-quixote';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/1237/pg1237.cover.medium.jpg'  WHERE slug = 'pere-goriot';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/1608/pg1608.cover.medium.jpg'  WHERE slug = 'eugenie-grandet';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL14951844W-L.jpg' WHERE slug = 'madame-bovary';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/3090/pg3090.cover.medium.jpg'  WHERE slug = 'maupassant-stories';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/2853/pg2853.cover.medium.jpg'  WHERE slug = 'quo-vadis';

-- ── Shakespeare ───────────────────────────────────────────────
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL14933567W-L.jpg' WHERE slug = 'hamlet';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL15533388W-L.jpg' WHERE slug = 'romeo-and-juliet';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL15533490W-L.jpg' WHERE slug = 'macbeth';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL15533491W-L.jpg' WHERE slug = 'othello';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL15533492W-L.jpg' WHERE slug = 'king-lear';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/1514/pg1514.cover.medium.jpg'  WHERE slug = 'midsummer-night';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/2243/pg2243.cover.medium.jpg'  WHERE slug = 'merchant-of-venice';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/23042/pg23042.cover.medium.jpg' WHERE slug = 'tempest';

-- ── Romance ───────────────────────────────────────────────────
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL8290123W-L.jpg' WHERE slug = 'werther';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/4547/pg4547.cover.medium.jpg'  WHERE slug = 'north-and-south';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/767/pg767.cover.medium.jpg'    WHERE slug = 'agnes-grey';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/2667/pg2667.cover.medium.jpg'  WHERE slug = 'vicar-of-wakefield';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/1513/pg1513.cover.medium.jpg'  WHERE slug = 'romeo-and-juliet';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/1514/pg1514.cover.medium.jpg'  WHERE slug = 'midsummer-night';

-- ── Philosophy ────────────────────────────────────────────────
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL15533584W-L.jpg' WHERE slug = 'meditations';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL8295123W-L.jpg'  WHERE slug = 'seneca-letters';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/1740/pg1740.cover.medium.jpg'  WHERE slug = 'seneca-shortness';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/45109/pg45109.cover.medium.jpg' WHERE slug = 'enchiridion';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/45109/pg45109.cover.medium.jpg' WHERE slug = 'discourses-epictetus';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/1497/pg1497.cover.medium.jpg'  WHERE slug = 'republic-plato';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/1600/pg1600.cover.medium.jpg'  WHERE slug = 'symposium-plato';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/1656/pg1656.cover.medium.jpg'  WHERE slug = 'apology-plato';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/8438/pg8438.cover.medium.jpg'  WHERE slug = 'nicomachean-ethics';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/6762/pg6762.cover.medium.jpg'  WHERE slug = 'politics-aristotle';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/3600/pg3600.cover.medium.jpg'  WHERE slug = 'montaigne-essays';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/19942/pg19942.cover.medium.jpg' WHERE slug = 'candide';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL1214721W-L.jpg'  WHERE slug = 'zarathustra';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/4363/pg4363.cover.medium.jpg'  WHERE slug = 'beyond-good-and-evil';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/52319/pg52319.cover.medium.jpg' WHERE slug = 'genealogy-of-morality';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/38427/pg38427.cover.medium.jpg' WHERE slug = 'world-as-will';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL17860371W-L.jpg' WHERE slug = 'art-of-war';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/8800/pg8800.cover.medium.jpg'  WHERE slug = 'divine-comedy';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/1232/pg1232.cover.medium.jpg'  WHERE slug = 'the-prince';

-- ── Self-Development ──────────────────────────────────────────
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL8302345W-L.jpg' WHERE slug = 'self-help';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/4897/pg4897.cover.medium.jpg'  WHERE slug = 'character-smiles';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/14418/pg14418.cover.medium.jpg' WHERE slug = 'thrift-smiles';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/14429/pg14429.cover.medium.jpg' WHERE slug = 'duty-smiles';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL8304567W-L.jpg' WHERE slug = 'science-of-getting-rich';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/4053/pg4053.cover.medium.jpg'  WHERE slug = 'science-of-being-great';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/11840/pg11840.cover.medium.jpg' WHERE slug = 'pushing-to-the-front';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/21623/pg21623.cover.medium.jpg' WHERE slug = 'he-can-who-thinks-he-can';

-- ── Business & Success ────────────────────────────────────────
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL8310234W-L.jpg' WHERE slug = 'autobiography-franklin';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/73742/pg73742.cover.medium.jpg' WHERE slug = 'poor-richard';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/2944/pg2944.cover.medium.jpg'  WHERE slug = 'emerson-essays';

-- ── Science ───────────────────────────────────────────────────
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL14907295W-L.jpg' WHERE slug = 'around-the-world-80-days';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL14907296W-L.jpg' WHERE slug = '20000-leagues';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/83/pg83.cover.medium.jpg'      WHERE slug = 'from-earth-to-moon';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/3748/pg3748.cover.medium.jpg'  WHERE slug = 'journey-to-center-of-earth';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/1268/pg1268.cover.medium.jpg'  WHERE slug = 'mysterious-island';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/1848/pg1848.cover.medium.jpg'  WHERE slug = 'michael-strogoff';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL8320456W-L.jpg' WHERE slug = 'origin-of-species';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/944/pg944.cover.medium.jpg'    WHERE slug = 'voyage-of-beagle';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/2300/pg2300.cover.medium.jpg'  WHERE slug = 'descent-of-man';

-- ── Uzbek Classics — keep existing Wikimedia covers, they are authentic ──────
-- (babur-name, navai-khamsa, navai-divan, khamsa-nizami, timurnama already have covers)
-- navai-muhakamat has no cover — use a general manuscript image
UPDATE books SET cover_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Navoi_portrait.jpg/400px-Navoi_portrait.jpg' WHERE slug = 'navai-muhakamat';
UPDATE books SET cover_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Ocharovanny_strannik.jpg/400px-Ocharovanny_strannik.jpg' WHERE slug = 'ocharovanny-strannik';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL8325789W-L.jpg' WHERE slug = 'ledi-makbet-mcenskogo';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL8326012W-L.jpg' WHERE slug = 'poedinok-kuprin';
