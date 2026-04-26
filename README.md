# BarberClick

BarberClick is a barber appointment booking app. Customers book as guests by selecting a barber, service, and available time slot. Barbers log in to an admin panel to manage their available appointment times.

## Stack

- Frontend: React, Bootstrap, axios
- Backend: Express
- Database: Supabase

## Setup

Install dependencies in both apps:

```bash
cd server
npm install

cd ../client
npm install
```

Create environment files from the examples:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Required server variables:

```env
PORT=5001
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SEED_BARBER_EMAIL=owner@example.com
SEED_BARBER_PASSWORD=change-this-password
```

`SUPABASE_SERVICE_ROLE_KEY` is required for server-side admin writes such as adding and deleting barber time slots. Do not expose it in the frontend.

Run the apps:

```bash
cd server
node index.js

cd ../client
npm start
```

Seed real starter data after configuring `server/.env`:

```bash
cd server
npm run seed:real
```

## Tests

```bash
cd server
npm test

cd ../client
CI=true npm test -- --watchAll=false
```
