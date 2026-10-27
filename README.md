# 🪣 Bucket

Bucket je moderní full-stack webová aplikace, která vám pomůže udržet si přehled o vašich životních snech a cílech. Slouží jako váš osobní digitální „bucket list“, kde si můžete plánovat cíle, dělit je na milníky, sledovat rozpočet a po jejich splnění si uchovávat vzpomínky s hodnocením a fotografiemi.

Aplikace využívá robustní backendovou architekturu **DAO** (Data Access Object) a **ABL** (Application Business Logic) a čistý reaktivní frontend v Reactu a TypeScriptu.

---

## 🌟 Klíčové funkce

### 1. 🎯 Správa cílů & Pokročilé plánování
- **Termíny & Deadline:** Inteligentní odpočet zbývajících dní, zvýraznění dnešních a prošlých termínů.
- **Priority:** Možnost označit cíl hvězdičkou (⭐) a posunout ho do popředí.
- **Dílčí kroky & Milníky (Checklist):** Každý cíl lze rozdělit na menší podúkoly s vlastním procentuálním ukazatelem postupu.
- **Předpokládaný rozpočet (`budget`):** Odhad finanční náročnosti cílů.
- **Inline editace:** Rychlá úprava názvu, kategorie, termínu, rozpočtu i poznámek přímo na kartě cíle.

### 2. 👁️ 3 režimy zobrazení
- **📋 Klasický seznam (List View):** Přehledný, kompaktní seznam se všemi detaily.
- **🖼️ Vizuální nástěnka (Vision Board Mode):** Mřížka karet s dominantními fotografiemi pro vizuální inspiraci.
- **⏱️ Časová osa úspěchů (Timeline View):** Chronologická časová osa všech vašich splněných snů seskupená podle roků, doplněná o fotografie, datum splnění, hodnocení a vzpomínky.

### 3. 📖 Deník vzpomínek & Osobní reflexe
- Po splnění cíle vystřelí slavnostní konfetový ohňostroj.
- Možnost zapsat si zážitek do deníku: hodnocení (1–5 ⭐), místo splnění a osobní reflexe (*„Jaké to bylo? Na co nikdy nezapomenete?“*).

### 4. 💡 Knihovna inspirace
- Katalog nápadů a životních snů rozdělených do kategorií (Cestování, Zážitky, Vzdělávání, Kariéra, Rodina).
- Přidání vybraného snu jedním kliknutím včetně předpřipravených dílčích kroků a fotografií.

### 5. 📊 Statistiky & Finanční analýza
- Celková úspěšnost a poměr splněných cílů.
- Rozpad pokroku podle jednotlivých kategorií s barevnými progress bary.
- Finanční přehled: částka již proinvestovaná do splněných zážitků vs. plánovaný rozpočet na budoucí aktivní sny.

### 6. 💾 Zálohování a Obnova dat (JSON)
- Export kompletní databáze do přenosného souboru `.json`.
- Obnova ze souboru s možností data nahradit nebo sloučit.

### 7. 🌓 Tmavý / Světlý režim & Tiskový režim
- Přepínač Dark / Light mode s automatickým ukládáním do `localStorage`.
- Speciální tiskové styly (`@media print`) pro čistý tisk bucket listu na papír nebo do PDF.

---

## 🛠️ Použité technologie

- **Frontend:**
  - **React 19** & **TypeScript**
  - **Vite** (bleskový vývoj a build)
  - **Vanilla CSS** (designový systém s CSS proměnnými, plná podpora Dark/Light módu a Vision Boardu)
  - **Lucide React** (sada moderních ikon)
  - **canvas-confetti** (oslavné animace)

- **Backend:**
  - **Node.js & Express.js** (REST API)
  - **SQLite3** (lokální souborová databáze s automatickými migracemi)
  - **DAO & ABL Architektura** (čisté oddělení byznys logiky a databáze)
  - **Validátor vstupů** (striktní validace `dtoIn` a strukturovaný error handling)

---

## 🚀 Jak aplikaci spustit lokálně

Pro spuštění potřebujete mít nainstalovaný **Node.js** (v18+).

1. **Klonování repozitáře a instalace závislostí:**
   ```bash
   git clone https://github.com/Andreyy05/Bucket.git
   cd Bucket
   npm install
   ```

2. **Spuštění backend serveru:**
   ```bash
   npm run server
   ```
   *Backend běží na `http://localhost:3000`.*

3. **Spuštění frontendu:**
   V novém okně terminálu spusťte:
   ```bash
   npm run dev
   ```
   *Aplikace se otevře v prohlížeči na adrese `http://localhost:5173`.*

---

## 📄 Licence

Tento projekt je open-source pod licencí MIT.
