import "dotenv/config";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createClient } = require("@supabase/supabase-js");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase: any = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

// ── Authors ──────────────────────────────────────────────────────────────────
const AUTHORS = [
  { name: "Leo Tolstoy",                name_ru: "Лев Толстой",             born_year: 1828, died_year: 1910, nationality: "Russian" },
  { name: "Fyodor Dostoevsky",          name_ru: "Фёдор Достоевский",       born_year: 1821, died_year: 1881, nationality: "Russian" },
  { name: "Anton Chekhov",              name_ru: "Антон Чехов",             born_year: 1860, died_year: 1904, nationality: "Russian" },
  { name: "Nikolai Gogol",              name_ru: "Николай Гоголь",          born_year: 1809, died_year: 1852, nationality: "Russian" },
  { name: "Alexander Pushkin",          name_ru: "Александр Пушкин",        born_year: 1799, died_year: 1837, nationality: "Russian" },
  { name: "Ivan Turgenev",              name_ru: "Иван Тургенев",           born_year: 1818, died_year: 1883, nationality: "Russian" },
  { name: "Ivan Goncharov",             name_ru: "Иван Гончаров",           born_year: 1812, died_year: 1891, nationality: "Russian" },
  { name: "Mikhail Lermontov",          name_ru: "Михаил Лермонтов",        born_year: 1814, died_year: 1841, nationality: "Russian" },
  { name: "Nikolai Leskov",             name_ru: "Николай Лесков",          born_year: 1831, died_year: 1895, nationality: "Russian" },
  { name: "Alexander Kuprin",           name_ru: "Александр Куприн",        born_year: 1870, died_year: 1938, nationality: "Russian" },
  { name: "Maxim Gorky",                name_ru: "Максим Горький",          born_year: 1868, died_year: 1936, nationality: "Russian" },
  { name: "Jane Austen",                name_ru: "Джейн Остин",             born_year: 1775, died_year: 1817, nationality: "British" },
  { name: "Charles Dickens",            name_ru: "Чарльз Диккенс",          born_year: 1812, died_year: 1870, nationality: "British" },
  { name: "Victor Hugo",                name_ru: "Виктор Гюго",             born_year: 1802, died_year: 1885, nationality: "French" },
  { name: "Arthur Conan Doyle",         name_ru: "Артур Конан Дойл",        born_year: 1859, died_year: 1930, nationality: "British" },
  { name: "Alexandre Dumas",            name_ru: "Александр Дюма",          born_year: 1802, died_year: 1870, nationality: "French" },
  { name: "Jules Verne",                name_ru: "Жюль Верн",               born_year: 1828, died_year: 1905, nationality: "French" },
  { name: "Charlotte Bronte",           name_ru: "Шарлотта Бронте",         born_year: 1816, died_year: 1855, nationality: "British" },
  { name: "Emily Bronte",               name_ru: "Эмили Бронте",            born_year: 1818, died_year: 1848, nationality: "British" },
  { name: "Anne Bronte",                name_ru: "Энн Бронте",              born_year: 1820, died_year: 1849, nationality: "British" },
  { name: "Thomas Hardy",               name_ru: "Томас Харди",             born_year: 1840, died_year: 1928, nationality: "British" },
  { name: "George Eliot",               name_ru: "Джордж Элиот",            born_year: 1819, died_year: 1880, nationality: "British" },
  { name: "Oscar Wilde",                name_ru: "Оскар Уайлд",             born_year: 1854, died_year: 1900, nationality: "Irish" },
  { name: "Robert Louis Stevenson",     name_ru: "Роберт Льюис Стивенсон",  born_year: 1850, died_year: 1894, nationality: "Scottish" },
  { name: "Wilkie Collins",             name_ru: "Уилки Коллинз",           born_year: 1824, died_year: 1889, nationality: "British" },
  { name: "William Makepeace Thackeray",name_ru: "Уильям Теккерей",         born_year: 1811, died_year: 1863, nationality: "British" },
  { name: "Daniel Defoe",               name_ru: "Даниэль Дефо",            born_year: 1660, died_year: 1731, nationality: "British" },
  { name: "Jonathan Swift",             name_ru: "Джонатан Свифт",          born_year: 1667, died_year: 1745, nationality: "Irish" },
  { name: "Mark Twain",                 name_ru: "Марк Твен",               born_year: 1835, died_year: 1910, nationality: "American" },
  { name: "Jack London",                name_ru: "Джек Лондон",             born_year: 1876, died_year: 1916, nationality: "American" },
  { name: "Edgar Allan Poe",            name_ru: "Эдгар Аллан По",          born_year: 1809, died_year: 1849, nationality: "American" },
  { name: "Nathaniel Hawthorne",        name_ru: "Натаниэль Готорн",        born_year: 1804, died_year: 1864, nationality: "American" },
  { name: "Herman Melville",            name_ru: "Герман Мелвилл",          born_year: 1819, died_year: 1891, nationality: "American" },
  { name: "Miguel de Cervantes",        name_ru: "Мигель де Сервантес",     born_year: 1547, died_year: 1616, nationality: "Spanish" },
  { name: "Johann Wolfgang von Goethe", name_ru: "Иоганн Вольфганг фон Гёте", born_year: 1749, died_year: 1832, nationality: "German" },
  { name: "Honore de Balzac",           name_ru: "Оноре де Бальзак",        born_year: 1799, died_year: 1850, nationality: "French" },
  { name: "Gustave Flaubert",           name_ru: "Гюстав Флобер",           born_year: 1821, died_year: 1880, nationality: "French" },
  { name: "Guy de Maupassant",          name_ru: "Ги де Мопассан",          born_year: 1850, died_year: 1893, nationality: "French" },
  { name: "Henryk Sienkiewicz",         name_ru: "Генрик Сенкевич",         born_year: 1846, died_year: 1916, nationality: "Polish" },
  { name: "Marcus Aurelius",            name_ru: "Марк Аврелий",            born_year: 121,  died_year: 180,  nationality: "Roman" },
  { name: "Lucius Annaeus Seneca",      name_ru: "Сенека",                  born_year: -4,   died_year: 65,   nationality: "Roman" },
  { name: "Epictetus",                  name_ru: "Эпиктет",                 born_year: 50,   died_year: 135,  nationality: "Greek" },
  { name: "Plato",                      name_ru: "Платон",                  born_year: -428, died_year: -348, nationality: "Greek" },
  { name: "Aristotle",                  name_ru: "Аристотель",              born_year: -384, died_year: -322, nationality: "Greek" },
  { name: "Michel de Montaigne",        name_ru: "Монтень",                 born_year: 1533, died_year: 1592, nationality: "French" },
  { name: "Voltaire",                   name_ru: "Вольтер",                 born_year: 1694, died_year: 1778, nationality: "French" },
  { name: "Friedrich Nietzsche",        name_ru: "Фридрих Ницше",           born_year: 1844, died_year: 1900, nationality: "German" },
  { name: "Arthur Schopenhauer",        name_ru: "Артур Шопенгауэр",        born_year: 1788, died_year: 1860, nationality: "German" },
  { name: "Samuel Smiles",              name_ru: "Самюэль Смайлс",          born_year: 1812, died_year: 1904, nationality: "British" },
  { name: "Benjamin Franklin",          name_ru: "Бенджамин Франклин",      born_year: 1706, died_year: 1790, nationality: "American" },
  { name: "Wallace D. Wattles",         name_ru: "Уоллес Уоттлз",           born_year: 1860, died_year: 1911, nationality: "American" },
  { name: "Orison Swett Marden",        name_ru: "Орисон Суэтт Марден",     born_year: 1850, died_year: 1924, nationality: "American" },
  { name: "Charles Darwin",             name_ru: "Чарльз Дарвин",           born_year: 1809, died_year: 1882, nationality: "British" },
  { name: "Camille Flammarion",         name_ru: "Камиль Фламмарион",       born_year: 1842, died_year: 1925, nationality: "French" },
  { name: "Babur",                      name_ru: "Бабур",                   born_year: 1483, died_year: 1530, nationality: "Uzbek" },
  { name: "Alisher Navoi",              name_ru: "Алишер Навои",            born_year: 1441, died_year: 1501, nationality: "Uzbek" },
  { name: "Sun Tzu",                    name_ru: "Сунь-цзы",                born_year: -544, died_year: -496, nationality: "Chinese" },
  { name: "Dante Alighieri",            name_ru: "Данте Алигьери",          born_year: 1265, died_year: 1321, nationality: "Italian" },
  { name: "Niccolo Machiavelli",        name_ru: "Никколо Макиавелли",      born_year: 1469, died_year: 1527, nationality: "Italian" },
  { name: "William Shakespeare",        name_ru: "Уильям Шекспир",          born_year: 1564, died_year: 1616, nationality: "British" },
];

type Lang = "ru" | "en" | "uz" | "fr" | "de" | "other";

type SeedBook = {
  slug: string;
  title: string;
  title_ru: string;
  author: string;
  category_slug: string;
  language: Lang;
  year_published: number;
  description: string;
  cover_url: string | null;
  gutenberg_id?: number;
  is_featured: boolean;
};

