export interface IdeaItem {
  id: string;
  title: string;
  categoryName: string;
  notes: string;
  imageUrl?: string;
  subtasks?: string[];
}

export const INSPIRATION_IDEAS: IdeaItem[] = [
  // Cestování
  {
    id: 'idea-1',
    title: 'Vidět polární záři (Aurora Borealis)',
    categoryName: 'Cestování',
    notes: 'Ideální lokace: Norsko (Tromsø) nebo Island od listopadu do března.',
    imageUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80',
    subtasks: ['Sledovat předpověď sluneční aktivity', 'Vybrat ubytování se skleněnou střechou', 'Připravit stativ na foťák']
  },
  {
    id: 'idea-2',
    title: 'Projít historickou stezku Machu Picchu',
    categoryName: 'Cestování',
    notes: 'Incká stezka v Peru ve výšce přes 2400 m n. m.',
    imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80',
    subtasks: ['Rezervovat povolení 6 měsíců předem', 'Fyzická příprava na vysokohorskou túru', 'Navštívit Cusco']
  },
  {
    id: 'idea-3',
    title: 'Přejet legendární Route 66 v kabrioletu',
    categoryName: 'Cestování',
    notes: 'Silniční výlet z Chicaga do Santa Monicy (cca 3 940 km).',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    subtasks: ['Půjčit retro auto', 'Sestavit playlist na road trip', 'Zastavit se u Grand Canyonu']
  },

  // Zážitky
  {
    id: 'idea-4',
    title: 'Skočit tandemový seskok padákem',
    categoryName: 'Zážitky',
    notes: 'Volný pád z výšky 4 000 metrů s rychlostí přes 200 km/h!',
    imageUrl: 'https://images.unsplash.com/photo-1521673845931-7b0fb2a78dd9?auto=format&fit=crop&w=800&q=80',
    subtasks: ['Najít certifikované letiště', 'Objednat videozáznam ze seskoku', 'Překonat strach']
  },
  {
    id: 'idea-5',
    title: 'Letět horkovzdušným balónem při východu slunce',
    categoryName: 'Zážitky',
    notes: 'Kappadokie (Turecko) nebo nad českými hrady a zámky.',
    imageUrl: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=800&q=80',
    subtasks: ['Brzké vstávání v 5:00 ráno', 'Připravit fotoaparát', 'Tradiční křest prvoletců šampaňským']
  },
  {
    id: 'idea-6',
    title: 'Potápět se na korálovém útesu',
    categoryName: 'Zážitky',
    notes: 'Velký bariérový útes nebo Rudé moře.',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    subtasks: ['Udělat si potápěčský kurz PADI', 'Pozorovat mořské želvy', 'Koupit podvodní pouzdro na mobil']
  },

  // Vzdělávání & Seberozvoj
  {
    id: 'idea-7',
    title: 'Naučit se nový cizí jazyk na konverzační úroveň',
    categoryName: 'Vzdělávání',
    notes: 'Např. španělština, italština nebo japonština.',
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    subtasks: ['15 minut denně v Duolingu', 'Najít rodilého mluvčího na tandem', 'Přečíst první knihu v originále']
  },
  {
    id: 'idea-8',
    title: 'Naučit se hrát oblíbenou písničku na kytaru / klavír',
    categoryName: 'Vzdělávání',
    notes: 'Zvládnout zahrát a zazpívat u táboráku nebo doma.',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    subtasks: ['Naučit se základní akordy (C, G, Am, F)', 'Každodenní cvičení 20 minut', 'Zahrát celou píseň bez přerušení']
  },
  {
    id: 'idea-9',
    title: 'Přečíst 25 inspirativních knih za jeden rok',
    categoryName: 'Vzdělávání',
    notes: 'Knihy o osobním růstu, vědě a beletrii.',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    subtasks: ['Založit si seznam na Goodreads', 'Číst alespoň 20 stránek před spaním', 'Dělat si výpisky z klíčových myšlenek']
  },

  // Kariéra & Projekty
  {
    id: 'idea-10',
    title: 'Vytvořit a spustit vlastní projekt / aplikaci',
    categoryName: 'Kariéra',
    notes: 'Nápad přeměněný v reálný produkt, který pomáhá lidem.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    subtasks: ['Definovat MVP', 'Vytvořit funkční prototyp', 'Získat prvních 10 uživatelů']
  },

  // Rodina & Přátelé
  {
    id: 'idea-11',
    title: 'Vzít rodiče na jejich vysněnou dovolenou',
    categoryName: 'Rodina',
    notes: 'Poděkování rodičům za vše, co pro nás udělali.',
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80',
    subtasks: ['Nenápadně zjistit jejich vysněnou destinaci', 'Zajistit pohodlnou dopravu a ubytování', 'Užít si společný čas bez spěchu']
  },
  {
    id: 'idea-12',
    title: 'Vytvořit velkou rodinnou kroniku a fotoknihu',
    categoryName: 'Rodina',
    notes: 'Zaznamenat příběhy prarodičů a staré rodinné fotografie pro další generace.',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    subtasks: ['Nahrát rozhovory s prarodiči', 'Naskenovat stará fotoalba', 'Vytisknout vázanou fotoknihu']
  }
];
