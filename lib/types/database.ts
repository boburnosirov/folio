export type BookLanguage = "ru" | "en" | "uz" | "fr" | "de" | "other";

export interface Category {
  slug: string;
  name: string;
  description: string | null;
  icon_name: string;
  display_order: number;
}

export interface Author {
  id: number;
  name: string;
  name_ru: string | null;
  born_year: number | null;
  died_year: number | null;
  nationality: string | null;
  bio: string | null;
  created_at: string;
}

export interface Book {
  id: number;
  slug: string;
  title: string;
  title_ru: string | null;
  author_id: number | null;
  category_slug: string | null;
  language: BookLanguage;
  year_published: number | null;
  description: string | null;
  cover_url: string | null;
  epub_url: string | null;
  pdf_url: string | null;
  txt_url: string | null;
  gutenberg_id: number | null;
  is_featured: boolean;
  is_public: boolean;
  read_count: number;
  download_count: number;
  created_at: string;
  // New fields (migration 006)
  companion_slug: string | null;
  avg_rating: number;
  rating_count: number;
  weekly_read_count: number;
  monthly_read_count: number;
}

export interface BookRating {
  id: number;
  user_id: string;
  book_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface UserFavorite {
  user_id: string;
  book_id: number;
  created_at: string;
}

export interface UserReadLater {
  user_id: string;
  book_id: number;
  created_at: string;
}

export interface BookWithAuthor extends Book {
  authors: Author | null;
}

export interface BookWithCategory extends Book {
  categories: Category | null;
}

export interface BookFull extends Book {
  authors: Author | null;
  categories: Category | null;
}

export interface ReadingProgress {
  user_id: string;
  book_id: number;
  position: string;
  updated_at: string;
}

export interface UserBookmark {
  user_id: string;
  book_id: number;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: Omit<Category, never>;
        Update: Partial<Category>;
      };
      authors: {
        Row: Author;
        Insert: Omit<Author, "id" | "created_at">;
        Update: Partial<Omit<Author, "id" | "created_at">>;
      };
      books: {
        Row: Book;
        Insert: Omit<Book, "id" | "read_count" | "download_count" | "avg_rating" | "rating_count" | "weekly_read_count" | "monthly_read_count" | "created_at">;
        Update: Partial<Omit<Book, "id" | "created_at">>;
      };
      book_ratings: {
        Row: BookRating;
        Insert: Omit<BookRating, "id" | "created_at">;
        Update: Partial<Omit<BookRating, "id" | "user_id" | "book_id" | "created_at">>;
      };
      user_favorites: {
        Row: UserFavorite;
        Insert: UserFavorite;
        Update: never;
      };
      user_read_later: {
        Row: UserReadLater;
        Insert: UserReadLater;
        Update: never;
      };
      reading_progress: {
        Row: ReadingProgress;
        Insert: ReadingProgress;
        Update: Partial<ReadingProgress>;
      };
      user_bookmarks: {
        Row: UserBookmark;
        Insert: UserBookmark;
        Update: never;
      };
    };
    Functions: {
      search_books: {
        Args: { query: string };
        Returns: Book[];
      };
    };
  };
};
