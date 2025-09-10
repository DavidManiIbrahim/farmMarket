🌱 Rural Grow Connect

A marketplace platform connecting rural farmers with buyers, facilitating direct trade of agricultural products.

1. Overview

Rural Grow Connect is a full-featured e-commerce platform designed to empower farmers and streamline agricultural product distribution. The platform supports multiple user roles, secure transactions, and real-time inventory management.

2. Features
👩‍🌾 For Farmers

Add and manage products (name, description, price, stock, etc.)

Upload product images (JPEG, PNG, WebP, GIF – up to 5MB)

Edit product details via intuitive dialogs

Toggle product availability

Track inventory levels

Manage organic certification

🛒 For Buyers

Browse and discover products

Filter and search functionality

Add items to cart

Secure checkout with Stripe

Track orders and view purchase history

🛠️ For Administrators

User management

Product and category oversight

System monitoring

🌍 General Features

Authentication & Authorization

Secure login

Role-based access control

Protected routes

Secure file uploads

User Interface

Responsive design

Modern UI components

Real-time updates

Toast notifications

Form validation & loading states

3. Technical Stack
Frontend

Framework: React (TypeScript)

Build Tool: Vite

UI Components: shadcn/ui

Styling: Tailwind CSS

State Management: React Context

Data Fetching: TanStack Query

Forms: React Hook Form

Routing: React Router DOM

Backend

Database & Auth: Supabase

PostgreSQL database

Row Level Security (RLS)

Storage buckets for images

Real-time subscriptions

Payment Processing: Stripe

Key Dependencies

date-fns: Date manipulation

lucide-react: Icon system

zod: Schema validation

clsx / tailwind-merge: Utility styling

4. Architecture
Database Structure

Users: Authentication handled by Supabase

Products

Categories

Orders

Cart Items

Storage Buckets

product-images

Public bucket for product images

5MB file size limit

Supports JPEG, PNG, WebP, GIF

User-specific folders with RLS

Security

Row Level Security (RLS) policies

Role-based access control

Secure file uploads

Protected API routes

5. Getting Started
Prerequisites

Node.js 16+

npm or yarn

Supabase account

Stripe account

Environment Setup

Clone the repository

git clone https://github.com/DavidManiIbrahim/rural-grow-connect.git
cd rural-grow-connect


Install dependencies

npm install


Create a .env file with:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key


Run database migrations

npm run supabase:migration:up


Start the dev server

npm run dev

Supabase Setup

Create a new Supabase project

Run migrations from supabase/migrations

Set up storage buckets:

Create product-images bucket

Enable RLS policies

Stripe Setup

Create a Stripe account

Configure webhook endpoints

Set up product prices

Add Stripe keys to environment variables

6. Deployment
Frontend Deployment

Build the project

npm run build


Deploy the dist folder to your hosting provider

Backend Deployment

Push Supabase migrations

npm run supabase:migration:up


Configure environment variables on your hosting platform

7. Contributing

Fork the repository

Create a new branch

Make your changes

Submit a pull request

8. License

This project is licensed under the MIT License – see the LICENSE
 file for details.