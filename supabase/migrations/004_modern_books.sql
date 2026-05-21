-- ══════════════════════════════════════════════════════════════
--  Folio — modern books (2015–2026), texts to be added later
-- ══════════════════════════════════════════════════════════════

-- ── Authors ───────────────────────────────────────────────────
INSERT INTO public.authors (name, name_ru, born_year, nationality) VALUES
  ('Delia Owens',           'Делия Оуэнс',            1949, 'American'),
  ('Matt Haig',             'Мэтт Хейг',              1975, 'British'),
  ('Kazuo Ishiguro',        'Кадзуо Исигуро',         1954, 'British'),
  ('Sally Rooney',          'Салли Руни',             1991, 'Irish'),
  ('Gabrielle Zevin',       'Габриэль Зевин',         1977, 'American'),
  ('Min Jin Lee',           'Мин Джин Ли',            1968, 'American'),
  ('Hanya Yanagihara',      'Ханья Янагихара',        1974, 'American'),
  ('Han Kang',              'Хан Ган',                1970, 'South Korean'),
  ('Maggie O''Farrell',     'Мэгги О''Фаррелл',       1972, 'British'),
  ('George Saunders',       'Джордж Сондерс',         1958, 'American'),
  ('Colleen Hoover',        'Коллин Гувер',           1979, 'American'),
  ('Sally Thorne',          'Салли Торн',             1982, 'Australian'),
  ('Emily Henry',           'Эмили Генри',            1990, 'American'),
  ('Taylor Jenkins Reid',   'Тейлор Дженкинс Рид',   1983, 'American'),
  ('Jordan B. Peterson',    'Джордан Питерсон',       1962, 'Canadian'),
  ('Ichiro Kishimi',        'Ичиро Кишими',           1956, 'Japanese'),
  ('Adam Grant',            'Адам Грант',             1981, 'American'),
  ('Oliver Burkeman',       'Оливер Буркеман',        1975, 'British'),
  ('James Clear',           'Джеймс Клир',            1986, 'American'),
  ('David Goggins',         'Дэвид Гоггинс',         1975, 'American'),
  ('Mark Manson',           'Марк Мэнсон',            1984, 'American'),
  ('Cal Newport',           'Кэл Ньюпорт',            1982, 'American'),
  ('Robin Sharma',          'Робин Шарма',            1964, 'Canadian'),
  ('Peter Thiel',           'Питер Тиль',             1967, 'American'),
  ('Phil Knight',           'Фил Найт',               1938, 'American'),
  ('Chris Voss',            'Крис Восс',              1957, 'American'),
  ('Walter Isaacson',       'Уолтер Айзексон',        1952, 'American'),
  ('Yuval Noah Harari',     'Юваль Ной Харари',       1976, 'Israeli'),
  ('Andy Weir',             'Энди Уир',               1972, 'American'),
  ('Neil deGrasse Tyson',   'Нил Тайсон',             1958, 'American'),
  ('Siddhartha Mukherjee',  'Сиддхартха Мукерджи',   1970, 'American')
ON CONFLICT DO NOTHING;

