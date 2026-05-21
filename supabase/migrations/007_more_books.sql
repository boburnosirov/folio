-- ══════════════════════════════════════════════════════════════
--  Folio — Migration 007: More books to reach ~30 per genre
-- ══════════════════════════════════════════════════════════════

-- ── New authors ────────────────────────────────────────────────
INSERT INTO public.authors (name, name_ru, born_year, died_year, nationality, bio) VALUES
  ('Donna Tartt',        'Донна Тартт',        1963, NULL, 'American',    'Американская писательница, автор «Тайной истории» и «Щегла».'),
  ('Anthony Doerr',      'Энтони Дорр',        1973, NULL, 'American',    'Американский писатель, лауреат Пулитцеровской премии за «Весь невидимый нам свет».'),
  ('Khaled Hosseini',    'Халед Хоссейни',     1965, NULL, 'Afghan-American','Афганско-американский писатель, автор «Бегущего за ветром» и «Тысячи сияющих солнц».'),
  ('Markus Zusak',       'Маркус Зузак',       1975, NULL, 'Australian',  'Австралийский писатель, автор «Книжного вора».'),
  ('Gabrielle Zevin',    'Габриэль Зевин',     1977, NULL, 'American',    'Американская писательница, автор «Завтра, и завтра, и завтра».'),
  ('Colson Whitehead',   'Колсон Уайтхед',     1969, NULL, 'American',    'Американский писатель, дважды лауреат Пулитцеровской премии.'),
  ('Edward St Aubyn',    'Эдвард Сент-Обин',   1960, NULL, 'British',     'Британский писатель, автор серии романов о Патрике Мелроузе.'),
  ('Min Jin Lee',        'Мин Джин Ли',        1968, NULL, 'Korean-American','Корейско-американская писательница, автор «Пачинко» и «Свободной еды».'),
  ('Ocean Vuong',        'Оушен Выонг',        1988, NULL, 'Vietnamese-American','Вьетнамско-американский поэт и романист.'),
  ('Carmen Maria Machado','Кармен Мария Мачадо',1986,NULL, 'American',    'Американская писательница жанра фэнтези и магического реализма.'),
  ('Taylor Jenkins Reid','Тейлор Дженкинс Рид',1983,NULL, 'American',    'Американская романистка, мастер современного романтического жанра.'),
  ('Emily Henry',        'Эмили Генри',        1990, NULL, 'American',    'Американская писательница современных романтических романов.'),
  ('Ali Hazelwood',      'Али Хейзлвуд',       1990, NULL, 'Italian-American','Писательница романтических романов в жанре STEM-romance.'),
  ('Christina Lauren',   'Кристина Лорен',     NULL, NULL, 'American',    'Дуэт авторов, пишущих современные романтические романы.'),
  ('James Clear',        'Джеймс Клир',        1986, NULL, 'American',    'Американский эксперт по продуктивности, автор «Атомных привычек».'),
  ('Mark Manson',        'Марк Мэнсон',        1984, NULL, 'American',    'Американский блогер и автор книг по саморазвитию.'),
  ('Cal Newport',        'Кэл Ньюпорт',        1982, NULL, 'American',    'Американский профессор и автор книг об интенсивной работе.'),
  ('David Goggins',      'Дэвид Гоггинс',      1975, NULL, 'American',    'Американский ветеран спецназа, автор «Can''t Hurt Me».'),
  ('Robin Sharma',       'Робин Шарма',        1964, NULL, 'Canadian',    'Канадский мотивационный оратор, автор «Монаха, который продал свой Ferrari».'),
  ('Matthew McConaughey','Мэтью МакКонахи',    1969, NULL, 'American',    'Американский актёр и автор мемуаров «Зелёный свет».'),
  ('Andrew Huberman',    'Эндрю Хуберман',     1975, NULL, 'American',    'Нейробиолог Стэнфорда, эксперт по науке о производительности.'),
  ('Peter Thiel',        'Питер Тиль',         1967, NULL, 'American',    'Предприниматель, инвестор и соавтор «Zero to One».'),
  ('Phil Knight',        'Фил Найт',           1938, NULL, 'American',    'Основатель Nike, автор мемуаров «Продавец обуви».'),
  ('Chris Voss',         'Крис Восс',          1957, NULL, 'American',    'Бывший переговорщик ФБР, автор «Никогда не разделяй разницу».'),
  ('Walter Isaacson',    'Уолтер Айзексон',    1952, NULL, 'American',    'Американский биограф, написавший книги о Стиве Джобсе и Илоне Маске.'),
  ('Morgan Housel',      'Морган Хаусел',      1984, NULL, 'American',    'Финансовый аналитик и автор «Психологии денег».'),
  ('Ray Dalio',          'Рэй Далио',          1949, NULL, 'American',    'Основатель Bridgewater, автор «Принципов».'),
  ('Brian Greene',       'Брайан Грин',        1963, NULL, 'American',    'Физик-теоретик, популяризатор науки, автор «Элегантной вселенной».'),
  ('Carlo Rovelli',      'Карло Ровелли',      1956, NULL, 'Italian',     'Итальянский физик, автор «Семи кратких уроков физики».'),
  ('Richard Feynman',    'Ричард Фейнман',     1918, 1988, 'American',    'Нобелевский лауреат по физике, один из величайших учёных XX века.'),
  ('Michio Kaku',        'Митио Каку',         1947, NULL, 'American',    'Американский физик-теоретик и футуролог японского происхождения.')
ON CONFLICT (name) DO NOTHING;

