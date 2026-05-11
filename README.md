# Madhu Rekha Billing Software - Frontend

Website live: https://madhu-rekha-billing-software-fronte.vercel.app/

# React + Vite
A React + Vite frontend for the Madhu Rekha Billing Software application. Built with modern React practices and Vite for fast development and optimized builds.

## Project Structure

```
Frontend/
├── .env                       # Environment variables
├── .gitignore                 # Git ignore file
├── index.html                 # HTML entry point
├── package.json               # Project dependencies and scripts
├── vite.config.js             # Vite configuration
├── eslint.config.js           # ESLint configuration
├── vercel.json                # Vercel deployment configuration
├── PROJECT_STRUCTURE.md       # Detailed project structure documentation
├── README.md                  # This file
├── public/                    # Static assets served directly
└── src/
    ├── main.jsx               # Application entry point
    ├── App.jsx                # Root React component
    ├── App.css                # Global application styles
    ├── index.css              # Global CSS styles
    ├── assets/                # Images, icons, and media files
    ├── components/
    │   ├── layout/
    │   │   ├── Sidebar.jsx    # Navigation sidebar component
    │   │   └── Topbar.jsx     # Top navigation bar component
    │   └── ui/
    │       ├── Button.jsx     # Reusable button component
    │       ├── Card.jsx       # Reusable card component
    │       └── Input.jsx      # Reusable input component
    ├── layout/
    │   └── MainLayout.jsx     # Main layout wrapper component
    ├── lib/
    │   └── api.js             # API client and request utilities
    └── pages/
        ├── Dashboard.jsx      # Dashboard page
        ├── Patients.jsx       # Patients list page
        ├── Profile.jsx        # User profile page
        ├── BillsList.jsx      # Bills list page
        ├── BillDetail.jsx     # Bill detail view page
        ├── CreateBill.jsx     # Create new bill page
        ├── EditBill.jsx       # Edit existing bill page
        ├── EditPayment.jsx    # Edit payment information page
        └── EditRefund.jsx     # Edit refund information page
```

## Features

- **React 18** with Vite for fast HMR (Hot Module Replacement)
- **Component-based Architecture** with reusable UI components
- **API Integration** via centralized API client
- **Responsive Layout** with Sidebar and Topbar navigation
- **Multiple Pages** for billing, patient management, and profiles
- **ESLint Configuration** for code quality
- **Vercel Deployment** ready

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

This will start the development server with HMR enabled.

## Building for Production

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Environment Configuration

Create a `.env` file in the project root and add necessary environment variables:

```
VITE_API_BASE_URL=http://localhost:5000
```

## Deployment

The project is configured for Vercel deployment. Simply push to your Git repository and Vercel will automatically build and deploy.

## Technology Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **ESLint** - Code linting
- **CSS** - Styling
