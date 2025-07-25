import RomanianJson from "@/bibles/ro.json";
import NorskJson from "@/bibles/no.json";
import EnglishJson from "@/bibles/en.json";
import ChaptersJson from "@/bibles/book_chapter_counts.json";
import AvailableJson from "@/bibles/available.json"
import { useStore } from "@/store";

type BibleJson = {
  books: {
    name: string;
    chapters: {
      chapter: number;
      name: string;
      verses: string[];
    }[];
  }[];
};

type BookChapterCounts = {
  [lang: string]: {
    book: string;
    chapters: number;
  }[];
};

type AvailableType = [
  {
    lang: string,
    path: string,
    title: string,
    copyright: string
  }
]

const Romanian = RomanianJson as BibleJson;
const Norsk = NorskJson as BibleJson;
const English = EnglishJson as BibleJson;
const Chapters = ChaptersJson as BookChapterCounts;
const Available = AvailableJson as AvailableType;

export function useChapters() {
  const { firstLang, selectedBook, selectedChapter, selectedHighlightVerse, selectedLang } = useStore();

  function getChapterName(lang?: string, book?: number, chapter?: number) {
    const l = lang ?? selectedLang.value;
    switch (l) {
      case "no":
        return Norsk.books[book ?? selectedBook.value]?.chapters[chapter ?? selectedChapter.value]?.name || '';
      case "ro":
        return Romanian.books[book ?? selectedBook.value]?.chapters[chapter ?? selectedChapter.value]?.name || '';
      case "en":
        return English.books[book ?? selectedBook.value]?.chapters[chapter ?? selectedChapter.value]?.name || '';
      default:
        return "";
    }
  }

  function nextChapter() {
    const booksLen = Chapters[firstLang.value].length;
    const chapterLen = Chapters[firstLang.value][selectedBook.value].chapters;
  
    let nextChapter = selectedChapter.value + 1;
  
    if (nextChapter >= chapterLen) {
      if (selectedBook.value < booksLen - 1) {
        selectedBook.value += 1;
        selectedChapter.value = 0;
      } else {
        selectedChapter.value = chapterLen - 1;
      }
    } else {
      selectedChapter.value = nextChapter;
    }

    scrollToTop();
  }
  
  function previousChapter() {
    let prevChapter = selectedChapter.value - 1;
  
    if (prevChapter < 0) {
      if (selectedBook.value > 0) {
        selectedBook.value -= 1;
        const prevBookChapterLen = Chapters[firstLang.value][selectedBook.value].chapters;
        selectedChapter.value = prevBookChapterLen - 1;
      } else {
        selectedChapter.value = 0;
      }
    } else {
      selectedChapter.value = prevChapter;
    }

    scrollToTop();
  }
  
  function getVerses(lang: string) {
    switch (lang) {
      case "no":
        return Norsk.books[selectedBook.value]?.chapters[selectedChapter.value]?.verses || [];
      case "ro":
        return Romanian.books[selectedBook.value]?.chapters[selectedChapter.value]?.verses || [];
      case "en":
        return English.books[selectedBook.value]?.chapters[selectedChapter.value]?.verses || [];
      default:
        return "";
    }
  }
  
  function getVersesLen() {
    switch (firstLang.value) {
      case "no":
        return Norsk.books[selectedBook.value]?.chapters[selectedChapter.value]?.verses.length || 0;
      case "ro":
        return Romanian.books[selectedBook.value]?.chapters[selectedChapter.value]?.verses.length || 0;
      case "en":
        return Romanian.books[selectedBook.value]?.chapters[selectedChapter.value]?.verses.length || 0;
      default:
        return 0;
    }
  }
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function getDisclaimer(lang: string) {
    const found = Available.find(b => b.lang === lang);
    return found ? found.copyright : "";
  }
  
  function getVerse(lang?: string, book?: number, chapter?: number, verse?: number) {
    const l = lang ?? selectedLang.value;
    switch (l) {
      case "no":
        return Norsk.books[book ?? selectedBook.value]?.chapters[chapter ?? selectedChapter.value]?.verses[verse ?? selectedHighlightVerse.value] || '';
      case "ro":
        return Romanian.books[book ?? selectedBook.value]?.chapters[chapter ?? selectedChapter.value]?.verses[verse ?? selectedHighlightVerse.value] || '';
      case "en":
        return English.books[book ?? selectedBook.value]?.chapters[chapter ?? selectedChapter.value]?.verses[verse ?? selectedHighlightVerse.value] || '';
      default:
        return "";
    }
  }
  
  return {
    getChapterName,
    nextChapter,
    previousChapter,
    getVerses,
    getDisclaimer,
    getVersesLen,
    getVerse
  };
}

export const highlightColor = [
  'transparent',
  'var(--h-c-1)',
  'var(--h-c-2)',
  'var(--h-c-3)',
  'var(--h-c-4)',
  'var(--h-c-5)',
  'var(--h-c-6)',
  'var(--h-c-7)'
];

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (diffMs < hour) {
    const mins = Math.floor(diffMs / minute);
    return mins ? `${mins} min ago` : 'now';
  } else if (diffMs < day) {
    const hrs = Math.floor(diffMs / hour);
    return `${hrs} h ago`;
  } else if (diffMs < week) {
    const days = Math.floor(diffMs / day);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (diffMs < month) {
    const weeks = Math.floor(diffMs / week);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (diffMs < year) {
    const months = Math.floor(diffMs / month);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffMs / year);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
}

const b58 = '7GFrpLHhKbtfqY2AQiDj6kEvUn1zdXJ3VT9BMNsWCoSa58wRemc4gPZxuy';

export function encodeCBase58(book: number, chapter: number, verse: number): string {
  const b = 100 + book;
  const c = 1000 + chapter;
  const v = 1000 + verse;

  let f = b * 100000000 + c * 10000 + v;

  let encoded = "";
  while (f > 0) {
    const rem = f % 58;
    f = Math.floor(f / 58);
    encoded = b58[rem] + encoded;
  }

  return encoded;
}

export function decodeCBase58(encoded: string): { book: number; chapter: number; verse: number } {
  let num = 0;

  for (let i = 0; i < encoded.length; i++) {
    const index = b58.indexOf(encoded[i]);
    if (index === -1) {
      throw new Error(`Invalid Base58 character: ${encoded[i]}`);
    }
    num = num * 58 + index;
  }

  const v = num % 10000;
  num = Math.floor(num / 10000);

  const c = num % 10000;
  num = Math.floor(num / 10000);

  const b = num;

  return {
    book: b - 100,
    chapter: c - 1000,
    verse: v - 1000,
  };
}

export function share(title: string, text: string, url: string) {
  if (navigator.share) {
    navigator.share({
      title,
      text,
      url
    })
  } else {
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copied to clipboard!");
    })
  }
}