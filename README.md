# Bucket

Bucket je jednoducha full-stack webova aplikace, ktera vam pomuze udrzet si prehled o vasich zivotnich snech a cilech. Slouzi jako takovy digitalni "bucket list". Muzete si sem zapisovat veci, ktere chcete zazit, radit si je do kategorii a sledovat svuj celkovy pokrok.

## Co aplikace umi

Aplikace ma nekolik zakladnich, ale uzitecnych funkci:
- Zapisovani a odskrtavani cilu.
- Tvorba vlastnich kategorii, kterym muzete priradit barvu a ikonku pro lepsi prehlednost.
- Vizualni zobrazeni vaseho pokroku pomoci kruhoveho grafu, ktery se prepocitava podle toho, kolik cilu mate hotovych.
- Filtrovani cilu podle vybranych kategorii.

Vsechna data se ukladaji na lokalni server do SQLite databaze, takze po vypnuti prohlizece o nic neprijdete.

## Pouzite technologie

Aplikace se sklada z frontendu a backendu.

Pro frontend (uzivatelske rozhrani) jsme pouzili:
- React 18 s TypeScriptem
- Vite pro rychle sestaveni a beh
- Vanilla CSS pro vzhled (s durazem na plynule animace)

Pro backend (ukladani dat) jsme pouzili:
- Node.js s frameworkem Express.js
- SQLite3 pro ukladani databaze do lokalniho souboru

## Jak aplikaci spustit u sebe

Pokud si chcete aplikaci spustit na svem pocitaci, staci dodrzet par kroku. Budete k tomu potrebovat nainstalovany Node.js.

1. Nejprve si stahnete repozitar a nainstalujte zavislosti.
   Otevrete terminal ve slozce s projektem a napiste:
   ```bash
   npm install
   ```

2. Spustte backendovy server.
   Backend se postara o praci s databazi. Zrustane bezet v tomto terminalu:
   ```bash
   node server/index.js
   ```

3. Spustte frontend.
   Otevrete si druhe (nove) okno terminalu ve stejne slozce a spustte samotnou webovou aplikaci:
   ```bash
   npm run dev
   ```

Pote uz jen otevrete webovy prohlizec a jdete na adresu http://localhost:5173/. Aplikace bude pripravena k pouziti. Pri prvnim spusteni se databaze sama zalozi a predvyplni zakladnimi kategoriemi.

## O projektu

Tento projekt slouzi jako jednoducha a funkcni ukazka toho, jak propojit React na frontendu s vlastnim Node.js API a databazi.