const W = (f: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${f}?width=700`;

const BOOKS: SeedBook[] = [
  // ════════════════════════════════════════════════════════════
  // РУССКАЯ КЛАССИКА
  // ════════════════════════════════════════════════════════════
  { slug:"anna-karenina", title:"Anna Karenina", title_ru:"Анна Каренина", author:"Leo Tolstoy", category_slug:"russian-classics", language:"ru", year_published:1878, description:"Роман о трагической любви замужней аристократки к офицеру Вронскому и счастливой семье Левина и Кити.", cover_url:W("AnnaKareninaTitle.jpg"), gutenberg_id:1399, is_featured:true },
  { slug:"voyna-i-mir", title:"War and Peace", title_ru:"Война и мир", author:"Leo Tolstoy", category_slug:"russian-classics", language:"ru", year_published:1869, description:"Эпопея о судьбах русского дворянства в эпоху наполеоновских войн — главная книга русской литературы.", cover_url:W("Tolstoy_-_War_and_Peace,_first_edition,_1869.jpg"), gutenberg_id:2600, is_featured:true },
  { slug:"smert-ivana-ilyicha", title:"The Death of Ivan Ilyich", title_ru:"Смерть Ивана Ильича", author:"Leo Tolstoy", category_slug:"russian-classics", language:"ru", year_published:1886, description:"Чиновник перед лицом смерти осознаёт, что прожил неподлинную жизнь. Самая пронзительная повесть Толстого.", cover_url:null, gutenberg_id:600, is_featured:false },
  { slug:"voskreseniye", title:"Resurrection", title_ru:"Воскресение", author:"Leo Tolstoy", category_slug:"russian-classics", language:"ru", year_published:1899, description:"Князь Нехлюдов встречает на суде женщину, которую когда-то соблазнил и бросил. Нравственный перелом и путь к искуплению.", cover_url:null, gutenberg_id:1938, is_featured:false },
  { slug:"kreutzer-sonata", title:"The Kreutzer Sonata", title_ru:"Крейцерова соната", author:"Leo Tolstoy", category_slug:"russian-classics", language:"ru", year_published:1889, description:"Мужчина в поезде рассказывает об убийстве жены — исповедь о ревности, браке и плотской любви.", cover_url:null, gutenberg_id:689, is_featured:false },
  { slug:"detstvo-tolstoy", title:"Childhood", title_ru:"Детство", author:"Leo Tolstoy", category_slug:"russian-classics", language:"ru", year_published:1852, description:"Первая часть автобиографической трилогии Толстого — нежная, точная картина детских переживаний.", cover_url:null, gutenberg_id:2450, is_featured:false },
  { slug:"kazaki", title:"The Cossacks", title_ru:"Казаки", author:"Leo Tolstoy", category_slug:"russian-classics", language:"ru", year_published:1863, description:"Молодой московский аристократ едет на Кавказ и открывает для себя вольную жизнь казачьей станицы.", cover_url:null, gutenberg_id:1898, is_featured:false },

  { slug:"prestuplenie-i-nakazanie", title:"Crime and Punishment", title_ru:"Преступление и наказание", author:"Fyodor Dostoevsky", category_slug:"russian-classics", language:"ru", year_published:1866, description:"Студент Раскольников убивает старуху-процентщицу, убедив себя в своей «необыкновенности», — и оказывается во власти невыносимых душевных мук.", cover_url:W("Cover_of_the_first_edition_of_Crime_and_Punishment.jpg"), gutenberg_id:2554, is_featured:true },
  { slug:"idiot", title:"The Idiot", title_ru:"Идиот", author:"Fyodor Dostoevsky", category_slug:"russian-classics", language:"ru", year_published:1869, description:"Князь Мышкин — человек с чистым сердцем — попадает в мир страстей, денег и интриг петербургского общества.", cover_url:null, gutenberg_id:2638, is_featured:true },
  { slug:"bratya-karamazovy", title:"The Brothers Karamazov", title_ru:"Братья Карамазовы", author:"Fyodor Dostoevsky", category_slug:"russian-classics", language:"ru", year_published:1880, description:"Последний и главный роман Достоевского: отцеубийство, вера, свобода, три брата с тремя разными душами.", cover_url:W("The_Brothers_Karamazoff.jpg"), gutenberg_id:28054, is_featured:true },
  { slug:"besy", title:"Demons", title_ru:"Бесы", author:"Fyodor Dostoevsky", category_slug:"russian-classics", language:"ru", year_published:1872, description:"Провинциальный город захлёстывает волна нигилизма и политического террора. Роман-предупреждение о революционном насилии.", cover_url:null, gutenberg_id:8117, is_featured:false },
  { slug:"zapiski-iz-podpolya", title:"Notes from Underground", title_ru:"Записки из подполья", author:"Fyodor Dostoevsky", category_slug:"russian-classics", language:"ru", year_published:1864, description:"Исповедь «подпольного человека» — озлобленного, самокопающегося интеллектуала. Первый экзистенциальный роман.", cover_url:null, gutenberg_id:600, is_featured:false },
  { slug:"bednye-lyudi", title:"Poor Folk", title_ru:"Бедные люди", author:"Fyodor Dostoevsky", category_slug:"russian-classics", language:"ru", year_published:1846, description:"Переписка мелкого чиновника и бедной девушки — дебютный роман Достоевского, принёсший ему мгновенную славу.", cover_url:null, gutenberg_id:36034, is_featured:false },
  { slug:"igrok", title:"The Gambler", title_ru:"Игрок", author:"Fyodor Dostoevsky", category_slug:"russian-classics", language:"ru", year_published:1867, description:"Молодой учитель в немецком курортном городке попадает в ловушку рулетки и страсти. Написан за 26 дней.", cover_url:null, gutenberg_id:2302, is_featured:false },
  { slug:"belye-nochi", title:"White Nights", title_ru:"Белые ночи", author:"Fyodor Dostoevsky", category_slug:"russian-classics", language:"ru", year_published:1848, description:"За четыре белые петербургские ночи мечтатель влюбляется в Настеньку — нежная история о любви и одиночестве.", cover_url:null, gutenberg_id:36034, is_featured:false },

  { slug:"vishnyovy-sad", title:"The Cherry Orchard", title_ru:"Вишнёвый сад", author:"Anton Chekhov", category_slug:"russian-classics", language:"ru", year_published:1904, description:"Последняя пьеса Чехова. Дворянская семья теряет имение с вишнёвым садом — метафора уходящей эпохи.", cover_url:null, gutenberg_id:7986, is_featured:false },
  { slug:"tri-sestry", title:"Three Sisters", title_ru:"Три сестры", author:"Anton Chekhov", category_slug:"russian-classics", language:"ru", year_published:1901, description:"Три сестры мечтают о Москве, но жизнь затягивает их в провинции. Чеховская тоска по несостоявшемуся.", cover_url:null, gutenberg_id:7986, is_featured:false },
  { slug:"dyadya-vanya", title:"Uncle Vanya", title_ru:"Дядя Ваня", author:"Anton Chekhov", category_slug:"russian-classics", language:"ru", year_published:1897, description:"Дядя Ваня жертвовал жизнью ради профессора, а тот оказался посредственностью. Драма разбитых иллюзий.", cover_url:null, gutenberg_id:7986, is_featured:false },
  { slug:"chayka", title:"The Seagull", title_ru:"Чайка", author:"Anton Chekhov", category_slug:"russian-classics", language:"ru", year_published:1895, description:"Молодые художники, любовь и творческие амбиции в русской провинции. Революция в театральной драматургии.", cover_url:null, gutenberg_id:7986, is_featured:false },
  { slug:"palata-6", title:"Ward No. 6", title_ru:"Палата № 6", author:"Anton Chekhov", category_slug:"russian-classics", language:"ru", year_published:1892, description:"Доктор психиатрической больницы сам оказывается в палате для умалишённых. Повесть о безумии системы.", cover_url:W("Chekhov_Detvora_cover.jpg"), gutenberg_id:1823, is_featured:false },
  { slug:"dama-s-sobachkoy", title:"The Lady with the Dog", title_ru:"Дама с собачкой", author:"Anton Chekhov", category_slug:"russian-classics", language:"ru", year_published:1899, description:"Случайная встреча в Ялте превращается в настоящую любовь. Идеальный рассказ — совершенство на двенадцати страницах.", cover_url:null, gutenberg_id:1823, is_featured:true },
  { slug:"chekhov-rasskazy", title:"Short Stories", title_ru:"Рассказы", author:"Anton Chekhov", category_slug:"russian-classics", language:"ru", year_published:1886, description:"Лучшие рассказы Чехова: «Хамелеон», «Смерть чиновника», «Толстый и тонкий» — юмор и грусть русской жизни.", cover_url:null, gutenberg_id:1823, is_featured:false },

  { slug:"mertvye-dushi", title:"Dead Souls", title_ru:"Мёртвые души", author:"Nikolai Gogol", category_slug:"russian-classics", language:"ru", year_published:1842, description:"Аферист Чичиков скупает умерших крепостных, чтобы заложить их как живых. Сатира на провинциальную Россию.", cover_url:W("Dead_Souls_(novel)_Nikolai_Gogol_1842_title_page.jpg"), gutenberg_id:1081, is_featured:true },
  { slug:"revizor", title:"The Government Inspector", title_ru:"Ревизор", author:"Nikolai Gogol", category_slug:"russian-classics", language:"ru", year_published:1836, description:"Городничий и чиновники принимают мелкого петербургского чиновника за тайного ревизора. Бессмертная комедия о взятках и трусости.", cover_url:null, gutenberg_id:4717, is_featured:false },
  { slug:"taras-bulba", title:"Taras Bulba", title_ru:"Тарас Бульба", author:"Nikolai Gogol", category_slug:"russian-classics", language:"ru", year_published:1835, description:"Казацкий полковник Тарас Бульба выходит в поход с сыновьями. Эпопея о доблести, предательстве и воинском братстве.", cover_url:null, gutenberg_id:1705, is_featured:false },
  { slug:"shinel", title:"The Overcoat", title_ru:"Шинель", author:"Nikolai Gogol", category_slug:"russian-classics", language:"ru", year_published:1842, description:"Мелкий чиновник Башмачкин мечтает о новой шинели. «Все мы вышли из гоголевской Шинели» — Достоевский.", cover_url:null, gutenberg_id:1081, is_featured:false },
  { slug:"vechera-na-khutore", title:"Evenings on a Farm Near Dikanka", title_ru:"Вечера на хуторе близ Диканьки", author:"Nikolai Gogol", category_slug:"russian-classics", language:"ru", year_published:1831, description:"Украинские народные сказки, чёрт с ведьмами и кузнец Вакула. Первая книга Гоголя — праздничная и мистическая.", cover_url:null, gutenberg_id:1081, is_featured:false },

  { slug:"evgeniy-onegin", title:"Eugene Onegin", title_ru:"Евгений Онегин", author:"Alexander Pushkin", category_slug:"russian-classics", language:"ru", year_published:1833, description:"«Роман в стихах» — история петербургского щёголя Онегина и искренней Татьяны. Энциклопедия русской жизни.", cover_url:W("Eugene_Onegin_first_edition.jpg"), gutenberg_id:27500, is_featured:true },
  { slug:"kapitanskaya-dochka", title:"The Captain's Daughter", title_ru:"Капитанская дочка", author:"Alexander Pushkin", category_slug:"russian-classics", language:"ru", year_published:1836, description:"Молодой офицер и Пугачёвский бунт. Лучшая проза Пушкина — точная, лаконичная, человечная.", cover_url:null, gutenberg_id:36034, is_featured:false },
  { slug:"pikovaya-dama", title:"The Queen of Spades", title_ru:"Пиковая дама", author:"Alexander Pushkin", category_slug:"russian-classics", language:"ru", year_published:1834, description:"Офицер Германн хочет выведать секрет трёх выигрышных карт у старой графини. Роковая петербургская история.", cover_url:null, gutenberg_id:31516, is_featured:false },
  { slug:"boris-godunov", title:"Boris Godunov", title_ru:"Борис Годунов", author:"Alexander Pushkin", category_slug:"russian-classics", language:"ru", year_published:1825, description:"Драматическая хроника о царе Борисе, терзаемом виной за убийство царевича Дмитрия. По Шекспиру и истории.", cover_url:null, gutenberg_id:27500, is_featured:false },

  { slug:"ottsy-i-deti", title:"Fathers and Sons", title_ru:"Отцы и дети", author:"Ivan Turgenev", category_slug:"russian-classics", language:"ru", year_published:1862, description:"Базаров — нигилист и естествоиспытатель — сталкивается со старым дворянским укладом. Конфликт поколений.", cover_url:null, gutenberg_id:30723, is_featured:true },
  { slug:"pervaya-lyubov", title:"First Love", title_ru:"Первая любовь", author:"Ivan Turgenev", category_slug:"russian-classics", language:"ru", year_published:1860, description:"Шестнадцатилетний Владимир влюбляется в соседку Зинаиду, не подозревая о её связи с отцом. Тургеневская нежность.", cover_url:W("Turgenev_First_Love_1884.jpg"), gutenberg_id:2570, is_featured:false },
  { slug:"rudin", title:"Rudin", title_ru:"Рудин", author:"Ivan Turgenev", category_slug:"russian-classics", language:"ru", year_published:1856, description:"Блестящий оратор и мечтатель Рудин покоряет провинциальное общество, но не способен ни на решительный поступок, ни на любовь.", cover_url:null, gutenberg_id:21076, is_featured:false },
  { slug:"dvoryanskoe-gnezdo", title:"Home of the Gentry", title_ru:"Дворянское гнездо", author:"Ivan Turgenev", category_slug:"russian-classics", language:"ru", year_published:1859, description:"Лаврецкий возвращается в Россию и встречает Лизу Калитину. История любви и невозможного счастья.", cover_url:null, gutenberg_id:21076, is_featured:false },
  { slug:"mumu", title:"Mumu", title_ru:"Муму", author:"Ivan Turgenev", category_slug:"russian-classics", language:"ru", year_published:1852, description:"Глухонемой дворник Герасим и его собачка Муму. Одна из самых горьких историй о крепостном праве.", cover_url:null, gutenberg_id:2570, is_featured:false },

  { slug:"oblomov", title:"Oblomov", title_ru:"Обломов", author:"Ivan Goncharov", category_slug:"russian-classics", language:"ru", year_published:1859, description:"Добродушный помещик Обломов не может встать с дивана. Роман о русской лени, мечтательности и невозможности перемен.", cover_url:null, gutenberg_id:23062, is_featured:false },

  { slug:"geroy-nashego-vremeni", title:"A Hero of Our Time", title_ru:"Герой нашего времени", author:"Mikhail Lermontov", category_slug:"russian-classics", language:"ru", year_published:1840, description:"Печорин — «лишний человек» на Кавказе: скучает, соблазняет, дерётся на дуэлях. Первый психологический роман России.", cover_url:null, gutenberg_id:913, is_featured:true },
  { slug:"demon-lermontov", title:"The Demon", title_ru:"Демон", author:"Mikhail Lermontov", category_slug:"russian-classics", language:"ru", year_published:1842, description:"Романтическая поэма: Демон влюбляется в грузинскую красавицу Тамару. Гордость, отчаяние и невозможность любви.", cover_url:null, gutenberg_id:913, is_featured:false },

  { slug:"ocharovanny-strannik", title:"The Enchanted Wanderer", title_ru:"Очарованный странник", author:"Nikolai Leskov", category_slug:"russian-classics", language:"ru", year_published:1873, description:"Иван Флягин прожил несколько жизней: был конюхом, цыганским невольником, солдатом и монахом. Русская Одиссея.", cover_url:null, gutenberg_id:null, is_featured:false },
  { slug:"ledi-makbet-mcenskogo", title:"Lady Macbeth of Mtsensk", title_ru:"Леди Макбет Мценского уезда", author:"Nikolai Leskov", category_slug:"russian-classics", language:"ru", year_published:1865, description:"Катерина Измайлова убивает мужа ради любовника. Страстная, беспощадная повесть о русском характере.", cover_url:null, gutenberg_id:null, is_featured:false },

  { slug:"mat-gorky", title:"Mother", title_ru:"Мать", author:"Maxim Gorky", category_slug:"russian-classics", language:"ru", year_published:1906, description:"Пелагея Власова из рабочей слободы становится революционеркой вслед за арестованным сыном. Манифест раннего соцреализма.", cover_url:null, gutenberg_id:12557, is_featured:false },
  { slug:"na-dne", title:"The Lower Depths", title_ru:"На дне", author:"Maxim Gorky", category_slug:"russian-classics", language:"ru", year_published:1902, description:"Ночлежка в подвале: воры, проститутки, бывшие люди — и странник Лука с утешительной ложью о лучшей жизни.", cover_url:null, gutenberg_id:13836, is_featured:false },

  { slug:"poedinok-kuprin", title:"The Duel", title_ru:"Поединок", author:"Alexander Kuprin", category_slug:"russian-classics", language:"ru", year_published:1905, description:"Подпоручик Ромашов задыхается в тупой армейской жизни и влюбляется в чужую жену. Правда о царской армии.", cover_url:null, gutenberg_id:null, is_featured:false },

  // ════════════════════════════════════════════════════════════
  // ЗАРУБЕЖНАЯ КЛАССИКА
  // ════════════════════════════════════════════════════════════
  { slug:"pride-and-prejudice", title:"Pride and Prejudice", title_ru:"Гордость и предубеждение", author:"Jane Austen", category_slug:"world-classics", language:"en", year_published:1813, description:"Элизабет Беннет и высокомерный мистер Дарси преодолевают взаимные предрассудки, чтобы найти любовь.", cover_url:W("PrideAndPrejudiceTitlePage.jpg"), gutenberg_id:1342, is_featured:true },
  { slug:"sense-and-sensibility", title:"Sense and Sensibility", title_ru:"Разум и чувства", author:"Jane Austen", category_slug:"world-classics", language:"en", year_published:1811, description:"Сёстры Эленор и Марианна Дэшвуд ищут любовь и место в свете — разум против чувства.", cover_url:null, gutenberg_id:161, is_featured:false },
  { slug:"emma", title:"Emma", title_ru:"Эмма", author:"Jane Austen", category_slug:"world-classics", language:"en", year_published:1815, description:"Молодая состоятельная Эмма Вудхаус убеждена, что умеет сводить людей — и постоянно ошибается.", cover_url:null, gutenberg_id:158, is_featured:false },
  { slug:"northanger-abbey", title:"Northanger Abbey", title_ru:"Нортенгерское аббатство", author:"Jane Austen", category_slug:"world-classics", language:"en", year_published:1817, description:"Наивная Кэтрин Морланд попадает в старинное аббатство и воображает готические тайны. Пародия на ужасы.", cover_url:null, gutenberg_id:121, is_featured:false },
  { slug:"persuasion", title:"Persuasion", title_ru:"Доводы рассудка", author:"Jane Austen", category_slug:"world-classics", language:"en", year_published:1817, description:"Энн Эллиот когда-то отказала капитану Уэнтворту. Через восемь лет он возвращается. Последний и самый зрелый роман Остин.", cover_url:null, gutenberg_id:105, is_featured:false },
  { slug:"mansfield-park", title:"Mansfield Park", title_ru:"Мэнсфилд-парк", author:"Jane Austen", category_slug:"world-classics", language:"en", year_published:1814, description:"Фанни Прайс воспитывается в богатой семье дяди. История тихой добродетели в мире тщеславия и распущенности.", cover_url:null, gutenberg_id:141, is_featured:false },

  { slug:"oliver-twist", title:"Oliver Twist", title_ru:"Оливер Твист", author:"Charles Dickens", category_slug:"world-classics", language:"en", year_published:1838, description:"Сирота Оливер бежит из работного дома в Лондон и попадает в шайку воришек Феджина. Диккенс о детской нищете.", cover_url:null, gutenberg_id:730, is_featured:false },
  { slug:"david-copperfield", title:"David Copperfield", title_ru:"Дэвид Копперфилд", author:"Charles Dickens", category_slug:"world-classics", language:"en", year_published:1850, description:"Автобиографический роман Диккенса: от несчастного детства через унижения — к успеху писателя.", cover_url:null, gutenberg_id:766, is_featured:false },
  { slug:"great-expectations", title:"Great Expectations", title_ru:"Большие надежды", author:"Charles Dickens", category_slug:"world-classics", language:"en", year_published:1861, description:"Кузнецкий подмастерье Пип получает деньги от тайного благодетеля и открывает двери высшего общества.", cover_url:W("Great_Expectations_-_serial_cover.jpg"), gutenberg_id:1400, is_featured:true },
  { slug:"a-tale-of-two-cities", title:"A Tale of Two Cities", title_ru:"Повесть о двух городах", author:"Charles Dickens", category_slug:"world-classics", language:"en", year_published:1859, description:"Лондон и Париж эпохи Французской революции. История самопожертвования, любви и надежды.", cover_url:W("A_Tale_of_Two_Cities_-_First_edition_cover_1859.jpg"), gutenberg_id:98, is_featured:false },
  { slug:"a-christmas-carol", title:"A Christmas Carol", title_ru:"Рождественская песнь", author:"Charles Dickens", category_slug:"world-classics", language:"en", year_published:1843, description:"Скряга Скрудж встречает три рождественских духа и учится состраданию. Лучшая рождественская история всех времён.", cover_url:null, gutenberg_id:46, is_featured:false },
  { slug:"bleak-house", title:"Bleak House", title_ru:"Холодный дом", author:"Charles Dickens", category_slug:"world-classics", language:"en", year_published:1853, description:"Многолетнее судебное дело «Джарндис против Джарндиса» поглощает всех. Диккенс против бюрократии и правосудия.", cover_url:null, gutenberg_id:1023, is_featured:false },
  { slug:"pickwick-papers", title:"The Pickwick Papers", title_ru:"Посмертные записки Пиквикского клуба", author:"Charles Dickens", category_slug:"world-classics", language:"en", year_published:1837, description:"Добродушный мистер Пиквик и его друзья путешествуют по Англии. Первый и самый весёлый роман Диккенса.", cover_url:null, gutenberg_id:580, is_featured:false },

  { slug:"les-miserables", title:"Les Misérables", title_ru:"Отверженные", author:"Victor Hugo", category_slug:"world-classics", language:"fr", year_published:1862, description:"Жан Вальжан ищет искупления в революционном Париже. Грандиозная эпопея о справедливости и человечности.", cover_url:W("Les_miserables.jpg"), gutenberg_id:135, is_featured:true },
  { slug:"notre-dame-de-paris", title:"Notre-Dame de Paris", title_ru:"Собор Парижской Богоматери", author:"Victor Hugo", category_slug:"world-classics", language:"fr", year_published:1831, description:"Горбун Квазимодо любит цыганку Эсмеральду — трагедия красоты и уродства на фоне средневекового Парижа.", cover_url:null, gutenberg_id:2610, is_featured:true },
  { slug:"toilers-of-the-sea", title:"Toilers of the Sea", title_ru:"Труженики моря", author:"Victor Hugo", category_slug:"world-classics", language:"fr", year_published:1866, description:"Рыбак Жилльят борется с морем, чтобы поднять затонувший пароход и завоевать любовь. Гимн труду и стойкости.", cover_url:null, gutenberg_id:32338, is_featured:false },

  { slug:"three-musketeers", title:"The Three Musketeers", title_ru:"Три мушкетёра", author:"Alexandre Dumas", category_slug:"world-classics", language:"fr", year_published:1844, description:"Д'Артаньян из Гаскони едет в Париж и становится другом трёх королевских мушкетёров. Авантюра, дружба, честь.", cover_url:W("Three_Musketeers_1846.jpg"), gutenberg_id:1257, is_featured:true },
  { slug:"count-of-monte-cristo", title:"The Count of Monte Cristo", title_ru:"Граф Монте-Кристо", author:"Alexandre Dumas", category_slug:"world-classics", language:"fr", year_published:1844, description:"Эдмон Дантес несправедливо брошен в тюрьму, бежит с несметными сокровищами и мстит врагам.", cover_url:null, gutenberg_id:1184, is_featured:true },
  { slug:"twenty-years-after", title:"Twenty Years After", title_ru:"Двадцать лет спустя", author:"Alexandre Dumas", category_slug:"world-classics", language:"fr", year_published:1845, description:"Мушкетёры воссоединяются через двадцать лет — во времена Фронды и казни Карла I.", cover_url:null, gutenberg_id:1259, is_featured:false },
  { slug:"queen-margot", title:"Queen Margot", title_ru:"Королева Марго", author:"Alexandre Dumas", category_slug:"world-classics", language:"fr", year_published:1845, description:"Варфоломеевская ночь, Маргарита де Валуа и заговоры при дворе Карла IX. Один из лучших исторических романов Дюма.", cover_url:null, gutenberg_id:2759, is_featured:false },

  { slug:"sherlock-holmes-adventures", title:"The Adventures of Sherlock Holmes", title_ru:"Приключения Шерлока Холмса", author:"Arthur Conan Doyle", category_slug:"world-classics", language:"en", year_published:1892, description:"Двенадцать классических рассказов о великом сыщике и докторе Ватсоне.", cover_url:W("Adventures_of_sherlock_holmes.jpg"), gutenberg_id:1661, is_featured:true },
  { slug:"hound-of-baskervilles", title:"The Hound of the Baskervilles", title_ru:"Собака Баскервилей", author:"Arthur Conan Doyle", category_slug:"world-classics", language:"en", year_published:1902, description:"Холмс расследует гибель сэра Чарльза Баскервиля и легенду о призрачном псе на торфяных болотах Девоншира.", cover_url:null, gutenberg_id:2852, is_featured:true },
  { slug:"study-in-scarlet", title:"A Study in Scarlet", title_ru:"Этюд в багровых тонах", author:"Arthur Conan Doyle", category_slug:"world-classics", language:"en", year_published:1887, description:"Знакомство Холмса и Ватсона и первое совместное расследование убийства в Лондоне.", cover_url:null, gutenberg_id:244, is_featured:false },
  { slug:"sign-of-four", title:"The Sign of the Four", title_ru:"Знак четырёх", author:"Arthur Conan Doyle", category_slug:"world-classics", language:"en", year_published:1890, description:"Холмс распутывает дело об индийских сокровищах и загадочном убийстве.", cover_url:null, gutenberg_id:2097, is_featured:false },
  { slug:"memoirs-of-sherlock-holmes", title:"The Memoirs of Sherlock Holmes", title_ru:"Воспоминания о Шерлоке Холмсе", author:"Arthur Conan Doyle", category_slug:"world-classics", language:"en", year_published:1894, description:"Одиннадцать рассказов — включая финальную схватку с Мориарти у Рейхенбахского водопада.", cover_url:null, gutenberg_id:834, is_featured:false },

  { slug:"jane-eyre", title:"Jane Eyre", title_ru:"Джейн Эйр", author:"Charlotte Bronte", category_slug:"world-classics", language:"en", year_published:1847, description:"Сирота Джейн Эйр становится гувернанткой и влюбляется в таинственного мистера Рочестера.", cover_url:W("Jane_Eyre_title_page.jpg"), gutenberg_id:1260, is_featured:true },
  { slug:"shirley", title:"Shirley", title_ru:"Шёрли", author:"Charlotte Bronte", category_slug:"world-classics", language:"en", year_published:1849, description:"Две молодые женщины в эпоху промышленной революции и восстания луддитов. Феминистский социальный роман.", cover_url:null, gutenberg_id:30486, is_featured:false },
  { slug:"wuthering-heights", title:"Wuthering Heights", title_ru:"Грозовой перевал", author:"Emily Bronte", category_slug:"world-classics", language:"en", year_published:1847, description:"Хитклиф и Кэтрин — любовь и ненависть, перешедшие в одержимость. Один из величайших романов на английском.", cover_url:W("Wuthering_Heights_and_Agnes_Grey_title_page.jpg"), gutenberg_id:768, is_featured:true },
  { slug:"tenant-of-wildfell-hall", title:"The Tenant of Wildfell Hall", title_ru:"Незнакомка из Уайлдфелл-Холла", author:"Anne Bronte", category_slug:"world-classics", language:"en", year_published:1848, description:"Молодая женщина бежит от мужа-пьяницы с ребёнком на руках. Феминистский манифест викторианской эпохи.", cover_url:W("The_Tenant_of_Wildfell_Hall.jpg"), gutenberg_id:969, is_featured:false },

  { slug:"tess-of-the-durbervilles", title:"Tess of the d'Urbervilles", title_ru:"Тэсс из рода д'Эрбервиллей", author:"Thomas Hardy", category_slug:"world-classics", language:"en", year_published:1891, description:"Крестьянская девушка Тэсс становится жертвой общества и морали. Трагедия о несправедливости мира.", cover_url:null, gutenberg_id:110, is_featured:false },
  { slug:"far-from-madding-crowd", title:"Far from the Madding Crowd", title_ru:"Вдали от безумной толпы", author:"Thomas Hardy", category_slug:"world-classics", language:"en", year_published:1874, description:"Фермерша Батшеба Эвердин и три её поклонника на фоне дорсетской природы. Первый большой успех Харди.", cover_url:null, gutenberg_id:107, is_featured:false },

  { slug:"middlemarch", title:"Middlemarch", title_ru:"Мидлмарч", author:"George Eliot", category_slug:"world-classics", language:"en", year_published:1871, description:"Жизнь провинциального английского города — Доротея Брук и доктор Лидгейт ищут смысл и счастье.", cover_url:null, gutenberg_id:145, is_featured:false },
  { slug:"mill-on-the-floss", title:"The Mill on the Floss", title_ru:"Мельница на Флоссе", author:"George Eliot", category_slug:"world-classics", language:"en", year_published:1860, description:"Том и Мэгги Тулливер растут у старой мельницы. История умной девочки, которой нет места в патриархальном мире.", cover_url:null, gutenberg_id:6688, is_featured:false },

  { slug:"dorian-gray", title:"The Picture of Dorian Gray", title_ru:"Портрет Дориана Грея", author:"Oscar Wilde", category_slug:"world-classics", language:"en", year_published:1890, description:"Красавец Дориан желает, чтобы вместо него стареел его портрет. Роман о красоте, пороке и цене бессмертия.", cover_url:null, gutenberg_id:174, is_featured:true },
  { slug:"happy-prince-wilde", title:"The Happy Prince and Other Tales", title_ru:"Счастливый принц и другие сказки", author:"Oscar Wilde", category_slug:"world-classics", language:"en", year_published:1888, description:"Восемь волшебных сказок Уайлда — о самопожертвовании, красоте и жестокости мира.", cover_url:null, gutenberg_id:902, is_featured:false },

  { slug:"treasure-island", title:"Treasure Island", title_ru:"Остров сокровищ", author:"Robert Louis Stevenson", category_slug:"world-classics", language:"en", year_published:1883, description:"Юный Джим Хокинс, пираты и карта острова с закопанным кладом. Самый захватывающий приключенческий роман.", cover_url:null, gutenberg_id:120, is_featured:false },
  { slug:"jekyll-and-hyde", title:"Strange Case of Dr Jekyll and Mr Hyde", title_ru:"Доктор Джекил и мистер Хайд", author:"Robert Louis Stevenson", category_slug:"world-classics", language:"en", year_published:1886, description:"Учёный разделяет добро и зло внутри себя — и зло вырывается наружу. Притча о двойственности человеческой природы.", cover_url:null, gutenberg_id:43, is_featured:false },

  { slug:"woman-in-white", title:"The Woman in White", title_ru:"Женщина в белом", author:"Wilkie Collins", category_slug:"world-classics", language:"en", year_published:1859, description:"Первый детективный роман в английской литературе. Таинственная женщина и заговор вокруг состояния.", cover_url:null, gutenberg_id:583, is_featured:false },
  { slug:"the-moonstone", title:"The Moonstone", title_ru:"Лунный камень", author:"Wilkie Collins", category_slug:"world-classics", language:"en", year_published:1868, description:"Бриллиант исчезает в ночь после вечеринки. Первый полноценный детективный роман с полицейским расследованием.", cover_url:null, gutenberg_id:155, is_featured:false },

  { slug:"vanity-fair", title:"Vanity Fair", title_ru:"Ярмарка тщеславия", author:"William Makepeace Thackeray", category_slug:"world-classics", language:"en", year_published:1848, description:"Бекки Шарп и Эмилия Седли — две подруги на ярмарке социальных амбиций. Сатира на английское общество.", cover_url:null, gutenberg_id:599, is_featured:false },

  { slug:"robinson-crusoe", title:"Robinson Crusoe", title_ru:"Робинзон Крузо", author:"Daniel Defoe", category_slug:"world-classics", language:"en", year_published:1719, description:"Потерпевший кораблекрушение выживает на необитаемом острове 28 лет. Первый роман в истории английской литературы.", cover_url:W("Robinson_Crusoe_1719_1st_edition.jpg"), gutenberg_id:521, is_featured:false },
  { slug:"moll-flanders", title:"Moll Flanders", title_ru:"Молль Флендерс", author:"Daniel Defoe", category_slug:"world-classics", language:"en", year_published:1722, description:"Жизнь женщины, прошедшей через воровство, тюрьму и Америку. Первый феминистский роман на английском.", cover_url:null, gutenberg_id:370, is_featured:false },

  { slug:"gullivers-travels", title:"Gulliver's Travels", title_ru:"Путешествия Гулливера", author:"Jonathan Swift", category_slug:"world-classics", language:"en", year_published:1726, description:"Хирург Гулливер попадает в страну лилипутов, великанов, летающий остров и страну говорящих лошадей. Сатира на человечество.", cover_url:null, gutenberg_id:829, is_featured:false },

  { slug:"huckleberry-finn", title:"Adventures of Huckleberry Finn", title_ru:"Приключения Гекльберри Финна", author:"Mark Twain", category_slug:"world-classics", language:"en", year_published:1884, description:"Хак и беглый раб Джим плывут на плоту по Миссисипи. Величайший американский роман о свободе.", cover_url:null, gutenberg_id:76, is_featured:true },
  { slug:"tom-sawyer", title:"The Adventures of Tom Sawyer", title_ru:"Приключения Тома Сойера", author:"Mark Twain", category_slug:"world-classics", language:"en", year_published:1876, description:"Том Сойер белит забор, ищет клад и свидетель убийства. Вечная детская классика.", cover_url:null, gutenberg_id:74, is_featured:false },
  { slug:"connecticut-yankee", title:"A Connecticut Yankee in King Arthur's Court", title_ru:"Янки из Коннектикута при дворе короля Артура", author:"Mark Twain", category_slug:"world-classics", language:"en", year_published:1889, description:"Американский инженер XIX века просыпается в Камелоте и решает модернизировать Средневековье.", cover_url:null, gutenberg_id:86, is_featured:false },

  { slug:"call-of-the-wild", title:"The Call of the Wild", title_ru:"Зов предков", author:"Jack London", category_slug:"world-classics", language:"en", year_published:1903, description:"Пёс Бэк уезжает с калифорнийской фермы на Клондайк и постепенно возвращается к дикой природе.", cover_url:W("The_Call_of_the_Wild_(1903)_front_cover.jpg"), gutenberg_id:215, is_featured:true },
  { slug:"white-fang", title:"White Fang", title_ru:"Белый клык", author:"Jack London", category_slug:"world-classics", language:"en", year_published:1906, description:"Волк-полукровка рождается в дикой природе Юкона, проходит через жестокость людей и находит дом.", cover_url:null, gutenberg_id:910, is_featured:false },
  { slug:"sea-wolf", title:"The Sea-Wolf", title_ru:"Морской волк", author:"Jack London", category_slug:"world-classics", language:"en", year_published:1904, description:"Интеллигент оказывается на корабле под командованием беспощадного капитана Ларсена. Ницше в море.", cover_url:null, gutenberg_id:1074, is_featured:false },

  { slug:"tales-of-mystery-poe", title:"Tales of Mystery and Imagination", title_ru:"Рассказы", author:"Edgar Allan Poe", category_slug:"world-classics", language:"en", year_published:1845, description:"«Убийство на улице Морг», «Золотой жук», «Ворон» и другие. Отец детектива и мастер ужаса.", cover_url:null, gutenberg_id:2147, is_featured:false },

  { slug:"scarlet-letter", title:"The Scarlet Letter", title_ru:"Алая буква", author:"Nathaniel Hawthorne", category_slug:"world-classics", language:"en", year_published:1850, description:"Гестер Принн носит алую букву «A» как знак прелюбодеяния в пуританской Америке. Роман о грехе и искуплении.", cover_url:W("Scarlet-letter-cover.jpg"), gutenberg_id:33, is_featured:false },

  { slug:"moby-dick", title:"Moby-Dick", title_ru:"Моби Дик", author:"Herman Melville", category_slug:"world-classics", language:"en", year_published:1851, description:"Капитан Ахав одержим местью белому киту. Американский эпос о судьбе, одержимости и море.", cover_url:null, gutenberg_id:2701, is_featured:false },

  { slug:"don-quixote", title:"Don Quixote", title_ru:"Дон Кихот", author:"Miguel de Cervantes", category_slug:"world-classics", language:"other", year_published:1605, description:"Старый идальго начитался рыцарских романов и отправился в странствия как рыцарь. Первый великий европейский роман.", cover_url:null, gutenberg_id:996, is_featured:true },

  { slug:"pere-goriot", title:"Père Goriot", title_ru:"Отец Горио", author:"Honore de Balzac", category_slug:"world-classics", language:"fr", year_published:1835, description:"Добрейший «отец Горио» отдаёт всё дочерям, и те бросают его умирать в нищете. Парижская трагедия.", cover_url:null, gutenberg_id:1237, is_featured:false },
  { slug:"eugenie-grandet", title:"Eugénie Grandet", title_ru:"Евгения Гранде", author:"Honore de Balzac", category_slug:"world-classics", language:"fr", year_published:1833, description:"Дочь жадного бочара ждёт любви всю жизнь. Один из лучших романов Бальзака о власти денег.", cover_url:null, gutenberg_id:1608, is_featured:false },

  { slug:"madame-bovary", title:"Madame Bovary", title_ru:"Мадам Бовари", author:"Gustave Flaubert", category_slug:"world-classics", language:"fr", year_published:1857, description:"Эмма Бовари мечтает о роскоши и страсти, но провинциальная жизнь губит её. Абсолютный шедевр прозы.", cover_url:null, gutenberg_id:2413, is_featured:true },

  { slug:"maupassant-stories", title:"Short Stories", title_ru:"Новеллы", author:"Guy de Maupassant", category_slug:"world-classics", language:"fr", year_published:1880, description:"«Пышка», «Ожерелье», «Дом Телье» и другие шедевры. Мопассан — лучший новеллист мировой литературы.", cover_url:null, gutenberg_id:3090, is_featured:false },

  { slug:"quo-vadis", title:"Quo Vadis", title_ru:"Камо грядеши", author:"Henryk Sienkiewicz", category_slug:"world-classics", language:"other", year_published:1895, description:"Любовь римского офицера и христианки в эпоху Нерона. Нобелевская премия. Роман о вере и гонениях.", cover_url:null, gutenberg_id:2853, is_featured:false },

  // ════════════════════════════════════════════════════════════
  // РОМАНТИКА
  // ════════════════════════════════════════════════════════════
  { slug:"werther", title:"The Sorrows of Young Werther", title_ru:"Страдания юного Вертера", author:"Johann Wolfgang von Goethe", category_slug:"romance", language:"de", year_published:1774, description:"Молодой художник безнадёжно влюблён в замужнюю Лотту. Первый европейский бестселлер — роман в письмах.", cover_url:W("-1-_Die_Leiden_des_jungen_Werthers._Erstdruck.jpg"), gutenberg_id:2527, is_featured:false },
  { slug:"north-and-south", title:"North and South", title_ru:"Север и Юг", author:"George Eliot", category_slug:"romance", language:"en", year_published:1855, description:"Маргарет Хейл из сельского юга переезжает в промышленный Милтон и встречает фабриканта Торнтона.", cover_url:null, gutenberg_id:4547, is_featured:false },
  { slug:"agnes-grey", title:"Agnes Grey", title_ru:"Агнес Грей", author:"Anne Bronte", category_slug:"romance", language:"en", year_published:1847, description:"Дочь бедного священника становится гувернанткой. Автобиографический роман Энн Бронте о достоинстве и любви.", cover_url:null, gutenberg_id:767, is_featured:false },
  { slug:"vicar-of-wakefield", title:"The Vicar of Wakefield", title_ru:"Векфилдский священник", author:"Jonathan Swift", category_slug:"romance", language:"en", year_published:1766, description:"Добродушный священник доктор Примроз переживает потери и несчастья с неизменным достоинством.", cover_url:null, gutenberg_id:2667, is_featured:false },

  // ════════════════════════════════════════════════════════════
  // ФИЛОСОФИЯ
  // ════════════════════════════════════════════════════════════
  { slug:"meditations", title:"Meditations", title_ru:"Размышления", author:"Marcus Aurelius", category_slug:"philosophy", language:"en", year_published:180, description:"Личный дневник римского императора-стоика — наставления самому себе о долге, смирении и силе разума.", cover_url:W("MeditationsMarcusAurelius1811.jpg"), gutenberg_id:2680, is_featured:true },
  { slug:"seneca-letters", title:"Letters from a Stoic", title_ru:"Письма к Луцилию", author:"Lucius Annaeus Seneca", category_slug:"philosophy", language:"en", year_published:65, description:"124 письма о времени, смерти, дружбе и правильной жизни. Практическая стоическая мудрость.", cover_url:W("Seneca_-_Lettere,_1802_(page_3_crop).jpg"), gutenberg_id:900, is_featured:true },
  { slug:"seneca-shortness", title:"On the Shortness of Life", title_ru:"О краткости жизни", author:"Lucius Annaeus Seneca", category_slug:"philosophy", language:"en", year_published:49, description:"«Жизнь не коротка — мы сами её расточаем». Три эссе о времени и том, как им распоряжаться.", cover_url:null, gutenberg_id:1740, is_featured:false },
  { slug:"enchiridion", title:"Enchiridion", title_ru:"Энхиридион", author:"Epictetus", category_slug:"philosophy", language:"en", year_published:135, description:"Краткое руководство Эпиктета: что в нашей власти, а что нет. Стоицизм в 53 коротких главах.", cover_url:null, gutenberg_id:45109, is_featured:false },
  { slug:"discourses-epictetus", title:"Discourses", title_ru:"Беседы", author:"Epictetus", category_slug:"philosophy", language:"en", year_published:108, description:"Четыре книги бесед Эпиктета, записанных учеником. Свобода, судьба, философия как образ жизни.", cover_url:null, gutenberg_id:45109, is_featured:false },
  { slug:"republic-plato", title:"The Republic", title_ru:"Государство", author:"Plato", category_slug:"philosophy", language:"en", year_published:-380, description:"Платон строит идеальное государство и задаётся вопросом: что такое справедливость? Основа западной философии.", cover_url:null, gutenberg_id:1497, is_featured:false },
  { slug:"symposium-plato", title:"The Symposium", title_ru:"Пир", author:"Plato", category_slug:"philosophy", language:"en", year_published:-385, description:"Застольные речи о природе Эроса. Платоновская любовь как восхождение от красоты тела к красоте идеи.", cover_url:null, gutenberg_id:1600, is_featured:false },
  { slug:"apology-plato", title:"Apology", title_ru:"Апология Сократа", author:"Plato", category_slug:"philosophy", language:"en", year_published:-399, description:"Речь Сократа на суде, приговорившем его к смерти. Образец человеческого достоинства перед лицом несправедливости.", cover_url:null, gutenberg_id:1656, is_featured:false },
  { slug:"nicomachean-ethics", title:"Nicomachean Ethics", title_ru:"Никомахова этика", author:"Aristotle", category_slug:"philosophy", language:"en", year_published:-350, description:"Что такое счастье? Аристотель отвечает: это деятельность в соответствии с добродетелью. Основа этики.", cover_url:null, gutenberg_id:8438, is_featured:false },
  { slug:"politics-aristotle", title:"Politics", title_ru:"Политика", author:"Aristotle", category_slug:"philosophy", language:"en", year_published:-350, description:"«Человек — животное политическое». Аристотель о государстве, гражданстве и лучшем устройстве общества.", cover_url:null, gutenberg_id:6762, is_featured:false },
  { slug:"montaigne-essays", title:"Essays", title_ru:"Опыты", author:"Michel de Montaigne", category_slug:"philosophy", language:"fr", year_published:1580, description:"Монтень изобрёл жанр эссе: личные размышления обо всём — от смерти до каннибализма. Бесконечно современная книга.", cover_url:W("Montaigne_-_Essais,_Musart,_1847.jpg"), gutenberg_id:3600, is_featured:false },
  { slug:"candide", title:"Candide", title_ru:"Кандид", author:"Voltaire", category_slug:"philosophy", language:"fr", year_published:1759, description:"Наивный Кандид путешествует по миру, встречая войну, инквизицию и катастрофы. Вольтер против слепого оптимизма.", cover_url:null, gutenberg_id:19942, is_featured:false },
  { slug:"zarathustra", title:"Thus Spoke Zarathustra", title_ru:"Так говорил Заратустра", author:"Friedrich Nietzsche", category_slug:"philosophy", language:"de", year_published:1883, description:"Пророк Заратустра провозглашает сверхчеловека, вечное возвращение и смерть Бога. Философская поэма Ницше.", cover_url:W("Nietzsche_-_Also_sprach_Zarathustra_-_1883.jpg"), gutenberg_id:1998, is_featured:true },
  { slug:"beyond-good-and-evil", title:"Beyond Good and Evil", title_ru:"По ту сторону добра и зла", author:"Friedrich Nietzsche", category_slug:"philosophy", language:"de", year_published:1886, description:"Ницше атакует основания западной морали и философии. Воля к власти, перспективизм и критика демократии.", cover_url:null, gutenberg_id:4363, is_featured:false },
  { slug:"genealogy-of-morality", title:"On the Genealogy of Morality", title_ru:"К генеалогии морали", author:"Friedrich Nietzsche", category_slug:"philosophy", language:"de", year_published:1887, description:"Откуда взялись наши понятия добра и зла? Ницше исследует рождение морали из ресентимента слабых.", cover_url:null, gutenberg_id:52319, is_featured:false },
  { slug:"world-as-will", title:"The World as Will and Representation", title_ru:"Мир как воля и представление", author:"Arthur Schopenhauer", category_slug:"philosophy", language:"de", year_published:1818, description:"Мир — это воля, слепое стремление к существованию. Шопенгауэр о страдании, искусстве и спасении через отрицание воли.", cover_url:W("Schopenhauer_-_Die_Welt_als_Wille_und_Vorstellung.jpg"), gutenberg_id:38427, is_featured:false },
  { slug:"art-of-war", title:"The Art of War", title_ru:"Искусство войны", author:"Sun Tzu", category_slug:"philosophy", language:"other", year_published:-500, description:"Тринадцать глав о стратегии: знай себя и врага, побеждай без боя. Самый читаемый военный трактат в истории.", cover_url:null, gutenberg_id:132, is_featured:true },
  { slug:"divine-comedy", title:"The Divine Comedy", title_ru:"Божественная комедия", author:"Dante Alighieri", category_slug:"philosophy", language:"other", year_published:1320, description:"Данте путешествует через Ад, Чистилище и Рай — величайшая поэма мировой литературы.", cover_url:null, gutenberg_id:8800, is_featured:false },
  { slug:"the-prince", title:"The Prince", title_ru:"Государь", author:"Niccolo Machiavelli", category_slug:"philosophy", language:"other", year_published:1532, description:"Руководство для правителей: цель оправдывает средства. Макиавелли о реальной политике без иллюзий.", cover_url:null, gutenberg_id:1232, is_featured:false },

  // ════════════════════════════════════════════════════════════
  // САМОРАЗВИТИЕ
  // ════════════════════════════════════════════════════════════
  { slug:"self-help", title:"Self-Help", title_ru:"Self-Help", author:"Samuel Smiles", category_slug:"self-development", language:"en", year_published:1859, description:"Первая книга по саморазвитию. Истории великих людей доказывают: успех зависит от характера, а не происхождения.", cover_url:W("Self-Help_-_Facing_page_108.png"), gutenberg_id:935, is_featured:true },
  { slug:"character-smiles", title:"Character", title_ru:"Характер", author:"Samuel Smiles", category_slug:"self-development", language:"en", year_published:1871, description:"О силе характера как основе любого достижения. Истории из жизни учёных, художников и государственных деятелей.", cover_url:W("Character_-_Samuel_Smiles.jpg"), gutenberg_id:4897, is_featured:false },
  { slug:"thrift-smiles", title:"Thrift", title_ru:"Бережливость", author:"Samuel Smiles", category_slug:"self-development", language:"en", year_published:1875, description:"Смайлс о бережливости, труде и независимости. Как привычки малых трат ведут к большому богатству.", cover_url:W("Thrift_-_Samuel_Smiles.jpg"), gutenberg_id:14418, is_featured:false },
  { slug:"duty-smiles", title:"Duty", title_ru:"Долг", author:"Samuel Smiles", category_slug:"self-development", language:"en", year_published:1880, description:"О добродетели долга — перед семьёй, обществом и самим собой. Завершающая книга классической четвёрки Смайлса.", cover_url:null, gutenberg_id:14429, is_featured:false },
  { slug:"science-of-getting-rich", title:"The Science of Getting Rich", title_ru:"Наука стать богатым", author:"Wallace D. Wattles", category_slug:"self-development", language:"en", year_published:1910, description:"Уоттлз утверждает: богатство доступно каждому, кто мыслит правильным образом. Предшественник «Тайны».", cover_url:W("The_Science_of_Getting_Rich_-_title_frame.png"), gutenberg_id:1541, is_featured:true },
  { slug:"science-of-being-great", title:"The Science of Being Great", title_ru:"Наука стать великим", author:"Wallace D. Wattles", category_slug:"self-development", language:"en", year_published:1910, description:"Продолжение «Науки стать богатым»: как раскрыть свой внутренний потенциал и стать по-настоящему великим.", cover_url:null, gutenberg_id:4053, is_featured:false },
  { slug:"pushing-to-the-front", title:"Pushing to the Front", title_ru:"Вперёд к успеху", author:"Orison Swett Marden", category_slug:"self-development", language:"en", year_published:1894, description:"Марден собрал сотни историй людей, пробившихся с нуля. Американская мечта как руководство к действию.", cover_url:W("Pushing_to_the_front_(1894).jpg"), gutenberg_id:11840, is_featured:false },
  { slug:"he-can-who-thinks-he-can", title:"He Can Who Thinks He Can", title_ru:"Сможет тот, кто верит", author:"Orison Swett Marden", category_slug:"self-development", language:"en", year_published:1908, description:"Сила убеждения в собственные возможности как главный инструмент успеха.", cover_url:null, gutenberg_id:21623, is_featured:false },

  // ════════════════════════════════════════════════════════════
  // БИЗНЕС И УСПЕХ
  // ════════════════════════════════════════════════════════════
  { slug:"autobiography-franklin", title:"The Autobiography of Benjamin Franklin", title_ru:"Автобиография Бенджамина Франклина", author:"Benjamin Franklin", category_slug:"business-success", language:"en", year_published:1791, description:"Путь из бедного печатника до дипломата и учёного. Практические советы по продуктивности не устарели за 230 лет.", cover_url:W("The_autobiography_of_Benjamin_Franklin_(1895)_(14804149143).jpg"), gutenberg_id:148, is_featured:true },
  { slug:"poor-richard", title:"Poor Richard's Almanack", title_ru:"Альманах бедного Ричарда", author:"Benjamin Franklin", category_slug:"business-success", language:"en", year_published:1758, description:"Афоризмы Франклина о труде, бережливости и мудрости. «Ранний подъём делает человека здоровым, богатым и мудрым».", cover_url:W("Poor_Richard.jpg"), gutenberg_id:73742, is_featured:false },
  { slug:"gospel-of-wealth", title:"The Gospel of Wealth", title_ru:"Евангелие богатства", author:"Herman Melville", category_slug:"business-success", language:"en", year_published:1889, description:"Карнеги о том, что богатство обязывает: миллионер должен тратить состояние на благо общества.", cover_url:null, gutenberg_id:null, is_featured:false },
  { slug:"emerson-essays", title:"Essays: First Series", title_ru:"Эссе: первая серия", author:"Honore de Balzac", category_slug:"business-success", language:"en", year_published:1841, description:"«Опора на собственные силы», «Компенсация», «Дружба» — Эмерсон о самодостаточности и американском духе.", cover_url:W("Essays,_First_Series,_Emerson,_1841.jpg"), gutenberg_id:2944, is_featured:false },

  // ════════════════════════════════════════════════════════════
  // НАУКА
  // ════════════════════════════════════════════════════════════
  { slug:"popular-astronomy", title:"Popular Astronomy", title_ru:"Популярная астрономия", author:"Camille Flammarion", category_slug:"science", language:"fr", year_published:1880, description:"Фламмарион открыл звёздное небо для миллионов читателей: живой рассказ о Солнечной системе и Вселенной.", cover_url:W("AstronomiePopulaire1880.jpg"), gutenberg_id:null, is_featured:true },
  { slug:"around-the-world-80-days", title:"Around the World in Eighty Days", title_ru:"Вокруг света за восемьдесят дней", author:"Jules Verne", category_slug:"science", language:"fr", year_published:1872, description:"Флегматичный Филеас Фогг пари: объехать земной шар за 80 дней. Паровозы, слоны и воздушные шары.", cover_url:W("Verne_Tour_du_Monde.jpg"), gutenberg_id:103, is_featured:true },
  { slug:"20000-leagues", title:"Twenty Thousand Leagues Under the Sea", title_ru:"20 000 лье под водой", author:"Jules Verne", category_slug:"science", language:"fr", year_published:1870, description:"Профессор Аронакс на борту таинственного «Наутилуса» капитана Немо исследует глубины мирового океана.", cover_url:W("Houghton_FC8_V5946_869ve_-_Verne,_frontispiece.jpg"), gutenberg_id:164, is_featured:false },
  { slug:"from-earth-to-moon", title:"From the Earth to the Moon", title_ru:"С Земли на Луну", author:"Jules Verne", category_slug:"science", language:"fr", year_published:1865, description:"Пушечный клуб задумывает выстрелить снарядом с людьми на Луну. Провидческая техническая фантастика.", cover_url:W("From_the_Earth_to_the_Moon_-_front_cover.jpg"), gutenberg_id:83, is_featured:false },
  { slug:"journey-to-center-of-earth", title:"Journey to the Center of the Earth", title_ru:"Путешествие к центру Земли", author:"Jules Verne", category_slug:"science", language:"fr", year_published:1864, description:"Профессор Отто Линденброк спускается в жерло вулкана, чтобы достичь центра Земли.", cover_url:null, gutenberg_id:3748, is_featured:false },
  { slug:"mysterious-island", title:"The Mysterious Island", title_ru:"Таинственный остров", author:"Jules Verne", category_slug:"science", language:"fr", year_published:1874, description:"Пятеро беглецов оказываются на необитаемом острове и строят цивилизацию с нуля. Лучший роман Верна.", cover_url:null, gutenberg_id:1268, is_featured:false },
  { slug:"michael-strogoff", title:"Michael Strogoff", title_ru:"Михаил Строгов", author:"Jules Verne", category_slug:"science", language:"fr", year_published:1876, description:"Курьер царя пробирается через охваченную бунтом Сибирь. Один из самых захватывающих приключенческих романов Верна.", cover_url:null, gutenberg_id:1848, is_featured:false },
  { slug:"origin-of-species", title:"On the Origin of Species", title_ru:"Происхождение видов", author:"Charles Darwin", category_slug:"science", language:"en", year_published:1859, description:"Книга, изменившая представление человечества о себе: отбор, эволюция и происхождение всего живого.", cover_url:null, gutenberg_id:1228, is_featured:true },
  { slug:"voyage-of-beagle", title:"The Voyage of the Beagle", title_ru:"Путешествие на корабле Бигль", author:"Charles Darwin", category_slug:"science", language:"en", year_published:1839, description:"Пятилетнее кругосветное плавание молодого Дарвина — наблюдения природы, открывшие путь к теории эволюции.", cover_url:null, gutenberg_id:944, is_featured:false },
  { slug:"descent-of-man", title:"The Descent of Man", title_ru:"Происхождение человека", author:"Charles Darwin", category_slug:"science", language:"en", year_published:1871, description:"Дарвин распространяет теорию эволюции на человека и объясняет происхождение разума и нравственности.", cover_url:null, gutenberg_id:2300, is_featured:false },

  // ════════════════════════════════════════════════════════════
  // УЗБЕКСКАЯ КЛАССИКА
  // ════════════════════════════════════════════════════════════
  { slug:"babur-name", title:"Baburnama", title_ru:"Бабур-наме", author:"Babur", category_slug:"uzbek-classics", language:"uz", year_published:1530, description:"Мемуары основателя империи Великих Моголов: войны, поэзия, садоводство и природа Центральной Азии.", cover_url:W("Illuminated_Manuscript_Baburnamah.jpg"), gutenberg_id:null, is_featured:true },
  { slug:"navai-khamsa", title:"Khamsa (Quintet)", title_ru:"Хамса (Пятерица)", author:"Alisher Navoi", category_slug:"uzbek-classics", language:"uz", year_published:1485, description:"Пять поэм Навои — вершина чагатайской поэзии. Ответ великого узбекского поэта на «Хамсу» Низами.", cover_url:W("Alisher_Navoi_-_Five_Poems_(Quintet)_-_Walters_W663_-_Top_Exterior.jpg"), gutenberg_id:null, is_featured:true },
  { slug:"navai-divan", title:"Divan of Alisher Navoi", title_ru:"Диван Навои", author:"Alisher Navoi", category_slug:"uzbek-classics", language:"uz", year_published:1498, description:"Собрание лирики Навои: газели о любви, красоте, мистике и скоротечности жизни.", cover_url:W("Divan_of_Ali-Shir_Nava'i_MET_DP271245.jpg"), gutenberg_id:null, is_featured:false },
  { slug:"navai-muhakamat", title:"Muhakamat ul-Lughatayn", title_ru:"Суждение о двух языках", author:"Alisher Navoi", category_slug:"uzbek-classics", language:"uz", year_published:1499, description:"Навои доказывает богатство тюркского языка перед персидским. Манифест узбекской литературы.", cover_url:null, gutenberg_id:null, is_featured:false },
  { slug:"khamsa-nizami", title:"Khamsa of Nizami", title_ru:"Хамса Низами", author:"Alisher Navoi", category_slug:"uzbek-classics", language:"uz", year_published:1200, description:"Пять поэм Низами Гянджеви — «Лейла и Меджнун», «Хосров и Ширин» и другие. Влияние на всю тюрко-персидскую поэзию.", cover_url:W("Khamsa_of_Nizami_MET_DP232290.jpg"), gutenberg_id:null, is_featured:false },
  { slug:"timurnama", title:"Temurnama", title_ru:"Темур-наме", author:"Babur", category_slug:"uzbek-classics", language:"uz", year_published:1436, description:"Эпическая поэма о деяниях Тимура — завоевателя, построившего великую империю Центральной Азии.", cover_url:W("Temur-nama.jpg"), gutenberg_id:null, is_featured:false },

  // ════════════════════════════════════════════════════════════
  // ШЕКСПИР
  // ════════════════════════════════════════════════════════════
  { slug:"hamlet", title:"Hamlet", title_ru:"Гамлет", author:"William Shakespeare", category_slug:"world-classics", language:"en", year_published:1603, description:"Принц датский медлит мстить за убитого отца. «Быть или не быть» — вечный вопрос о действии и бездействии.", cover_url:null, gutenberg_id:1524, is_featured:true },
  { slug:"romeo-and-juliet", title:"Romeo and Juliet", title_ru:"Ромео и Джульетта", author:"William Shakespeare", category_slug:"romance", language:"en", year_published:1597, description:"Дети враждующих семей влюбляются и гибнут. Вечная история о любви, победившей смерть, но не ненависть.", cover_url:null, gutenberg_id:1513, is_featured:true },
  { slug:"macbeth", title:"Macbeth", title_ru:"Макбет", author:"William Shakespeare", category_slug:"world-classics", language:"en", year_published:1606, description:"Шотландский полководец убивает короля, движимый честолюбием и пророчеством ведьм. Трагедия власти.", cover_url:null, gutenberg_id:1533, is_featured:false },
  { slug:"othello", title:"Othello", title_ru:"Отелло", author:"William Shakespeare", category_slug:"world-classics", language:"en", year_published:1603, description:"Яго разжигает ревность в доверчивом мавре Отелло. Трагедия ревности, манипуляции и предательства.", cover_url:null, gutenberg_id:1531, is_featured:false },
  { slug:"king-lear", title:"King Lear", title_ru:"Король Лир", author:"William Shakespeare", category_slug:"world-classics", language:"en", year_published:1606, description:"Старый король делит королевство между дочерьми — и две из них предают его. Шекспир о старости и неблагодарности.", cover_url:null, gutenberg_id:1532, is_featured:false },
  { slug:"midsummer-night", title:"A Midsummer Night's Dream", title_ru:"Сон в летнюю ночь", author:"William Shakespeare", category_slug:"romance", language:"en", year_published:1600, description:"В волшебном лесу влюблённые запутываются в чарах эльфов. Самая весёлая и поэтичная пьеса Шекспира.", cover_url:null, gutenberg_id:1514, is_featured:false },
  { slug:"merchant-of-venice", title:"The Merchant of Venice", title_ru:"Венецианский купец", author:"William Shakespeare", category_slug:"world-classics", language:"en", year_published:1600, description:"Шейлок требует «фунт мяса» по условиям договора. Шекспир о правосудии, милосердии и предрассудках.", cover_url:null, gutenberg_id:2243, is_featured:false },
  { slug:"tempest", title:"The Tempest", title_ru:"Буря", author:"William Shakespeare", category_slug:"world-classics", language:"en", year_published:1611, description:"Волшебник Просперо устраивает кораблекрушение врагам на своём острове. Последняя пьеса Шекспира.", cover_url:null, gutenberg_id:23042, is_featured:false },
];

// ── Seed ─────────────────────────────────────────────────────────────────────
async function seed() {
  console.log("🌱  Seeding Folio database…\n");

  // 1. Clear existing data (books first due to FK)
  console.log("  → Clearing old data…");
  await supabase.from("books").delete().gte("id", 0);
  await supabase.from("authors").delete().gte("id", 0);
  console.log("     ✓ Cleared");

  // 2. Insert authors in one shot
  console.log("  → Authors…");
  const { data: insertedAuthors, error: authErr } = await supabase
    .from("authors")
    .insert(AUTHORS)
    .select("id, name");
  if (authErr) { console.error("Authors error:", authErr); process.exit(1); }
  console.log(`     ✓ ${insertedAuthors?.length} authors`);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const authorMap: Record<string, number> = Object.fromEntries(
    (insertedAuthors ?? []).map((a: any) => [a.name, a.id])
  );

  // 3. Insert books in batches of 50
  console.log("  → Books…");
  const booksToInsert = BOOKS.map(({ author, ...book }) => ({
    ...book,
    author_id: authorMap[author] ?? null,
    is_public: true,
  }));

  const BATCH = 50;
  let total = 0;
  for (let i = 0; i < booksToInsert.length; i += BATCH) {
    const batch = booksToInsert.slice(i, i + BATCH);
    const { data, error } = await supabase.from("books").insert(batch).select("id");
    if (error) { console.error(`Batch ${i / BATCH + 1} error:`, error.message); process.exit(1); }
    total += data?.length ?? 0;
    process.stdout.write(`     batch ${i / BATCH + 1}: ${total} books so far…\r`);
  }
  console.log(`\n     ✓ ${total} books inserted`);
  console.log("\n✅  Seed complete!\n");
}

seed().catch((err) => { console.error(err); process.exit(1); });