-- ── Helper: get author id by name ──────────────────────────────
-- (We'll use subqueries inline)

-- ══════════════════════════════════════════════════════════════
--  FICTION (russian-classics category = Художественная литература)
-- ══════════════════════════════════════════════════════════════
INSERT INTO public.books (slug, title, title_ru, author_id, category_slug, language, year_published, description, cover_url, is_featured, is_public) VALUES

('secret-history',
 'The Secret History', 'Тайная история',
 (SELECT id FROM public.authors WHERE name = 'Donna Tartt'),
 'russian-classics', 'en', 1992,
 'A group of classics students at a small Vermont college manipulate a fellow student into a crime that haunts them for years.',
 'https://covers.openlibrary.org/b/isbn/9781400031702-L.jpg', false, true),

('all-the-light',
 'All the Light We Cannot See', 'Весь невидимый нам свет',
 (SELECT id FROM public.authors WHERE name = 'Anthony Doerr'),
 'russian-classics', 'en', 2014,
 'The intertwining fates of a blind French girl and a German boy during World War II. Pulitzer Prize winner.',
 'https://covers.openlibrary.org/b/isbn/9781476746586-L.jpg', true, true),

('kite-runner',
 'The Kite Runner', 'Бегущий за ветром',
 (SELECT id FROM public.authors WHERE name = 'Khaled Hosseini'),
 'russian-classics', 'en', 2003,
 'A powerful story of friendship, betrayal, and redemption set against the backdrop of Afghanistan.',
 'https://covers.openlibrary.org/b/isbn/9781594631931-L.jpg', true, true),

('thousand-suns',
 'A Thousand Splendid Suns', 'Тысяча сияющих солнц',
 (SELECT id FROM public.authors WHERE name = 'Khaled Hosseini'),
 'russian-classics', 'en', 2007,
 'An intimate portrait of three decades of Afghan history told through the lives of two extraordinary women.',
 'https://covers.openlibrary.org/b/isbn/9781594483851-L.jpg', true, true),

('book-thief',
 'The Book Thief', 'Книжный вор',
 (SELECT id FROM public.authors WHERE name = 'Markus Zusak'),
 'russian-classics', 'en', 2005,
 'Narrated by Death, this is the story of a young girl who finds solace in books during World War II.',
 'https://covers.openlibrary.org/b/isbn/9780375842207-L.jpg', true, true),

('tomorrow-and-tomorrow',
 'Tomorrow, and Tomorrow, and Tomorrow', 'Завтра, и завтра, и завтра',
 (SELECT id FROM public.authors WHERE name = 'Gabrielle Zevin'),
 'russian-classics', 'en', 2022,
 'A novel about love, art, and commerce spanning three decades of video game creation.',
 'https://covers.openlibrary.org/b/isbn/9780593321201-L.jpg', true, true),

('underground-railroad',
 'The Underground Railroad', 'Подземная железная дорога',
 (SELECT id FROM public.authors WHERE name = 'Colson Whitehead'),
 'russian-classics', 'en', 2016,
 'A young slave makes a desperate bid for freedom — and Whitehead reimagines American history.',
 'https://covers.openlibrary.org/b/isbn/9780385537049-L.jpg', false, true),

('lincoln-in-the-bardo',
 'Lincoln in the Bardo', 'Линкольн в Бардо',
 (SELECT id FROM public.authors WHERE name = 'George Saunders'),
 'russian-classics', 'en', 2017,
 'President Lincoln visits his young son''s grave. A chorus of voices from the graveyard tells their stories.',
 'https://covers.openlibrary.org/b/isbn/9780812995343-L.jpg', false, true),

('on-earth-were-briefly-gorgeous',
 'On Earth We''re Briefly Gorgeous', 'На Земле мы ненадолго прекрасны',
 (SELECT id FROM public.authors WHERE name = 'Ocean Vuong'),
 'russian-classics', 'en', 2019,
 'A letter from a son to a mother who cannot read — a shattering portrait of a family, and a meditation on identity.',
 'https://covers.openlibrary.org/b/isbn/9780525562023-L.jpg', false, true),

('her-body-and-other-parties',
 'Her Body and Other Parties', 'Её тело и другие вечеринки',
 (SELECT id FROM public.authors WHERE name = 'Carmen Maria Machado'),
 'russian-classics', 'en', 2017,
 'A debut collection of stories that blend the real and unreal to explore desires, identity, and female experience.',
 'https://covers.openlibrary.org/b/isbn/9781555977887-L.jpg', false, true)

ON CONFLICT ON CONSTRAINT books_slug_key DO NOTHING;

-- Russian versions of new fiction
INSERT INTO public.books (slug, title, title_ru, author_id, category_slug, language, year_published, description, cover_url, is_featured, is_public) VALUES

('secret-history-ru',
 'The Secret History', 'Тайная история',
 (SELECT id FROM public.authors WHERE name = 'Donna Tartt'),
 'russian-classics', 'ru', 1992,
 'Группа студентов-классиков в маленьком колледже Вермонта втягивает однокурсника в преступление, которое будет преследовать их годами.',
 'https://covers.openlibrary.org/b/isbn/9781400031702-L.jpg', false, true),

('all-the-light-ru',
 'All the Light We Cannot See', 'Весь невидимый нам свет',
 (SELECT id FROM public.authors WHERE name = 'Anthony Doerr'),
 'russian-classics', 'ru', 2014,
 'Переплетающиеся судьбы слепой французской девочки и немецкого мальчика во Второй мировой войне. Пулитцеровская премия.',
 'https://covers.openlibrary.org/b/isbn/9781476746586-L.jpg', true, true),

('kite-runner-ru',
 'The Kite Runner', 'Бегущий за ветром',
 (SELECT id FROM public.authors WHERE name = 'Khaled Hosseini'),
 'russian-classics', 'ru', 2003,
 'Мощная история дружбы, предательства и искупления на фоне афганской трагедии.',
 'https://covers.openlibrary.org/b/isbn/9781594631931-L.jpg', true, true),

('thousand-suns-ru',
 'A Thousand Splendid Suns', 'Тысяча сияющих солнц',
 (SELECT id FROM public.authors WHERE name = 'Khaled Hosseini'),
 'russian-classics', 'ru', 2007,
 'Портрет трёх десятилетий афганской истории через судьбы двух необыкновенных женщин.',
 'https://covers.openlibrary.org/b/isbn/9781594483851-L.jpg', true, true),

('book-thief-ru',
 'The Book Thief', 'Книжный вор',
 (SELECT id FROM public.authors WHERE name = 'Markus Zusak'),
 'russian-classics', 'ru', 2005,
 'Рассказанная Смертью история девочки, нашедшей утешение в книгах во время Второй мировой войны.',
 'https://covers.openlibrary.org/b/isbn/9780375842207-L.jpg', true, true),

('tomorrow-and-tomorrow-ru',
 'Tomorrow, and Tomorrow, and Tomorrow', 'Завтра, и завтра, и завтра',
 (SELECT id FROM public.authors WHERE name = 'Gabrielle Zevin'),
 'russian-classics', 'ru', 2022,
 'Роман о любви, искусстве и коммерции, охватывающий три десятилетия создания видеоигр.',
 'https://covers.openlibrary.org/b/isbn/9780593321201-L.jpg', true, true),

('underground-railroad-ru',
 'The Underground Railroad', 'Подземная железная дорога',
 (SELECT id FROM public.authors WHERE name = 'Colson Whitehead'),
 'russian-classics', 'ru', 2016,
 'Молодая рабыня делает отчаянную попытку бежать на свободу — Уайтхед переосмысляет американскую историю.',
 'https://covers.openlibrary.org/b/isbn/9780385537049-L.jpg', false, true),

('on-earth-were-briefly-gorgeous-ru',
 'On Earth We''re Briefly Gorgeous', 'На Земле мы ненадолго прекрасны',
 (SELECT id FROM public.authors WHERE name = 'Ocean Vuong'),
 'russian-classics', 'ru', 2019,
 'Письмо сына матери, которая не умеет читать — пронзительный портрет семьи и медитация об идентичности.',
 'https://covers.openlibrary.org/b/isbn/9780525562023-L.jpg', false, true)

ON CONFLICT ON CONSTRAINT books_slug_key DO NOTHING;

-- ══════════════════════════════════════════════════════════════
--  ROMANCE
-- ══════════════════════════════════════════════════════════════
INSERT INTO public.books (slug, title, title_ru, author_id, category_slug, language, year_published, description, cover_url, is_featured, is_public) VALUES

('daisy-jones',
 'Daisy Jones & The Six', 'Дейзи Джонс и The Six',
 (SELECT id FROM public.authors WHERE name = 'Taylor Jenkins Reid'),
 'romance', 'en', 2019,
 'The story of a fictional rock band''s rise to fame in the 1970s told through oral history.',
 'https://covers.openlibrary.org/b/isbn/9781524798628-L.jpg', true, true),

('malibu-rising',
 'Malibu Rising', 'Малибу: Восход',
 (SELECT id FROM public.authors WHERE name = 'Taylor Jenkins Reid'),
 'romance', 'en', 2021,
 'Four famous siblings throw an epic party at their Malibu home while their lives implode around them.',
 'https://covers.openlibrary.org/b/isbn/9781524798680-L.jpg', false, true),

('love-hypothesis',
 'The Love Hypothesis', 'Гипотеза любви',
 (SELECT id FROM public.authors WHERE name = 'Ali Hazelwood'),
 'romance', 'en', 2021,
 'A fake dating agreement between a PhD student and a professor spirals into something real.',
 'https://covers.openlibrary.org/b/isbn/9780593336823-L.jpg', false, true),

('spanish-love-deception',
 'The Spanish Love Deception', 'Испанский обман любви',
 (SELECT id FROM public.authors WHERE name = 'Ali Hazelwood'),
 'romance', 'en', 2021,
 'She needs a fake boyfriend for her sister''s wedding in Spain. Her insufferable coworker volunteers.',
 'https://covers.openlibrary.org/b/isbn/9780593338179-L.jpg', false, true),

('funny-story',
 'Funny Story', 'Смешная история',
 (SELECT id FROM public.authors WHERE name = 'Emily Henry'),
 'romance', 'en', 2024,
 'A librarian and a river guide are thrown together when their exes fall in love with each other.',
 'https://covers.openlibrary.org/b/isbn/9780593441282-L.jpg', false, true),

('happy-place',
 'Happy Place', 'Счастливое место',
 (SELECT id FROM public.authors WHERE name = 'Emily Henry'),
 'romance', 'en', 2023,
 'Two exes must pretend to still be together at their annual friend trip to a beloved Maine cottage.',
 'https://covers.openlibrary.org/b/isbn/9780593441268-L.jpg', false, true),

('ugly-love',
 'Ugly Love', 'Уродливая любовь',
 (SELECT id FROM public.authors WHERE name = 'Colleen Hoover'),
 'romance', 'en', 2014,
 'A no-strings arrangement between a nurse and a pilot becomes complicated when feelings develop.',
 'https://covers.openlibrary.org/b/isbn/9781476753195-L.jpg', false, true),

('november-9',
 'November 9', '9 ноября',
 (SELECT id FROM public.authors WHERE name = 'Colleen Hoover'),
 'romance', 'en', 2015,
 'Two strangers meet every November 9th for five years, falling deeper in love each time.',
 'https://covers.openlibrary.org/b/isbn/9781501110375-L.jpg', false, true),

('twice-in-a-blue-moon',
 'Twice in a Blue Moon', 'Дважды в синей луне',
 (SELECT id FROM public.authors WHERE name = 'Christina Lauren'),
 'romance', 'en', 2019,
 'A young woman crosses paths with a famous actor years after a life-changing summer encounter.',
 'https://covers.openlibrary.org/b/isbn/9781982107284-L.jpg', false, true),

('in-a-holidaze',
 'In a Holidaze', 'В праздничном головокружении',
 (SELECT id FROM public.authors WHERE name = 'Christina Lauren'),
 'romance', 'en', 2020,
 'After a disastrous holiday, a young woman wakes up reliving the same week over and over.',
 'https://covers.openlibrary.org/b/isbn/9781982123017-L.jpg', false, true)

ON CONFLICT ON CONSTRAINT books_slug_key DO NOTHING;

-- Russian versions of new romance
INSERT INTO public.books (slug, title, title_ru, author_id, category_slug, language, year_published, description, cover_url, is_featured, is_public) VALUES

('daisy-jones-ru',
 'Daisy Jones & The Six', 'Дейзи Джонс и The Six',
 (SELECT id FROM public.authors WHERE name = 'Taylor Jenkins Reid'),
 'romance', 'ru', 2019,
 'История взлёта вымышленной рок-группы в 1970-е, рассказанная в формате устной истории.',
 'https://covers.openlibrary.org/b/isbn/9781524798628-L.jpg', true, true),

('love-hypothesis-ru',
 'The Love Hypothesis', 'Гипотеза любви',
 (SELECT id FROM public.authors WHERE name = 'Ali Hazelwood'),
 'romance', 'ru', 2021,
 'Фиктивные отношения между аспиранткой и профессором перерастают во что-то настоящее.',
 'https://covers.openlibrary.org/b/isbn/9780593336823-L.jpg', false, true),

('funny-story-ru',
 'Funny Story', 'Смешная история',
 (SELECT id FROM public.authors WHERE name = 'Emily Henry'),
 'romance', 'ru', 2024,
 'Библиотекарь и речной гид оказываются вместе, когда их бывшие влюбляются друг в друга.',
 'https://covers.openlibrary.org/b/isbn/9780593441282-L.jpg', false, true),

('ugly-love-ru',
 'Ugly Love', 'Уродливая любовь',
 (SELECT id FROM public.authors WHERE name = 'Colleen Hoover'),
 'romance', 'ru', 2014,
 'Отношения без обязательств между медсестрой и пилотом осложняются, когда появляются чувства.',
 'https://covers.openlibrary.org/b/isbn/9781476753195-L.jpg', false, true),

('november-9-ru',
 'November 9', '9 ноября',
 (SELECT id FROM public.authors WHERE name = 'Colleen Hoover'),
 'romance', 'ru', 2015,
 'Двое незнакомцев встречаются каждый год 9 ноября на протяжении пяти лет, влюбляясь всё глубже.',
 'https://covers.openlibrary.org/b/isbn/9781501110375-L.jpg', false, true)

ON CONFLICT ON CONSTRAINT books_slug_key DO NOTHING;

-- ══════════════════════════════════════════════════════════════
--  SELF-DEVELOPMENT
-- ══════════════════════════════════════════════════════════════
INSERT INTO public.books (slug, title, title_ru, author_id, category_slug, language, year_published, description, cover_url, is_featured, is_public) VALUES

('greenlights',
 'Greenlights', 'Зелёный свет',
 (SELECT id FROM public.authors WHERE name = 'Matthew McConaughey'),
 'self-development', 'en', 2020,
 'The Oscar-winning actor shares lessons, stories and outlaw wisdom from his raucous, tender, adventurous life.',
 'https://covers.openlibrary.org/b/isbn/9780593139134-L.jpg', false, true),

('power-of-now',
 'The Power of Now', 'Сила настоящего',
 (SELECT id FROM public.authors WHERE name = 'Eckhart Tolle'),
 'self-development', 'en', 1997,
 'A guide to spiritual enlightenment showing how to free yourself from enslavement to the mind.',
 'https://covers.openlibrary.org/b/isbn/9781577314806-L.jpg', true, true),

('mindset',
 'Mindset: The New Psychology of Success', 'Образ мышления',
 (SELECT id FROM public.authors WHERE name = 'Carol Dweck'),
 'self-development', 'en', 2006,
 'World-renowned Stanford psychologist reveals how our mindset shapes our success and potential.',
 'https://covers.openlibrary.org/b/isbn/9780345472328-L.jpg', true, true),

('daring-greatly',
 'Daring Greatly', 'Дары несовершенства',
 (SELECT id FROM public.authors WHERE name = 'Brené Brown'),
 'self-development', 'en', 2012,
 'Based on a decade of research, shows how vulnerability is the greatest measure of courage.',
 'https://covers.openlibrary.org/b/isbn/9781592407330-L.jpg', false, true),

('monk-who-sold-ferrari',
 'The Monk Who Sold His Ferrari', 'Монах, который продал свой Ferrari',
 (SELECT id FROM public.authors WHERE name = 'Robin Sharma'),
 'self-development', 'en', 1997,
 'A fable about fulfilling your dreams and reaching your destiny through the teachings of an enlightened monk.',
 'https://covers.openlibrary.org/b/isbn/9780062515936-L.jpg', false, true),

('essentialism',
 'Essentialism: The Disciplined Pursuit of Less', 'Эссенциализм',
 (SELECT id FROM public.authors WHERE name = 'Greg McKeown'),
 'self-development', 'en', 2014,
 'A systematic discipline for discerning what is absolutely essential and eliminating everything else.',
 'https://covers.openlibrary.org/b/isbn/9780804137386-L.jpg', false, true),

('psychology-of-money',
 'The Psychology of Money', 'Психология денег',
 (SELECT id FROM public.authors WHERE name = 'Morgan Housel'),
 'self-development', 'en', 2020,
 'Timeless lessons on wealth, greed, and happiness through 19 short stories about people''s relationship with money.',
 'https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg', true, true),

('ikigai',
 'Ikigai: The Japanese Secret to a Long and Happy Life', 'Икигай',
 (SELECT id FROM public.authors WHERE name = 'Héctor García'),
 'self-development', 'en', 2017,
 'The Japanese concept that combines what you love, what you''re good at, and what the world needs.',
 'https://covers.openlibrary.org/b/isbn/9780143130727-L.jpg', false, true),

('stolen-focus',
 'Stolen Focus', 'Украденное внимание',
 (SELECT id FROM public.authors WHERE name = 'Johann Hari'),
 'self-development', 'en', 2022,
 'An investigation into why we can''t pay attention and how to reclaim it in the modern world.',
 'https://covers.openlibrary.org/b/isbn/9780593138526-L.jpg', false, true),

('burnout',
 'Burnout: The Secret to Unlocking the Stress Cycle', 'Выгорание',
 (SELECT id FROM public.authors WHERE name = 'Emily Nagoski'),
 'self-development', 'en', 2019,
 'Two sisters explain the science behind stress and burnout, and how to complete the stress cycle.',
 'https://covers.openlibrary.org/b/isbn/9781984818324-L.jpg', false, true)

ON CONFLICT ON CONSTRAINT books_slug_key DO NOTHING;

-- Russian versions
INSERT INTO public.books (slug, title, title_ru, author_id, category_slug, language, year_published, description, cover_url, is_featured, is_public) VALUES

('power-of-now-ru',
 'The Power of Now', 'Сила настоящего',
 (SELECT id FROM public.authors WHERE name = 'Eckhart Tolle'),
 'self-development', 'ru', 1997,
 'Руководство по духовному просветлению о том, как освободиться от порабощения разумом.',
 'https://covers.openlibrary.org/b/isbn/9781577314806-L.jpg', true, true),

('mindset-ru',
 'Mindset', 'Образ мышления',
 (SELECT id FROM public.authors WHERE name = 'Carol Dweck'),
 'self-development', 'ru', 2006,
 'Всемирно известный психолог Стэнфорда раскрывает, как наш образ мышления формирует наш успех.',
 'https://covers.openlibrary.org/b/isbn/9780345472328-L.jpg', true, true),

('monk-who-sold-ferrari-ru',
 'The Monk Who Sold His Ferrari', 'Монах, который продал свой Ferrari',
 (SELECT id FROM public.authors WHERE name = 'Robin Sharma'),
 'self-development', 'ru', 1997,
 'Притча о выполнении своих мечтаний через учения просветлённого монаха.',
 'https://covers.openlibrary.org/b/isbn/9780062515936-L.jpg', false, true),

('psychology-of-money-ru',
 'The Psychology of Money', 'Психология денег',
 (SELECT id FROM public.authors WHERE name = 'Morgan Housel'),
 'self-development', 'ru', 2020,
 'Вечные уроки о богатстве, жадности и счастье через 19 историй об отношении людей к деньгам.',
 'https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg', true, true),

('ikigai-ru',
 'Ikigai', 'Икигай',
 (SELECT id FROM public.authors WHERE name = 'Héctor García'),
 'self-development', 'ru', 2017,
 'Японская концепция, объединяющая то, что вы любите, то, что у вас хорошо получается, и то, что нужно миру.',
 'https://covers.openlibrary.org/b/isbn/9780143130727-L.jpg', false, true),

('greenlights-ru',
 'Greenlights', 'Зелёный свет',
 (SELECT id FROM public.authors WHERE name = 'Matthew McConaughey'),
 'self-development', 'ru', 2020,
 'Актёр-оскароносец делится уроками и историями из своей бурной, нежной, авантюрной жизни.',
 'https://covers.openlibrary.org/b/isbn/9780593139134-L.jpg', false, true)

ON CONFLICT ON CONSTRAINT books_slug_key DO NOTHING;

-- ══════════════════════════════════════════════════════════════
--  BUSINESS & SUCCESS
-- ══════════════════════════════════════════════════════════════
INSERT INTO public.books (slug, title, title_ru, author_id, category_slug, language, year_published, description, cover_url, is_featured, is_public) VALUES

('principles',
 'Principles: Life and Work', 'Принципы',
 (SELECT id FROM public.authors WHERE name = 'Ray Dalio'),
 'business-success', 'en', 2017,
 'The billionaire founder of Bridgewater shares the unconventional principles that helped him create unique results.',
 'https://covers.openlibrary.org/b/isbn/9781501124020-L.jpg', true, true),

('hard-thing-about-hard-things',
 'The Hard Thing About Hard Things', 'Легко не будет',
 (SELECT id FROM public.authors WHERE name = 'Ben Horowitz'),
 'business-success', 'en', 2014,
 'Building a business when there are no easy answers, from cofounder of Andreessen Horowitz.',
 'https://covers.openlibrary.org/b/isbn/9780062273208-L.jpg', false, true),

('start-with-why',
 'Start with Why', 'Начни с «Почему»',
 (SELECT id FROM public.authors WHERE name = 'Simon Sinek'),
 'business-success', 'en', 2009,
 'How great leaders inspire everyone to take action by starting with why they do what they do.',
 'https://covers.openlibrary.org/b/isbn/9781591846444-L.jpg', true, true),

('good-to-great',
 'Good to Great', 'От хорошего к великому',
 (SELECT id FROM public.authors WHERE name = 'Jim Collins'),
 'business-success', 'en', 2001,
 'Why some companies make the leap to greatness and others don''t — based on a 5-year research project.',
 'https://covers.openlibrary.org/b/isbn/9780066620992-L.jpg', false, true),

('lean-startup',
 'The Lean Startup', 'Бизнес с нуля',
 (SELECT id FROM public.authors WHERE name = 'Eric Ries'),
 'business-success', 'en', 2011,
 'How today''s entrepreneurs use continuous innovation to create radically successful businesses.',
 'https://covers.openlibrary.org/b/isbn/9780307887894-L.jpg', false, true),

('trillion-dollar-coach',
 'Trillion Dollar Coach', 'Тренер на триллион',
 (SELECT id FROM public.authors WHERE name = 'Eric Schmidt'),
 'business-success', 'en', 2019,
 'The leadership playbook of Silicon Valley''s Bill Campbell, who coached Google, Apple, and Intuit.',
 'https://covers.openlibrary.org/b/isbn/9780062839268-L.jpg', false, true),

('rich-dad-poor-dad',
 'Rich Dad Poor Dad', 'Богатый папа, бедный папа',
 (SELECT id FROM public.authors WHERE name = 'Robert Kiyosaki'),
 'business-success', 'en', 1997,
 'What the rich teach their kids about money that the poor and middle class do not.',
 'https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg', true, true),

('thinking-fast-and-slow',
 'Thinking, Fast and Slow', 'Думай медленно, решай быстро',
 (SELECT id FROM public.authors WHERE name = 'Daniel Kahneman'),
 'business-success', 'en', 2011,
 'Nobel laureate examines the two systems that drive the way we think — and how we can make better decisions.',
 'https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg', true, true),

('the-innovators-dilemma',
 'The Innovator''s Dilemma', 'Дилемма инноватора',
 (SELECT id FROM public.authors WHERE name = 'Clayton Christensen'),
 'business-success', 'en', 1997,
 'Why great companies fail and how new entrants disrupt established industries.',
 'https://covers.openlibrary.org/b/isbn/9780875845852-L.jpg', false, true),

('influence',
 'Influence: The Psychology of Persuasion', 'Психология влияния',
 (SELECT id FROM public.authors WHERE name = 'Robert Cialdini'),
 'business-success', 'en', 1984,
 'The classic on the psychology of persuasion. Six principles that guide human behavior.',
 'https://covers.openlibrary.org/b/isbn/9780062937650-L.jpg', false, true)

ON CONFLICT ON CONSTRAINT books_slug_key DO NOTHING;

-- Russian versions
INSERT INTO public.books (slug, title, title_ru, author_id, category_slug, language, year_published, description, cover_url, is_featured, is_public) VALUES

('principles-ru',
 'Principles', 'Принципы',
 (SELECT id FROM public.authors WHERE name = 'Ray Dalio'),
 'business-success', 'ru', 2017,
 'Основатель Bridgewater делится нестандартными принципами, которые помогли ему добиться уникальных результатов.',
 'https://covers.openlibrary.org/b/isbn/9781501124020-L.jpg', true, true),

('start-with-why-ru',
 'Start with Why', 'Начни с «Почему»',
 (SELECT id FROM public.authors WHERE name = 'Simon Sinek'),
 'business-success', 'ru', 2009,
 'Как великие лидеры вдохновляют всех на действия, начиная с вопроса «почему» они делают то, что делают.',
 'https://covers.openlibrary.org/b/isbn/9781591846444-L.jpg', true, true),

('rich-dad-poor-dad-ru',
 'Rich Dad Poor Dad', 'Богатый папа, бедный папа',
 (SELECT id FROM public.authors WHERE name = 'Robert Kiyosaki'),
 'business-success', 'ru', 1997,
 'Чему богатые учат своих детей о деньгах, чему не учат бедные и средний класс.',
 'https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg', true, true),

('thinking-fast-and-slow-ru',
 'Thinking, Fast and Slow', 'Думай медленно, решай быстро',
 (SELECT id FROM public.authors WHERE name = 'Daniel Kahneman'),
 'business-success', 'ru', 2011,
 'Нобелевский лауреат исследует две системы, управляющие нашим мышлением, и как принимать лучшие решения.',
 'https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg', true, true),

('lean-startup-ru',
 'The Lean Startup', 'Бизнес с нуля',
 (SELECT id FROM public.authors WHERE name = 'Eric Ries'),
 'business-success', 'ru', 2011,
 'Как современные предприниматели используют непрерывные инновации для создания успешного бизнеса.',
 'https://covers.openlibrary.org/b/isbn/9780307887894-L.jpg', false, true),

('influence-ru',
 'Influence', 'Психология влияния',
 (SELECT id FROM public.authors WHERE name = 'Robert Cialdini'),
 'business-success', 'ru', 1984,
 'Классика психологии убеждения. Шесть принципов, которые управляют поведением людей.',
 'https://covers.openlibrary.org/b/isbn/9780062937650-L.jpg', false, true)

ON CONFLICT ON CONSTRAINT books_slug_key DO NOTHING;

-- ══════════════════════════════════════════════════════════════
--  SCIENCE
-- ══════════════════════════════════════════════════════════════
INSERT INTO public.books (slug, title, title_ru, author_id, category_slug, language, year_published, description, cover_url, is_featured, is_public) VALUES

('elegant-universe',
 'The Elegant Universe', 'Элегантная вселенная',
 (SELECT id FROM public.authors WHERE name = 'Brian Greene'),
 'science', 'en', 1999,
 'Superstrings, hidden dimensions, and the quest for the ultimate theory of everything.',
 'https://covers.openlibrary.org/b/isbn/9780393058581-L.jpg', false, true),

('seven-brief-lessons',
 'Seven Brief Lessons on Physics', 'Семь кратких уроков физики',
 (SELECT id FROM public.authors WHERE name = 'Carlo Rovelli'),
 'science', 'en', 2014,
 'A beautiful, mind-expanding tour of modern physics written for a general audience.',
 'https://covers.openlibrary.org/b/isbn/9780735216051-L.jpg', true, true),

('surely-youre-joking',
 'Surely You''re Joking, Mr. Feynman!', 'Вы, конечно, шутите, мистер Фейнман!',
 (SELECT id FROM public.authors WHERE name = 'Richard Feynman'),
 'science', 'en', 1985,
 'Adventures of a curious character — Nobel Prize-winning physicist Richard Feynman''s hilarious memoir.',
 'https://covers.openlibrary.org/b/isbn/9780393316049-L.jpg', true, true),

('physics-of-the-future',
 'Physics of the Future', 'Физика будущего',
 (SELECT id FROM public.authors WHERE name = 'Michio Kaku'),
 'science', 'en', 2011,
 'How science will shape human destiny and our daily lives by the year 2100.',
 'https://covers.openlibrary.org/b/isbn/9780307473332-L.jpg', false, true),

('brief-history-of-time',
 'A Brief History of Time', 'Краткая история времени',
 (SELECT id FROM public.authors WHERE name = 'Stephen Hawking'),
 'science', 'en', 1988,
 'From the Big Bang to black holes, a landmark work in science writing by the legendary physicist.',
 'https://covers.openlibrary.org/b/isbn/9780553380163-L.jpg', true, true),

('pale-blue-dot',
 'Pale Blue Dot', 'Голубая точка',
 (SELECT id FROM public.authors WHERE name = 'Carl Sagan'),
 'science', 'en', 1994,
 'A vision of the human future in space — one of Sagan''s most profound and beautiful works.',
 'https://covers.openlibrary.org/b/isbn/9780345376596-L.jpg', true, true),

('cosmos',
 'Cosmos', 'Космос',
 (SELECT id FROM public.authors WHERE name = 'Carl Sagan'),
 'science', 'en', 1980,
 'The story of the universe from the big bang to the dawn of human civilization.',
 'https://covers.openlibrary.org/b/isbn/9780375508325-L.jpg', true, true),

('origin-of-species',
 'On the Origin of Species', 'Происхождение видов',
 (SELECT id FROM public.authors WHERE name = 'Charles Darwin'),
 'science', 'en', 1859,
 'Darwin''s groundbreaking work that laid the foundation of evolutionary biology.',
 'https://covers.openlibrary.org/b/olid/OL515051W-L.jpg', false, true),

('thinking-in-systems',
 'Thinking in Systems', 'Азбука системного мышления',
 (SELECT id FROM public.authors WHERE name = 'Donella Meadows'),
 'science', 'en', 2008,
 'A primer on systems thinking: understand why things go wrong and how to make them right.',
 'https://covers.openlibrary.org/b/isbn/9781603580557-L.jpg', false, true),

('outliers',
 'Outliers: The Story of Success', 'Гении и аутсайдеры',
 (SELECT id FROM public.authors WHERE name = 'Malcolm Gladwell'),
 'science', 'en', 2008,
 'Why some people succeed far more than others — the hidden factors of exceptional achievement.',
 'https://covers.openlibrary.org/b/isbn/9780316017930-L.jpg', false, true)

ON CONFLICT ON CONSTRAINT books_slug_key DO NOTHING;

-- Russian versions
INSERT INTO public.books (slug, title, title_ru, author_id, category_slug, language, year_published, description, cover_url, is_featured, is_public) VALUES

('seven-brief-lessons-ru',
 'Seven Brief Lessons on Physics', 'Семь кратких уроков физики',
 (SELECT id FROM public.authors WHERE name = 'Carlo Rovelli'),
 'science', 'ru', 2014,
 'Красивое, расширяющее сознание путешествие по современной физике, написанное для широкой аудитории.',
 'https://covers.openlibrary.org/b/isbn/9780735216051-L.jpg', true, true),

('surely-youre-joking-ru',
 'Surely You''re Joking, Mr. Feynman!', 'Вы, конечно, шутите, мистер Фейнман!',
 (SELECT id FROM public.authors WHERE name = 'Richard Feynman'),
 'science', 'ru', 1985,
 'Захватывающие приключения любознательного персонажа — смешные мемуары нобелевского лауреата Фейнмана.',
 'https://covers.openlibrary.org/b/isbn/9780393316049-L.jpg', true, true),

('brief-history-of-time-ru',
 'A Brief History of Time', 'Краткая история времени',
 (SELECT id FROM public.authors WHERE name = 'Stephen Hawking'),
 'science', 'ru', 1988,
 'От Большого взрыва до чёрных дыр — ключевая работа в научно-популярной литературе легендарного физика.',
 'https://covers.openlibrary.org/b/isbn/9780553380163-L.jpg', true, true),

('pale-blue-dot-ru',
 'Pale Blue Dot', 'Голубая точка',
 (SELECT id FROM public.authors WHERE name = 'Carl Sagan'),
 'science', 'ru', 1994,
 'Видение будущего человечества в космосе — одна из самых глубоких и красивых работ Сагана.',
 'https://covers.openlibrary.org/b/isbn/9780345376596-L.jpg', true, true),

('cosmos-ru',
 'Cosmos', 'Космос',
 (SELECT id FROM public.authors WHERE name = 'Carl Sagan'),
 'science', 'ru', 1980,
 'История вселенной от Большого взрыва до рассвета человеческой цивилизации.',
 'https://covers.openlibrary.org/b/isbn/9780375508325-L.jpg', true, true),

('outliers-ru',
 'Outliers', 'Гении и аутсайдеры',
 (SELECT id FROM public.authors WHERE name = 'Malcolm Gladwell'),
 'science', 'ru', 2008,
 'Почему одни люди добиваются успеха гораздо больше других — скрытые факторы исключительных достижений.',
 'https://covers.openlibrary.org/b/isbn/9780316017930-L.jpg', false, true),

('elegant-universe-ru',
 'The Elegant Universe', 'Элегантная вселенная',
 (SELECT id FROM public.authors WHERE name = 'Brian Greene'),
 'science', 'ru', 1999,
 'Суперструны, скрытые измерения и поиск единой теории всего.',
 'https://covers.openlibrary.org/b/isbn/9780393058581-L.jpg', false, true)

ON CONFLICT ON CONSTRAINT books_slug_key DO NOTHING;

-- ══════════════════════════════════════════════════════════════
--  Link new companion slugs (EN ↔ RU)
-- ══════════════════════════════════════════════════════════════
UPDATE public.books SET companion_slug = 'secret-history-ru'              WHERE slug = 'secret-history';
UPDATE public.books SET companion_slug = 'secret-history'                 WHERE slug = 'secret-history-ru';
UPDATE public.books SET companion_slug = 'all-the-light-ru'               WHERE slug = 'all-the-light';
UPDATE public.books SET companion_slug = 'all-the-light'                  WHERE slug = 'all-the-light-ru';
UPDATE public.books SET companion_slug = 'kite-runner-ru'                 WHERE slug = 'kite-runner';
UPDATE public.books SET companion_slug = 'kite-runner'                    WHERE slug = 'kite-runner-ru';
UPDATE public.books SET companion_slug = 'thousand-suns-ru'               WHERE slug = 'thousand-suns';
UPDATE public.books SET companion_slug = 'thousand-suns'                  WHERE slug = 'thousand-suns-ru';
UPDATE public.books SET companion_slug = 'book-thief-ru'                  WHERE slug = 'book-thief';
UPDATE public.books SET companion_slug = 'book-thief'                     WHERE slug = 'book-thief-ru';
UPDATE public.books SET companion_slug = 'tomorrow-and-tomorrow-ru'       WHERE slug = 'tomorrow-and-tomorrow';
UPDATE public.books SET companion_slug = 'tomorrow-and-tomorrow'          WHERE slug = 'tomorrow-and-tomorrow-ru';
UPDATE public.books SET companion_slug = 'underground-railroad-ru'        WHERE slug = 'underground-railroad';
UPDATE public.books SET companion_slug = 'underground-railroad'           WHERE slug = 'underground-railroad-ru';
UPDATE public.books SET companion_slug = 'on-earth-were-briefly-gorgeous-ru' WHERE slug = 'on-earth-were-briefly-gorgeous';
UPDATE public.books SET companion_slug = 'on-earth-were-briefly-gorgeous' WHERE slug = 'on-earth-were-briefly-gorgeous-ru';
UPDATE public.books SET companion_slug = 'daisy-jones-ru'                 WHERE slug = 'daisy-jones';
UPDATE public.books SET companion_slug = 'daisy-jones'                    WHERE slug = 'daisy-jones-ru';
UPDATE public.books SET companion_slug = 'love-hypothesis-ru'             WHERE slug = 'love-hypothesis';
UPDATE public.books SET companion_slug = 'love-hypothesis'                WHERE slug = 'love-hypothesis-ru';
UPDATE public.books SET companion_slug = 'funny-story-ru'                 WHERE slug = 'funny-story';
UPDATE public.books SET companion_slug = 'funny-story'                    WHERE slug = 'funny-story-ru';
UPDATE public.books SET companion_slug = 'ugly-love-ru'                   WHERE slug = 'ugly-love';
UPDATE public.books SET companion_slug = 'ugly-love'                      WHERE slug = 'ugly-love-ru';
UPDATE public.books SET companion_slug = 'november-9-ru'                  WHERE slug = 'november-9';
UPDATE public.books SET companion_slug = 'november-9'                     WHERE slug = 'november-9-ru';
UPDATE public.books SET companion_slug = 'power-of-now-ru'                WHERE slug = 'power-of-now';
UPDATE public.books SET companion_slug = 'power-of-now'                   WHERE slug = 'power-of-now-ru';
UPDATE public.books SET companion_slug = 'mindset-ru'                     WHERE slug = 'mindset';
UPDATE public.books SET companion_slug = 'mindset'                        WHERE slug = 'mindset-ru';
UPDATE public.books SET companion_slug = 'monk-who-sold-ferrari-ru'       WHERE slug = 'monk-who-sold-ferrari';
UPDATE public.books SET companion_slug = 'monk-who-sold-ferrari'          WHERE slug = 'monk-who-sold-ferrari-ru';
UPDATE public.books SET companion_slug = 'psychology-of-money-ru'         WHERE slug = 'psychology-of-money';
UPDATE public.books SET companion_slug = 'psychology-of-money'            WHERE slug = 'psychology-of-money-ru';
UPDATE public.books SET companion_slug = 'ikigai-ru'                      WHERE slug = 'ikigai';
UPDATE public.books SET companion_slug = 'ikigai'                         WHERE slug = 'ikigai-ru';
UPDATE public.books SET companion_slug = 'greenlights-ru'                 WHERE slug = 'greenlights';
UPDATE public.books SET companion_slug = 'greenlights'                    WHERE slug = 'greenlights-ru';
UPDATE public.books SET companion_slug = 'principles-ru'                  WHERE slug = 'principles';
UPDATE public.books SET companion_slug = 'principles'                     WHERE slug = 'principles-ru';
UPDATE public.books SET companion_slug = 'start-with-why-ru'              WHERE slug = 'start-with-why';
UPDATE public.books SET companion_slug = 'start-with-why'                 WHERE slug = 'start-with-why-ru';
UPDATE public.books SET companion_slug = 'rich-dad-poor-dad-ru'           WHERE slug = 'rich-dad-poor-dad';
UPDATE public.books SET companion_slug = 'rich-dad-poor-dad'              WHERE slug = 'rich-dad-poor-dad-ru';
UPDATE public.books SET companion_slug = 'thinking-fast-and-slow-ru'      WHERE slug = 'thinking-fast-and-slow';
UPDATE public.books SET companion_slug = 'thinking-fast-and-slow'         WHERE slug = 'thinking-fast-and-slow-ru';
UPDATE public.books SET companion_slug = 'lean-startup-ru'                WHERE slug = 'lean-startup';
UPDATE public.books SET companion_slug = 'lean-startup'                   WHERE slug = 'lean-startup-ru';
UPDATE public.books SET companion_slug = 'influence-ru'                   WHERE slug = 'influence';
UPDATE public.books SET companion_slug = 'influence'                      WHERE slug = 'influence-ru';
UPDATE public.books SET companion_slug = 'seven-brief-lessons-ru'         WHERE slug = 'seven-brief-lessons';
UPDATE public.books SET companion_slug = 'seven-brief-lessons'            WHERE slug = 'seven-brief-lessons-ru';
UPDATE public.books SET companion_slug = 'surely-youre-joking-ru'         WHERE slug = 'surely-youre-joking';
UPDATE public.books SET companion_slug = 'surely-youre-joking'            WHERE slug = 'surely-youre-joking-ru';
UPDATE public.books SET companion_slug = 'brief-history-of-time-ru'       WHERE slug = 'brief-history-of-time';
UPDATE public.books SET companion_slug = 'brief-history-of-time'          WHERE slug = 'brief-history-of-time-ru';
UPDATE public.books SET companion_slug = 'pale-blue-dot-ru'               WHERE slug = 'pale-blue-dot';
UPDATE public.books SET companion_slug = 'pale-blue-dot'                  WHERE slug = 'pale-blue-dot-ru';
UPDATE public.books SET companion_slug = 'cosmos-ru'                      WHERE slug = 'cosmos';
UPDATE public.books SET companion_slug = 'cosmos'                         WHERE slug = 'cosmos-ru';
UPDATE public.books SET companion_slug = 'outliers-ru'                    WHERE slug = 'outliers';
UPDATE public.books SET companion_slug = 'outliers'                       WHERE slug = 'outliers-ru';
UPDATE public.books SET companion_slug = 'elegant-universe-ru'            WHERE slug = 'elegant-universe';
UPDATE public.books SET companion_slug = 'elegant-universe'               WHERE slug = 'elegant-universe-ru';
