README - INSTRUCTIUNI DE SETUP SI RULARE PROIECT

1. Descriere generala
Acesta este un proiect full-stack format din doua aplicatii:
- Server (backend) – Node.js + Express + Sequelize + JWT
- Client (frontend) – React + Redux Toolkit + TailwindCSS

Proiectul gestioneaza utilizatori, produse, cosul de cumparaturi (cart) si comenzile (orders).

2. Prerechizite necesare
Pentru a rula proiectul este necesar:
- Node.js (versiunea recomandata: 19+)
- NPM
- MySQL sau PostgreSQL (conform configuratiei Sequelize)
- Git (optional, pentru clonare)

3. Descarcarea proiectului
Daca proiectul este pe GitHub:
    git clone <link-repo>
    cd <folder-proiect>

4. Instalarea dependintelor

Backend (Server):
    cd Server
    npm install

Frontend (Client):
    cd ../Client
    npm install

5. Crearea fisierelor .env

Server/.env:
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=parola_ta
DB_NAME=numele_bazei
DB_PORT=3306
JWT_SECRET=cheie_secreta

Client/.env:
VITE_API_URL=http://localhost:3000

6. Setarea bazei de date:
- Creeaza baza de date in MySQL/PostgreSQL.
- Configureaza .env cu datele corecte.
- Sequelize va crea tabelele automat daca sync este activ.

7. Pornirea proiectului

Backend:
    cd Server
    npm run dev

Frontend:
    cd Client
    npm run dev

8. Functionalitati:
- Login/Register
- Produse + CRUD admin
- Cart
- Checkout
- Orders pentru user si admin
- Filtrare si status badge

9. Testare cu Postman:
- Login -> primesti JWT token
- Foloseste tokenul la rutele protejate (Authorization: Bearer)

10. Final
Dupa configurarea .env, instalarea dependintelor si setarea bazei de date, proiectul este complet functional.