-- ── Художественная литература ─────────────────────────────────
INSERT INTO public.books (slug, title, title_ru, author_id, category_slug, language, year_published, description, cover_url, is_featured, is_public) VALUES
(
  'where-the-crawdads-sing',
  'Where the Crawdads Sing',
  'Там, где раки поют',
  (SELECT id FROM public.authors WHERE name = 'Delia Owens'),
  'russian-classics', 'en', 2018,
  'История Кии Кларк — «болотной девчонки», которая выросла одна в дикой природе Северной Каролины. Когда местного красавца находят мёртвым, подозрение падает на неё.',
  'https://covers.openlibrary.org/b/isbn/9780735224292-L.jpg',
  true, true
),
(
  'midnight-library',
  'The Midnight Library',
  'Полночная библиотека',
  (SELECT id FROM public.authors WHERE name = 'Matt Haig'),
  'russian-classics', 'en', 2020,
  'Между жизнью и смертью существует библиотека. Её полки уходят в бесконечность. Каждая книга — шанс прожить другую жизнь.',
  'https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg',
  true, true
),
(
  'klara-and-the-sun',
  'Klara and the Sun',
  'Клара и Солнце',
  (SELECT id FROM public.authors WHERE name = 'Kazuo Ishiguro'),
  'russian-classics', 'en', 2021,
  'Клара — искусственный друг (AF) с солнечным питанием, которая наблюдает за миром из витрины магазина в ожидании, что её выберут.',
  'https://covers.openlibrary.org/b/isbn/9780593318171-L.jpg',
  false, true
),
(
  'normal-people',
  'Normal People',
  'Нормальные люди',
  (SELECT id FROM public.authors WHERE name = 'Sally Rooney'),
  'russian-classics', 'en', 2018,
  'История двух молодых людей из Ирландии — Коннела и Марианны — чьи отношения развиваются с выпускного класса до университета.',
  'https://covers.openlibrary.org/b/isbn/9781984822185-L.jpg',
  false, true
),
(
  'tomorrow-and-tomorrow',
  'Tomorrow, and Tomorrow, and Tomorrow',
  'Завтра, и завтра, и завтра',
  (SELECT id FROM public.authors WHERE name = 'Gabrielle Zevin'),
  'russian-classics', 'en', 2022,
  'История двух друзей-разработчиков видеоигр, охватывающая три десятилетия любви, творчества и предательства.',
  'https://covers.openlibrary.org/b/isbn/9780593321201-L.jpg',
  false, true
);

-- ── Зарубежная классика (современная мировая литература) ──────
INSERT INTO public.books (slug, title, title_ru, author_id, category_slug, language, year_published, description, cover_url, is_featured, is_public) VALUES
(
  'pachinko',
  'Pachinko',
  'Пачинко',
  (SELECT id FROM public.authors WHERE name = 'Min Jin Lee'),
  'world-classics', 'en', 2017,
  'Сага о четырёх поколениях корейской семьи в Японии — история любви, жертвенности, амбиций и дискриминации.',
  'https://covers.openlibrary.org/b/isbn/9781455563920-L.jpg',
  true, true
),
(
  'a-little-life',
  'A Little Life',
  'Маленькая жизнь',
  (SELECT id FROM public.authors WHERE name = 'Hanya Yanagihara'),
  'world-classics', 'en', 2015,
  'Четыре друга переезжают в Нью-Йорк после колледжа. В центре — Джуд Сент-Фрэнсис, чья тёмная история постепенно раскрывается.',
  'https://covers.openlibrary.org/b/isbn/9780804172707-L.jpg',
  false, true
),
(
  'the-vegetarian',
  'The Vegetarian',
  'Вегетарианка',
  (SELECT id FROM public.authors WHERE name = 'Han Kang'),
  'world-classics', 'en', 2015,
  'Обычная женщина однажды решает перестать есть мясо. Это простое решение разрушает всю её жизнь. Нобелевская премия по литературе 2024.',
  'https://covers.openlibrary.org/b/isbn/9781101906118-L.jpg',
  true, true
),
(
  'hamnet',
  'Hamnet',
  'Гамнет',
  (SELECT id FROM public.authors WHERE name = 'Maggie O''Farrell'),
  'world-classics', 'en', 2020,
  'История сына Шекспира — мальчика Гамнета, умершего в 11 лет, и его матери Агнес. Букеровская премия 2020.',
  'https://covers.openlibrary.org/b/isbn/9780525657750-L.jpg',
  false, true
),
(
  'lincoln-in-the-bardo',
  'Lincoln in the Bardo',
  'Линкольн в бардо',
  (SELECT id FROM public.authors WHERE name = 'George Saunders'),
  'world-classics', 'en', 2017,
  'Президент Линкольн посещает могилу своего сына Вилли. Духи на кладбище наблюдают за ним. Букеровская премия 2017.',
  'https://covers.openlibrary.org/b/isbn/9780812995343-L.jpg',
  false, true
);

