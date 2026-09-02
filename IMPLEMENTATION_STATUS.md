# IMPLEMENTATION_STATUS.md
# Atlantic Pest Control - Sažetak implementacijskog statusa

> **Pregled**: Ovaj dokument pruža brz i jasan uvid u stvarno stanje implementacije sustava Atlantic Pest Control za potrebe vanjske revizije.

---

## 1. Funkcionalno
- **Interaktivni digitalni tlocrt (Floor Plan)**: SVG renderiranje, dinamičko zumiranje, pomicanje (pan), full-screen mod, prikaz pozicija uređaja, klik-za-pregled i dinamičke toplinske karte gustoće ulova (heatmaps).
- **Registar uređaja (Device Register)**: Filtriranje po zoni, tipu uređaja, barkodu, statusu, generiranje pojedinačnih QR kodova i priprema tabaka za skupni ispis naljepnica.
- **Evidencija terenskih pregleda (Point Inspections)**: Unos stanja uređaja, ulova po vrstama štetnika (glodavci, moljci, muhe, bube), postotka potrošnje mamca, higijenskog stanja i zamjene ljepljivih ploča.
- **Nadzor pragova (Threshold Engine)**: Automatska evaluacija ulova u odnosu na pragove upozorenja i kritične pragove prema HACCP zoni osjetljivosti, uz automatsko generiranje Nalaza i CAPA naloga.
- **Korektivne mjere (CAPA) s podjelom dužnosti (Segregation of Duties)**: Životni ciklus mjere: unos -> 5-Zašto (5-Whys) analiza uzroka -> provedba od strane zadužene osobe -> obvezna neovisna verifikacija QA voditelja -> ponovno otvaranje u slučaju neučinkovitosti.
- **Upravljanje DDD izvođačima**: Registar vanjskih partnera, evidencija licenci tehničara i sanitarnih iskaznica, automatski izračun KPI indeksa (točnost obilaska, cjelovitost pregleda, brzina odziva).
- **Registar biocida i sigurnosnih listova (STL)**: Praćenje aktivnih tvari, CAS/ECHA brojeva, antidota, datuma isteka sigurnosno-tehničkih listova (STL/MSDS) s vizualnim upozorenjima.
- **Generiranje revizijskih paketa i izvoza**: Izrada cjelovitog PDF audit paketa prilagođenog zahtjevima IFS Food v8 / ISO 22000 normi (putem `jspdf`) te izvoz sirovih podataka u Excel (`xlsx`).
- **Revizijski trag (Audit Trail)**: Neizmjenjivi zapis svih akcija u sustavu (korisnik, uloga, tip akcije, prethodna/nova vrijednost, razlog promjene).
- **Bento Grid korisničko sučelje**: Responzivni tamni dizajn s visokim kontrastom, optimiziran za operativnu upotrebu na terenu i u uredu.
- **Hrvatska lokalizacija**: 100% terminologija usklađena s hrvatskom praksom zaštite hrane i DDD struke.

---

## 2. Djelomično funkcionalno
- **Terensko skeniranje QR kodova**: Dostupno simulacijsko i testno skeniranje putem sučelja modala s kamerom; rad u sandbox pregledniku koristi integrirani testni generator QR očitavanja.
- **Izvanmrežni rad (Offline)**: Podaci o trenutnom stanju i inspekcijama čuvaju se unutar `localStorage` preglednika, no puni Service Worker PWA Background Sync još nije integriran.
- **Korisničke uloge (RBAC)**: Implementiran radni izmjenjivač uloga (6 uloga) koji kontrolira vidljivost i akcije na klijentu; potrebna je dodatna verifikacija na razini API tokena.

---

## 3. Samo UI
- **Povezivanje s IoT senzorima**: Prikaz elektronskih monitora i statusa baterije/signala na tlocrtu je definiran kroz modele, no nema aktivnog MQTT/Webhook prihvata živih telemetrijskih podataka.
- **Upravljanje tlocrtnim verzijama (CAD uvoz)**: Podržan je uvoz SVG i slikovnih podloga, dok je povijesno arhiviranje starih CAD slojeva pripremljeno na razini modela.

---

## 4. Mock podaci
- **Perzistencija u bazi**: Trenutna verzija koristi robusni klijentski Zustand/React Context store inicijaliziran realističnim sintetičkim podacima (`initialData.ts`) umjesto aktivne PostgreSQL / Cloud SQL veze.
- **Slanje stvarnih email / SMS obavijesti**: Obavijesti se generiraju i prikazuju u aplikacijskom centru obavijesti (in-app), bez vanjskog SMTP/SendGrid poslužitelja.

---

## 5. Nije implementirano
- **SAML / Azure AD SSO integracija**: Prijavljivanje koristi lokalnu simulaciju uloga umjesto korporativnog federiranog sustava identifikacije.
- **Automatsko prepoznavanje štetnika računalnim vidom (AI Vision)**: Predviđeno za buduću fazu; trenutno tehničar ručno unosi broj i vrstu uočenih štetnika.

---

## 6. Poznati bugovi i ograničenja
- **Reset stanja pri brisanju predmemorije**: Budući da se stanje perzistira u klijentskom `localStorage`, čišćenje privremenih podataka preglednika vraća aplikaciju na inicijalni skup podataka.
- **Prikaz koordinata pri ekstremnom skaliranju**: Na izrazito nestandardnim omjerima stranica digitalnog tlocrta, pozicije točaka zahtijevaju fiksni `viewBox` omjer.

---

## 7. Sigurnosni rizici
- **Klijentska autorizacija**: Prava pristupa trenutno se provjeravaju na razini React komponenata. Za produkcijsku fazu nužna je obvezna autorizacija svakog zahtjeva na Express/PostgreSQL API poslužitelju.
- **Odsutnost šifriranja u lokalnoj pohrani**: Podaci u `localStorage` nisu kriptirani, što je prihvatljivo za prototip, ali zahtijeva prijelaz na sigurne HTTP-only kolačiće i backend sesije.

---

## 8. Sljedeći prioriteti (Roadmap)
1. **P0 (Kritično)**: Spajanje Express poslužitelja (`server.ts`) na relacijsku bazu (PostgreSQL / Cloud SQL) i migracija shema.
2. **P0 (Kritično)**: Implementacija JWT / OAuth2 autentikacije s obveznom backend provjerom prava pristupa i Segregation of Duties pravila.
3. **P1 (Visoki prioritet)**: Integracija PWA Service Workera za robustan rad u podrumskim prostorijama bez signala i naknadnu sinkronizaciju.
4. **P2 (Srednji prioritet)**: Automatizirano slanje email izvještaja i upozorenja voditeljima pogona putem SMTP servisa.
