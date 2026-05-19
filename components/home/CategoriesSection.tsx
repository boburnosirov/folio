"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BookOpen, Brain, Briefcase, Globe, Heart, Star, Telescope, TrendingUp } from "lucide-react";
import { BookCover, CoverVariant } from "./BookCover";

const IMG = {
  anna: "https://commons.wikimedia.org/wiki/Special:FilePath/AnnaKareninaTitle.jpg?width=700",
  crime: "https://commons.wikimedia.org/wiki/Special:FilePath/Cover_of_the_first_edition_of_Crime_and_Punishment.jpg?width=700",
  gogol: "https://commons.wikimedia.org/wiki/Special:FilePath/Dead_Souls_(novel)_Nikolai_Gogol_1842_title_page.jpg?width=700",
  chekhov: "https://commons.wikimedia.org/wiki/Special:FilePath/Chekhov_Detvora_cover.jpg?width=700",
  hugo: "https://commons.wikimedia.org/wiki/Special:FilePath/Les_miserables.jpg?width=700",
  austen: "https://commons.wikimedia.org/wiki/Special:FilePath/PrideAndPrejudiceTitlePage.jpg?width=700",
  sherlock: "https://commons.wikimedia.org/wiki/Special:FilePath/Adventures_of_sherlock_holmes.jpg?width=700",
  janeEyre: "https://commons.wikimedia.org/wiki/Special:FilePath/Jane_Eyre_title_page.jpg?width=700",
  werther: "https://commons.wikimedia.org/wiki/Special:FilePath/-1-_Die_Leiden_des_jungen_Werthers._Erstdruck.jpg?width=700",
  tenant: "https://commons.wikimedia.org/wiki/Special:FilePath/The_Tenant_of_Wildfell_Hall.jpg?width=700",
  meditations: "https://commons.wikimedia.org/wiki/Special:FilePath/MeditationsMarcusAurelius1811.jpg?width=700",
  seneca: "https://commons.wikimedia.org/wiki/Special:FilePath/Seneca_-_Lettere,_1802_(page_3_crop).jpg?width=700",
  montaigne: "https://commons.wikimedia.org/wiki/Special:FilePath/Montaigne_-_Essais,_Musart,_1847.djvu?width=700",
  selfHelp: "https://commons.wikimedia.org/wiki/Special:FilePath/Self-Help_-_Facing_page_108.png?width=700",
  rich: "https://commons.wikimedia.org/wiki/Special:FilePath/The_Science_of_Getting_Rich_-_title_frame.png?width=700",
  poorRichard: "https://commons.wikimedia.org/wiki/Special:FilePath/Poor_Richard.jpg?width=700",
  franklin: "https://commons.wikimedia.org/wiki/Special:FilePath/The_autobiography_of_Benjamin_Franklin_(1895)_(14804149143).jpg?width=700",
  verne: "https://commons.wikimedia.org/wiki/Special:FilePath/Verne_Tour_du_Monde.jpg?width=700",
  astronomy: "https://commons.wikimedia.org/wiki/Special:FilePath/AstronomiePopulaire1880.jpg?width=700",
  babur: "https://commons.wikimedia.org/wiki/Special:FilePath/Illuminated_Manuscript_Baburnamah.jpg?width=700",
  navai: "https://commons.wikimedia.org/wiki/Special:FilePath/Alisher_Navoi_-_Five_Poems_(Quintet)_-_Walters_W663_-_Top_Exterior.jpg?width=700",
};

type CategoryCover = {
  title: string;
  author: string;
  variant: CoverVariant;
  imageUrl: string;
};