-- ── Романтика ─────────────────────────────────────────────────
INSERT INTO public.books (slug, title, title_ru, author_id, category_slug, language, year_published, description, cover_url, is_featured, is_public) VALUES
(
  'it-ends-with-us',
  'It Ends with Us',
  'Это заканчивается с нами',
  (SELECT id FROM public.authors WHERE name = 'Colleen Hoover'),
  'romance', 'en', 2016,
  'Лили всегда думала, что никогда не окажется в ситуации своей матери. Но жизнь редко проходит по плану. Один из самых продаваемых романов 2022 года.',
  'https://covers.openlibrary.org/b/isbn/9781501110368-L.jpg',
  true, true
),
(
  'the-hating-game',
  'The Hating Game',
  'Игра в ненависть',
  (SELECT id FROM public.authors WHERE name = 'Sally Thorne'),
  'romance', 'en', 2016,
  'Люси и Джошуа ненавидят друг друга. Они делят офис, помощника и должность. Но соперничество может обернуться кое-чем большим.',
  'https://covers.openlibrary.org/b/isbn/9781455599776-L.jpg',
  false, true
),
(
  'beach-read',
  'Beach Read',
  'Пляжное чтение',
  (SELECT id FROM public.authors WHERE name = 'Emily Henry'),
  'romance', 'en', 2020,
  'Два писателя — романтик и циник — заключают пари: каждый пишет в жанре другого. Но настоящие чувства не по сценарию.',
  'https://covers.openlibrary.org/b/isbn/9781250247100-L.jpg',
  false, true
),
(
  'seven-husbands-of-evelyn-hugo',
  'The Seven Husbands of Evelyn Hugo',
  'Семь мужей Эвелин Хьюго',
  (SELECT id FROM public.authors WHERE name = 'Taylor Jenkins Reid'),
  'romance', 'en', 2017,
  'Голливудская легенда Эвелин Хьюго решает рассказать правду о своей жизни неизвестному журналисту. История любви, амбиций и тайн.',
  'https://covers.openlibrary.org/b/isbn/9781501161933-L.jpg',
  true, true
),
(
  'people-we-meet-on-vacation',
  'People We Meet on Vacation',
  'Люди, которых мы встречаем в отпуске',
  (SELECT id FROM public.authors WHERE name = 'Emily Henry'),
  'romance', 'en', 2021,
  'Алекс и Попpy — лучшие друзья, которые два года не разговаривают. Одна поездка должна всё исправить.',
  'https://covers.openlibrary.org/b/isbn/9781250776754-L.jpg',
  false, true
);

-- ── Философия и характер ──────────────────────────────────────
INSERT INTO public.books (slug, title, title_ru, author_id, category_slug, language, year_published, description, cover_url, is_featured, is_public) VALUES
(
  '12-rules-for-life',
  '12 Rules for Life',
  '12 правил жизни',
  (SELECT id FROM public.authors WHERE name = 'Jordan B. Peterson'),
  'philosophy', 'en', 2018,
  'Антихаос для современного человека. Канадский психолог Джордан Питерсон предлагает 12 принципов для осмысленной жизни.',
  'https://covers.openlibrary.org/b/isbn/9780345816023-L.jpg',
  true, true
),
(
  'courage-to-be-disliked',
  'The Courage to Be Disliked',
  'Смелость быть нелюбимым',
  (SELECT id FROM public.authors WHERE name = 'Ichiro Kishimi'),
  'philosophy', 'en', 2018,
  'Философский диалог о психологии Адлера: прошлое не определяет будущее, и мы сами выбираем свою жизнь.',
  'https://covers.openlibrary.org/b/isbn/9781501197277-L.jpg',
  true, true
),
(
  'think-again',
  'Think Again',
  'Думай снова',
  (SELECT id FROM public.authors WHERE name = 'Adam Grant'),
  'philosophy', 'en', 2021,
  'Адам Грант о силе переосмысления: почему нужно уметь менять своё мнение и как это делать правильно.',
  'https://covers.openlibrary.org/b/isbn/9781984878106-L.jpg',
  false, true
),
(
  'four-thousand-weeks',
  'Four Thousand Weeks',
  'Четыре тысячи недель',
  (SELECT id FROM public.authors WHERE name = 'Oliver Burkeman'),
  'philosophy', 'en', 2021,
  'Средняя жизнь человека — около 4000 недель. Философия тайм-менеджмента для конечного существа.',
  'https://covers.openlibrary.org/b/isbn/9780374159122-L.jpg',
  false, true
);

