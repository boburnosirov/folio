import type { CoverVariant } from "./BookCover";
import { BookOpen, Brain, Briefcase, Globe, Heart, Star, Telescope, TrendingUp } from "lucide-react";

export type HomeBook = {
  title: string;
  author: string;
  variant: CoverVariant;
  imageUrl: string;
};

export type HomeCategory = {
  slug: string;
  name: string;
  desc: string;
  icon: typeof BookOpen;
  covers: HomeBook[];
};

export type ExcerptItem = HomeBook & {
  text: string;
  work: string;
  slug: string;
  batch: string;
};

export const COVERS = {
  anna: "https://commons.wikimedia.org/wiki/Special:FilePath/AnnaKareninaTitle.jpg?width=700",
  crime: "https://commons.wikimedia.org/wiki/Special:FilePath/Cover_of_the_first_edition_of_Crime_and_Punishment.jpg?width=700",
  warPeace: "https://commons.wikimedia.org/wiki/Special:FilePath/Tolstoy_-_War_and_Peace,_first_edition,_1869.jpg?width=700",
  gogol: "https://commons.wikimedia.org/wiki/Special:FilePath/Dead_Souls_(novel)_Nikolai_Gogol_1842_title_page.jpg?width=700",
  chekhov: "https://commons.wikimedia.org/wiki/Special:FilePath/Chekhov_Detvora_cover.jpg?width=700",
  onegin: "https://commons.wikimedia.org/wiki/Special:FilePath/Eugene_Onegin_first_edition.jpg?width=700",

  hugo: "https://commons.wikimedia.org/wiki/Special:FilePath/Les_miserables.jpg?width=700",
  austen: "https://commons.wikimedia.org/wiki/Special:FilePath/PrideAndPrejudiceTitlePage.jpg?width=700",
  sherlock: "https://commons.wikimedia.org/wiki/Special:FilePath/Adventures_of_sherlock_holmes.jpg?width=700",
  dickens: "https://commons.wikimedia.org/wiki/Special:FilePath/A_Tale_of_Two_Cities_-_First_edition_cover_1859.jpg?width=700",
  dumas: "https://commons.wikimedia.org/wiki/Special:FilePath/Three_Musketeers_1846.jpg?width=700",
  london: "https://commons.wikimedia.org/wiki/Special:FilePath/The_Call_of_the_Wild_(1903)_front_cover.jpg?width=700",

  janeEyre: "https://commons.wikimedia.org/wiki/Special:FilePath/Jane_Eyre_title_page.jpg?width=700",
  werther: "https://commons.wikimedia.org/wiki/Special:FilePath/-1-_Die_Leiden_des_jungen_Werthers._Erstdruck.jpg?width=700",
  wildfell: "https://commons.wikimedia.org/wiki/Special:FilePath/The_Tenant_of_Wildfell_Hall.jpg?width=700",
  wuthering: "https://commons.wikimedia.org/wiki/Special:FilePath/Wuthering_Heights_and_Agnes_Grey_title_page.jpg?width=700",
  scarlet: "https://commons.wikimedia.org/wiki/Special:FilePath/Scarlet-letter-cover.jpg?width=700",
  firstLove: "https://commons.wikimedia.org/wiki/Special:FilePath/Turgenev_First_Love_1884.jpg?width=700",

  meditations: "https://commons.wikimedia.org/wiki/Special:FilePath/MeditationsMarcusAurelius1811.jpg?width=700",
  seneca: "https://commons.wikimedia.org/wiki/Special:FilePath/Seneca_-_Lettere,_1802_(page_3_crop).jpg?width=700",
  montaigne: "https://commons.wikimedia.org/wiki/Special:FilePath/Montaigne_-_Essais,_Musart,_1847.djvu?width=700",
  nietzsche: "https://commons.wikimedia.org/wiki/Special:FilePath/Nietzsche_-_Also_sprach_Zarathustra_-_1883.jpg?width=700",
  schopenhauer: "https://commons.wikimedia.org/wiki/Special:FilePath/Schopenhauer_-_Die_Welt_als_Wille_und_Vorstellung.jpg?width=700",
  emerson: "https://commons.wikimedia.org/wiki/Special:FilePath/Essays,_First_Series,_Emerson,_1841.jpg?width=700",

  selfHelp: "https://commons.wikimedia.org/wiki/Special:FilePath/Self-Help_-_Facing_page_108.png?width=700",
  rich: "https://commons.wikimedia.org/wiki/Special:FilePath/The_Science_of_Getting_Rich_-_title_frame.png?width=700",
  hill: "https://commons.wikimedia.org/wiki/Special:FilePath/Think_and_Grow_Rich,_original_1937_title_page.jpg?width=700",
  marden: "https://commons.wikimedia.org/wiki/Special:FilePath/Pushing_to_the_front_(1894).jpg?width=700",
  character: "https://commons.wikimedia.org/wiki/Special:FilePath/Character_-_Samuel_Smiles.jpg?width=700",
  thrift: "https://commons.wikimedia.org/wiki/Special:FilePath/Thrift_-_Samuel_Smiles.jpg?width=700",

  poorRichard: "https://commons.wikimedia.org/wiki/Special:FilePath/Poor_Richard.jpg?width=700",
  franklin: "https://commons.wikimedia.org/wiki/Special:FilePath/The_autobiography_of_Benjamin_Franklin_(1895)_(14804149143).jpg?width=700",
  carnegie: "https://commons.wikimedia.org/wiki/Special:FilePath/The_Gospel_of_Wealth.jpg?width=700",
  successful: "https://commons.wikimedia.org/wiki/Special:FilePath/Successful_men_of_today_and_what_they_say_of_success.jpg?width=700",
  business: "https://commons.wikimedia.org/wiki/Special:FilePath/Business_hints_for_men_and_women_(IA_businesshintsfor00calh).pdf?page=1&width=700",
  wealth: "https://commons.wikimedia.org/wiki/Special:FilePath/Wealth_against_commonwealth.jpg?width=700",

  astronomy: "https://commons.wikimedia.org/wiki/Special:FilePath/AstronomiePopulaire1880.jpg?width=700",
  verneWorld: "https://commons.wikimedia.org/wiki/Special:FilePath/Verne_Tour_du_Monde.jpg?width=700",
  verneSea: "https://commons.wikimedia.org/wiki/Special:FilePath/Houghton_FC8_V5946_869ve_-_Verne,_frontispiece.jpg?width=700",
  method: "https://commons.wikimedia.org/wiki/Special:FilePath/Science_and_method_(IA_sciencemethod00poin).pdf?page=1&width=700",
  einstein: "https://commons.wikimedia.org/wiki/Special:FilePath/Einstein_Relativity_1920_title_page.jpg?width=700",
  moon: "https://commons.wikimedia.org/wiki/Special:FilePath/From_the_Earth_to_the_Moon_-_front_cover.jpg?width=700",

  babur: "https://commons.wikimedia.org/wiki/Special:FilePath/Illuminated_Manuscript_Baburnamah.jpg?width=700",
  navai: "https://commons.wikimedia.org/wiki/Special:FilePath/Alisher_Navoi_-_Five_Poems_(Quintet)_-_Walters_W663_-_Top_Exterior.jpg?width=700",
  divan: "https://commons.wikimedia.org/wiki/Special:FilePath/Divan_of_Ali-Shir_Nava'i_MET_DP271245.jpg?width=700",
  timur: "https://commons.wikimedia.org/wiki/Special:FilePath/Temur-nama.jpg?width=700",
  khamsa: "https://commons.wikimedia.org/wiki/Special:FilePath/Khamsa_of_Nizami_MET_DP232290.jpg?width=700",
  uzbekPoetry: "https://commons.wikimedia.org/wiki/Special:FilePath/Uzbek_book_cover.jpg?width=700",
} as const;