const CATEGORIES: Array<{
  slug: string;
  name: string;
  desc: string;
  icon: typeof BookOpen;
  covers: CategoryCover[];
}> = [
  {
    slug: "russian-classics",
    name: "Художественная литература",
    desc: "Толстой, Достоевский, Чехов, Гоголь",
    icon: BookOpen,
    covers: [
      { title: "Анна Каренина", author: "Толстой", variant: "anna", imageUrl: IMG.anna },
      { title: "Преступление", author: "Достоевский", variant: "crime", imageUrl: IMG.crime },
      { title: "Детвора", author: "Чехов", variant: "chekhov", imageUrl: IMG.chekhov },
    ],
  },
  {
    slug: "world-classics",
    name: "Зарубежная классика",
    desc: "Гюго, Остин, Диккенс, Конан Дойл",
    icon: Globe,
    covers: [
      { title: "Отверженные", author: "Гюго", variant: "hugo", imageUrl: IMG.hugo },
      { title: "Гордость", author: "Остин", variant: "austen", imageUrl: IMG.austen },
      { title: "Шерлок", author: "Дойл", variant: "sherlock", imageUrl: IMG.sherlock },
    ],
  },
  {
    slug: "romance",
    name: "Романтика",
    desc: "Остин, Бронте, Гёте, Тургенев",
    icon: Heart,
    covers: [
      { title: "Jane Eyre", author: "Bronte", variant: "austen", imageUrl: IMG.janeEyre },
      { title: "Werther", author: "Goethe", variant: "hugo", imageUrl: IMG.werther },
      { title: "Wildfell Hall", author: "Bronte", variant: "austen", imageUrl: IMG.tenant },
    ],
  },
  {
    slug: "philosophy",
    name: "Философия и характер",
    desc: "Марк Аврелий, Сенека, Монтень",
    icon: Brain,
    covers: [
      { title: "Размышления", author: "Аврелий", variant: "marcus", imageUrl: IMG.meditations },
      { title: "Письма", author: "Сенека", variant: "franklin", imageUrl: IMG.seneca },
      { title: "Опыты", author: "Монтень", variant: "gogol", imageUrl: IMG.montaigne },
    ],
  },
  {
    slug: "self-development",
    name: "Саморазвитие",
    desc: "Смайлс, Уоттлз, классика успеха",
    icon: TrendingUp,
    covers: [
      { title: "Self-Help", author: "Smiles", variant: "franklin", imageUrl: IMG.selfHelp },
      { title: "The Science", author: "Wattles", variant: "verne", imageUrl: IMG.rich },
      { title: "Poor Richard", author: "Franklin", variant: "franklin", imageUrl: IMG.poorRichard },
    ],
  },
  {
    slug: "business-success",
    name: "Бизнес и успех",
    desc: "Франклин, Карнеги, эссе о деле",
    icon: Briefcase,
    covers: [
      { title: "Poor Richard", author: "Franklin", variant: "franklin", imageUrl: IMG.poorRichard },
      { title: "Автобиография", author: "Franklin", variant: "franklin", imageUrl: IMG.franklin },
      { title: "Self-Help", author: "Smiles", variant: "marcus", imageUrl: IMG.selfHelp },
    ],
  },
  {
    slug: "science",
    name: "Космос и наука",
    desc: "Фламмарион, Верн, Циолковский",
    icon: Telescope,
    covers: [
      { title: "Астрономия", author: "Фламмарион", variant: "verne", imageUrl: IMG.astronomy },
      { title: "Вокруг света", author: "Верн", variant: "verne", imageUrl: IMG.verne },
      { title: "20 000 лье", author: "Верн", variant: "sherlock", imageUrl: IMG.verne },
    ],
  },
  {
    slug: "uzbek-classics",
    name: "Узбекская классика",
    desc: "Навои, Бабур, Чулпан, Мукими",
    icon: Star,
    covers: [
      { title: "Бабур-наме", author: "Бабур", variant: "babur", imageUrl: IMG.babur },
      { title: "Хамса", author: "Навои", variant: "navai", imageUrl: IMG.navai },
      { title: "Диван", author: "Навои", variant: "navai", imageUrl: IMG.navai },
    ],
  },
];

function CategoryCard({ category, index, inView }: { category: (typeof CATEGORIES)[number]; index: number; inView: boolean }) {
  const Icon = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.55, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/categories/${category.slug}`} className="group block h-full">
        <div className="relative h-full overflow-hidden rounded-[24px] border border-black/6 bg-white/70 p-5 shadow-[0_18px_55px_rgba(0,0,0,.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_24px_70px_rgba(0,0,0,.1)] dark:border-white/10 dark:bg-white/[0.055] dark:hover:bg-white/[0.085]">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/[0.045] text-foreground dark:bg-white/10">
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-medium text-foreground/45">0{index + 1}</span>
          </div>

          <div className="relative mb-6 h-24">
            {category.covers.map((cover, coverIndex) => (
              <div
                key={`${category.slug}-${cover.title}-${coverIndex}`}
                className="absolute bottom-0 transition-transform duration-300 ease-out group-hover:translate-y-[-6px]"
                style={{
                  left: `calc(50% - 42px + ${coverIndex * 28}px)`,
                  zIndex: 3 - coverIndex,
                  transform: `rotate(${(coverIndex - 1) * 8}deg)`,
                }}
              >
                <BookCover {...cover} size="xs" className="shadow-xl shadow-black/15" />
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold leading-tight tracking-[-0.02em] text-foreground">{category.name}</h3>
          <p className="mt-2 min-h-10 text-sm leading-5 text-foreground/58 dark:text-white/58">{category.desc}</p>
        </div>
      </Link>
    </motion.div>
  );
}

export function CategoriesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.55 }}
          className="mb-12"
        >
          <p className="text-sm font-semibold text-[#0071e3] dark:text-primary">Разделы библиотеки</p>
          <h2 className="mt-2 max-w-2xl text-4xl font-semibold tracking-[-0.035em] text-foreground sm:text-6xl">
            Выберите настроение, не только жанр.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category, index) => (
            <CategoryCard key={category.slug} category={category} index={index} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