-- ── Саморазвитие ──────────────────────────────────────────────
INSERT INTO public.books (slug, title, title_ru, author_id, category_slug, language, year_published, description, cover_url, is_featured, is_public) VALUES
(
  'atomic-habits',
  'Atomic Habits',
  'Атомные привычки',
  (SELECT id FROM public.authors WHERE name = 'James Clear'),
  'self-development', 'en', 2018,
  'Простая и проверенная система для формирования хороших привычек и избавления от плохих. Бестселлер №1 в мире.',
  'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
  true, true
),
(
  'cant-hurt-me',
  'Can''t Hurt Me',
  'Не могу остановиться',
  (SELECT id FROM public.authors WHERE name = 'David Goggins'),
  'self-development', 'en', 2018,
  'Дэвид Гоггинс — от жертвы насилия до морского котика и самого выносливого человека планеты. История о силе воли.',
  'https://covers.openlibrary.org/b/isbn/9781544512273-L.jpg',
  true, true
),
(
  'subtle-art',
  'The Subtle Art of Not Giving a F*ck',
  'Тонкое искусство пофигизма',
  (SELECT id FROM public.authors WHERE name = 'Mark Manson'),
  'self-development', 'en', 2016,
  'Нестандартный взгляд на то, как прожить хорошую жизнь. Перестань гнаться за позитивом — сосредоточься на важном.',
  'https://covers.openlibrary.org/b/isbn/9780062457714-L.jpg',
  true, true
),
(
  'deep-work',
  'Deep Work',
  'В работу с головой',
  (SELECT id FROM public.authors WHERE name = 'Cal Newport'),
  'self-development', 'en', 2016,
  'Правила успешной работы в мире постоянных отвлечений. Глубокая концентрация как суперспособность XXI века.',
  'https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg',
  false, true
),
(
  'the-5am-club',
  'The 5 AM Club',
  'Клуб 5 утра',
  (SELECT id FROM public.authors WHERE name = 'Robin Sharma'),
  'self-development', 'en', 2018,
  'Освой утренние часы — и изменишь жизнь. Робин Шарма о системе победителей, которые встают в 5 утра.',
  'https://covers.openlibrary.org/b/isbn/9781443456623-L.jpg',
  false, true
);