export const HOME_CATEGORIES: HomeCategory[] = [
  {
    slug: "russian-classics",
    name: "Художественная литература",
    desc: "Толстой, Достоевский, Чехов, Гоголь",
    icon: BookOpen,
    covers: [
      { title: "Анна Каренина", author: "Толстой", variant: "anna", imageUrl: COVERS.anna },
      { title: "Преступление", author: "Достоевский", variant: "crime", imageUrl: COVERS.crime },
      { title: "Война и мир", author: "Толстой", variant: "anna", imageUrl: COVERS.warPeace },
      { title: "Мёртвые души", author: "Гоголь", variant: "gogol", imageUrl: COVERS.gogol },
      { title: "Детвора", author: "Чехов", variant: "chekhov", imageUrl: COVERS.chekhov },
      { title: "Онегин", author: "Пушкин", variant: "gogol", imageUrl: COVERS.onegin },
    ],
  },
  {
    slug: "world-classics",
    name: "Зарубежная классика",
    desc: "Гюго, Остин, Диккенс, Дюма, Лондон",
    icon: Globe,
    covers: [
      { title: "Отверженные", author: "Гюго", variant: "hugo", imageUrl: COVERS.hugo },
      { title: "Гордость", author: "Остин", variant: "austen", imageUrl: COVERS.austen },
      { title: "Шерлок", author: "Дойл", variant: "sherlock", imageUrl: COVERS.sherlock },
      { title: "Два города", author: "Диккенс", variant: "hugo", imageUrl: COVERS.dickens },
      { title: "Мушкетёры", author: "Дюма", variant: "franklin", imageUrl: COVERS.dumas },
      { title: "Зов предков", author: "Лондон", variant: "sherlock", imageUrl: COVERS.london },
    ],
  },
  {
    slug: "romance",
    name: "Романтика",
    desc: "Остин, Бронте, Гёте, Тургенев",
    icon: Heart,
    covers: [
      { title: "Jane Eyre", author: "Бронте", variant: "austen", imageUrl: COVERS.janeEyre },
      { title: "Werther", author: "Гёте", variant: "hugo", imageUrl: COVERS.werther },
      { title: "Wildfell Hall", author: "Бронте", variant: "austen", imageUrl: COVERS.wildfell },
      { title: "Wuthering", author: "Бронте", variant: "crime", imageUrl: COVERS.wuthering },
      { title: "The Scarlet", author: "Готорн", variant: "anna", imageUrl: COVERS.scarlet },
      { title: "Первая любовь", author: "Тургенев", variant: "chekhov", imageUrl: COVERS.firstLove },
    ],
  },
  {
    slug: "philosophy",
    name: "Философия и характер",
    desc: "Аврелий, Сенека, Монтень, Ницше",
    icon: Brain,
    covers: [
      { title: "Размышления", author: "Аврелий", variant: "marcus", imageUrl: COVERS.meditations },
      { title: "Письма", author: "Сенека", variant: "franklin", imageUrl: COVERS.seneca },
      { title: "Опыты", author: "Монтень", variant: "gogol", imageUrl: COVERS.montaigne },
      { title: "Заратустра", author: "Ницше", variant: "hugo", imageUrl: COVERS.nietzsche },
      { title: "Мир как воля", author: "Шопенгауэр", variant: "marcus", imageUrl: COVERS.schopenhauer },
      { title: "Essays", author: "Эмерсон", variant: "austen", imageUrl: COVERS.emerson },
    ],
  },
  {
    slug: "self-development",
    name: "Саморазвитие",
    desc: "Смайлс, Уоттлз, Хилл, Марден",
    icon: TrendingUp,
    covers: [
      { title: "Self-Help", author: "Смайлс", variant: "franklin", imageUrl: COVERS.selfHelp },
      { title: "The Science", author: "Уоттлз", variant: "verne", imageUrl: COVERS.rich },
      { title: "Think", author: "Хилл", variant: "marcus", imageUrl: COVERS.hill },
      { title: "Pushing", author: "Марден", variant: "sherlock", imageUrl: COVERS.marden },
      { title: "Character", author: "Смайлс", variant: "franklin", imageUrl: COVERS.character },
      { title: "Thrift", author: "Смайлс", variant: "franklin", imageUrl: COVERS.thrift },
    ],
  },
  {
    slug: "business-success",
    name: "Бизнес и успех",
    desc: "Франклин, Карнеги и классика дела",
    icon: Briefcase,
    covers: [
      { title: "Poor Richard", author: "Франклин", variant: "franklin", imageUrl: COVERS.poorRichard },
      { title: "Автобиография", author: "Франклин", variant: "franklin", imageUrl: COVERS.franklin },
      { title: "Gospel", author: "Карнеги", variant: "marcus", imageUrl: COVERS.carnegie },
      { title: "Successful Men", author: "Эссе", variant: "hugo", imageUrl: COVERS.successful },
      { title: "Business Hints", author: "Calhoun", variant: "sherlock", imageUrl: COVERS.business },
      { title: "Wealth", author: "Lloyd", variant: "crime", imageUrl: COVERS.wealth },
    ],
  },
  {
    slug: "science",
    name: "Космос и наука",
    desc: "Фламмарион, Верн, Пуанкаре, Эйнштейн",
    icon: Telescope,
    covers: [
      { title: "Астрономия", author: "Фламмарион", variant: "verne", imageUrl: COVERS.astronomy },
      { title: "Вокруг света", author: "Верн", variant: "verne", imageUrl: COVERS.verneWorld },
      { title: "20 000 лье", author: "Верн", variant: "sherlock", imageUrl: COVERS.verneSea },
      { title: "Science", author: "Пуанкаре", variant: "marcus", imageUrl: COVERS.method },
      { title: "Relativity", author: "Эйнштейн", variant: "hugo", imageUrl: COVERS.einstein },
      { title: "На Луну", author: "Верн", variant: "verne", imageUrl: COVERS.moon },
    ],
  },
  {
    slug: "uzbek-classics",
    name: "Узбекская классика",
    desc: "Навои, Бабур, поэзия и рукописи",
    icon: Star,
    covers: [
      { title: "Бабур-наме", author: "Бабур", variant: "babur", imageUrl: COVERS.babur },
      { title: "Хамса", author: "Навои", variant: "navai", imageUrl: COVERS.navai },
      { title: "Диван", author: "Навои", variant: "navai", imageUrl: COVERS.divan },
      { title: "Темур-наме", author: "Летопись", variant: "babur", imageUrl: COVERS.timur },
      { title: "Хамса", author: "Низами", variant: "navai", imageUrl: COVERS.khamsa },
      { title: "Поэзия", author: "Узбекская", variant: "franklin", imageUrl: COVERS.uzbekPoetry },
    ],
  },
];

