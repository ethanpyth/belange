export interface LiteraryExtract {
  id: string;
  chapter: string;
  title: string;
  subtitle: string;
  illustrationUrl: string;
  quote: string;
  textFr: string[];
  textEn: string[];
  theme: {
    primary: string;
    accent: string;
    bgColor: string;
  };
}

export interface Quote {
  id: string;
  textFr: string;
  textEn: string;
  contextFr: string;
  contextEn: string;
}

export interface StarQuote {
  id: string;
  x: number; // percentage
  y: number; // percentage
  size: number; // pixels
  delay: number; // animation delay
  quote: Quote;
}