-- ── Бизнес и успех ────────────────────────────────────────────
INSERT INTO public.books (slug, title, title_ru, author_id, category_slug, language, year_published, description, cover_url, is_featured, is_public) VALUES
(
  'zero-to-one',
  'Zero to One',
  'От нуля к единице',
  (SELECT id FROM public.authors WHERE name = 'Peter Thiel'),
  'business-success', 'en', 2014,
  'Питер Тиль о том, как строить компании, которые создают будущее. Настольная книга каждого стартапера.',
  'https://covers.openlibrary.org/b/isbn/9780804139021-L.jpg',
  true, true
),
(
  'shoe-dog',
  'Shoe Dog',
  'Продавец обуви',
  (SELECT id FROM public.authors WHERE name = 'Phil Knight'),
  'business-success', 'en', 2016,
  'Мемуары основателя Nike. Честная история о том, как простая идея превратилась в глобальный бренд.',
  'https://covers.openlibrary.org/b/isbn/9781501135910-L.jpg',
  true, true
),
(
  'never-split-the-difference',
  'Never Split the Difference',
  'Никогда не идите на компромисс',
  (SELECT id FROM public.authors WHERE name = 'Chris Voss'),
  'business-success', 'en', 2016,
  'Бывший переговорщик ФБР раскрывает техники переговоров, которые работают в жизни и бизнесе.',
  'https://covers.openlibrary.org/b/isbn/9780062407801-L.jpg',
  false, true
),
(
  'elon-musk-isaacson',
  'Elon Musk',
  'Илон Маск',
  (SELECT id FROM public.authors WHERE name = 'Walter Isaacson'),
  'business-success', 'en', 2023,
  'Биография самого противоречивого предпринимателя нашего времени. Уолтер Айзексон провёл два года рядом с Маском.',
  'https://covers.openlibrary.org/b/isbn/9781982181284-L.jpg',
  true, true
);

-- ── Космос и наука ────────────────────────────────────────────
INSERT INTO public.books (slug, title, title_ru, author_id, category_slug, language, year_published, description, cover_url, is_featured, is_public) VALUES
(
  'sapiens',
  'Sapiens: A Brief History of Humankind',
  'Sapiens: Краткая история человечества',
  (SELECT id FROM public.authors WHERE name = 'Yuval Noah Harari'),
  'science', 'en', 2015,
  'Как Homo sapiens стал хозяином планеты? Харари прослеживает путь человечества от каменного века до XXI века.',
  'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',
  true, true
),
(
  'homo-deus',
  'Homo Deus: A Brief History of Tomorrow',
  'Homo Deus: Краткая история завтрашнего дня',
  (SELECT id FROM public.authors WHERE name = 'Yuval Noah Harari'),
  'science', 'en', 2015,
  'Что будет с человечеством дальше? Харари исследует будущее — бессмертие, искусственный интеллект и конец человека.',
  'https://covers.openlibrary.org/b/isbn/9780062464316-L.jpg',
  false, true
),
(
  '21-lessons',
  '21 Lessons for the 21st Century',
  '21 урок для XXI века',
  (SELECT id FROM public.authors WHERE name = 'Yuval Noah Harari'),
  'science', 'en', 2018,
  'Что происходит прямо сейчас? Харари отвечает на самые острые вопросы современности.',
  'https://covers.openlibrary.org/b/isbn/9780525512172-L.jpg',
  false, true
),
(
  'the-martian',
  'The Martian',
  'Марсианин',
  (SELECT id FROM public.authors WHERE name = 'Andy Weir'),
  'science', 'en', 2015,
  'Астронавт Марк Уотни остался один на Марсе. У него нет связи с Землёй, еды на год и никаких шансов. Но есть наука.',
  'https://covers.openlibrary.org/b/isbn/9780553418026-L.jpg',
  true, true
),
(
  'astrophysics-for-people-in-a-hurry',
  'Astrophysics for People in a Hurry',
  'Астрофизика с хорошим настроением',
  (SELECT id FROM public.authors WHERE name = 'Neil deGrasse Tyson'),
  'science', 'en', 2017,
  'Нил Тайсон объясняет самые сложные концепции Вселенной простым языком — за время утренней поездки.',
  'https://covers.openlibrary.org/b/isbn/9780393609394-L.jpg',
  false, true
),
(
  'the-gene',
  'The Gene: An Intimate History',
  'Ген: Очень личная история',
  (SELECT id FROM public.authors WHERE name = 'Siddhartha Mukherjee'),
  'science', 'en', 2016,
  'Исчерпывающая история гена — от Менделя до CRISPR. Пулитцеровский лауреат о революции в биологии.',
  'https://covers.openlibrary.org/b/isbn/9781476733524-L.jpg',
  false, true
);