export const MONTH_BOOKS: HomeBook[] = [
  HOME_CATEGORIES[0].covers[0],
  HOME_CATEGORIES[6].covers[0],
  HOME_CATEGORIES[7].covers[0],
  HOME_CATEGORIES[5].covers[0],
  HOME_CATEGORIES[3].covers[0],
];

export const EXCERPTS: ExcerptItem[] = [
  { ...HOME_CATEGORIES[0].covers[0], work: "Анна Каренина", slug: "anna-karenina", batch: "Русская классика", text: "Все счастливые семьи похожи друг на друга, каждая несчастливая семья несчастлива по-своему." },
  { ...HOME_CATEGORIES[0].covers[1], work: "Преступление и наказание", slug: "prestuplenie-i-nakazanie", batch: "Русская классика", text: "Он был задавлен бедностью; но стеснённое положение перестало в последнее время тяготить его." },
  { ...HOME_CATEGORIES[0].covers[2], work: "Война и мир", slug: "voyna-i-mir", batch: "Русская классика", text: "Князь Андрей смотрел на небо и думал, что всё земное казалось ему таким мелким." },
  { ...HOME_CATEGORIES[0].covers[3], work: "Мёртвые души", slug: "mertvye-dushi", batch: "Русская классика", text: "Какое-то странное чувство охватило его: и смех, и грусть были вместе." },
  { ...HOME_CATEGORIES[0].covers[5], work: "Евгений Онегин", slug: "evgeniy-onegin", batch: "Русская классика", text: "Мой дядя самых честных правил, когда не в шутку занемог..." },

  { ...HOME_CATEGORIES[1].covers[0], work: "Отверженные", slug: "les-miserables", batch: "Зарубежная классика", text: "Даже самая тёмная ночь однажды кончается, и восходит солнце." },
  { ...HOME_CATEGORIES[1].covers[1], work: "Pride and Prejudice", slug: "pride-and-prejudice", batch: "Зарубежная классика", text: "It is a truth universally acknowledged, that a single man in possession of a good fortune must be in want of a wife." },
  { ...HOME_CATEGORIES[1].covers[2], work: "Приключения Шерлока Холмса", slug: "sherlock-holmes", batch: "Зарубежная классика", text: "You see, but you do not observe. The distinction is clear." },
  { ...HOME_CATEGORIES[1].covers[3], work: "Повесть о двух городах", slug: "a-tale-of-two-cities", batch: "Зарубежная классика", text: "It was the best of times, it was the worst of times." },
  { ...HOME_CATEGORIES[1].covers[5], work: "Зов предков", slug: "call-of-the-wild", batch: "Зарубежная классика", text: "Старые инстинкты просыпались в нём, один за другим." },

  { ...HOME_CATEGORIES[2].covers[0], work: "Jane Eyre", slug: "jane-eyre", batch: "Романтика", text: "I am no bird; and no net ensnares me." },
  { ...HOME_CATEGORIES[2].covers[1], work: "Страдания юного Вертера", slug: "werther", batch: "Романтика", text: "Сердце моё полно, и всё вокруг кажется мне живым." },
  { ...HOME_CATEGORIES[2].covers[2], work: "The Tenant of Wildfell Hall", slug: "wildfell-hall", batch: "Романтика", text: "There is always a but in this imperfect world." },
  { ...HOME_CATEGORIES[2].covers[3], work: "Wuthering Heights", slug: "wuthering-heights", batch: "Романтика", text: "Whatever our souls are made of, his and mine are the same." },
  { ...HOME_CATEGORIES[2].covers[5], work: "Первая любовь", slug: "pervaya-lyubov", batch: "Романтика", text: "Первая любовь так же благоуханна, как первая весна." },

  { ...HOME_CATEGORIES[3].covers[0], work: "Размышления", slug: "meditations", batch: "Философия и характер", text: "Ты властен над своим умом, но не над внешними событиями." },
  { ...HOME_CATEGORIES[3].covers[1], work: "Письма к Луцилию", slug: "seneca-letters", batch: "Философия и характер", text: "Не тот беден, у кого мало, а тот, кто желает большего." },
  { ...HOME_CATEGORIES[3].covers[2], work: "Опыты", slug: "montaigne-essays", batch: "Философия и характер", text: "Самое великое дело на свете — уметь принадлежать себе." },
  { ...HOME_CATEGORIES[3].covers[3], work: "Так говорил Заратустра", slug: "zarathustra", batch: "Философия и характер", text: "Человек есть канат, натянутый между зверем и сверхчеловеком." },
  { ...HOME_CATEGORIES[3].covers[5], work: "Essays", slug: "emerson-essays", batch: "Философия и характер", text: "Trust thyself: every heart vibrates to that iron string." },

  { ...HOME_CATEGORIES[4].covers[0], work: "Self-Help", slug: "self-help", batch: "Саморазвитие, бизнес и наука", text: "Heaven helps those who help themselves." },
  { ...HOME_CATEGORIES[4].covers[1], work: "The Science of Getting Rich", slug: "science-of-getting-rich", batch: "Саморазвитие, бизнес и наука", text: "Мысль — единственная сила, способная создавать ощутимое богатство." },
  { ...HOME_CATEGORIES[5].covers[0], work: "Poor Richard", slug: "poor-richard", batch: "Саморазвитие, бизнес и наука", text: "Early to bed and early to rise makes a man healthy, wealthy, and wise." },
  { ...HOME_CATEGORIES[6].covers[0], work: "Популярная астрономия", slug: "popular-astronomy", batch: "Саморазвитие, бизнес и наука", text: "Небо было в звёздах, и каждая звезда казалась живой точкой огромного пространства." },
  { ...HOME_CATEGORIES[7].covers[0], work: "Бабур-наме", slug: "babur-name", batch: "Саморазвитие, бизнес и наука", text: "Мир странствий открывался перед ним как книга, где каждая страница была новой землёй." },
];
