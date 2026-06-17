# VANI

## Voice Command Based E-Commerce Platform

VANI is a voice-enabled e-commerce platform that allows users to search products, apply filters, manage their cart, and navigate the application using natural language voice commands.

The platform combines speech recognition, natural language understanding, and e-commerce functionality to create a hands-free shopping experience.

---

# Project Overview

Traditional e-commerce websites require users to manually search for products, apply filters, navigate pages, and complete checkout using multiple clicks.

VANI simplifies this process by allowing users to interact with the platform through voice commands.

Examples:

```text
Show me black shoes under 2000
```

```text
Show blue headphones below 3000
```

```text
Add this item to cart
```

```text
Proceed to checkout
```

The application converts speech into text, understands the user's intent, extracts filters and actions, and performs the requested operation automatically.

---

# Problem Statement

Modern e-commerce platforms are designed primarily for keyboard and touch interactions.

This creates challenges for:

* Mobile users
* Elderly users
* Users with disabilities
* Users who prefer hands-free interaction

Users often spend time:

* Typing product names
* Applying filters manually
* Navigating multiple pages
* Managing carts through repeated clicks

VANI introduces voice-based shopping to make product discovery and navigation faster and more accessible.

---

# Project Objectives

The main objectives of the project are:

* Convert voice into text
* Understand user intent
* Search products using natural language
* Apply filters automatically
* Manage cart using voice commands
* Support voice-based checkout actions
* Improve accessibility and convenience

---

# Technology Stack

## Frontend

```text
React.js
Tailwind CSS
Framer Motion
Web Speech API
```

Purpose:

```text
User Interface
Voice Recording
Product Display
Search Interface
Cart Management
Animation
```

---

## Backend

```text
Python
FastAPI
MongoDB
Pydantic
Motor
```

Purpose:

```text
REST APIs
Business Logic
Database Operations
Cart Management
Order Management
Voice Analytics
```

---

## AI Layer

```text
OpenAI API
Custom NLP Parser
Prompt Engineering
```

Purpose:

```text
Intent Recognition
Command Classification
Filter Extraction
Natural Language Understanding
Recommendation Logic
```

---

# Project Structure

```text
VANI/
│
├── frontend/
│
└── backend/
```

# High Level Architecture (HLD)

```text
+----------------------+
|        USER          |
+----------+-----------+
           |
           v
+----------------------+
|      FRONTEND        |
| React Application    |
+----------+-----------+
           |
           v
+----------------------+
|   WEB SPEECH API     |
| Speech To Text       |
+----------+-----------+
           |
           v
+----------------------+
|     AI ENGINE        |
| Intent Recognition   |
| NLP Processing       |
+----------+-----------+
           |
           v
+----------------------+
|      FASTAPI         |
| Backend Services     |
+----------+-----------+
           |
           v
+----------------------+
|      MONGODB         |
+----------------------+
```

---

# Application Flow

### Step 1

User speaks a command.

Example:

```text
Show me blue shoes under 2000
```

### Step 2

The browser converts speech into text using Web Speech API.

Output:

```text
Show me blue shoes under 2000
```

### Step 3

The transcript is sent to the backend.

### Step 4

The AI module processes the command.

Example Output:

```json
{
  "action": "search",
  "category": "shoes",
  "color": "blue",
  "price_max": 2000
}
```

### Step 5

FastAPI receives the structured intent.

### Step 6

A database query is generated.

```text
Category = Shoes
Color = Blue
Price <= 2000
```

### Step 7

MongoDB returns matching products.

### Step 8

Frontend updates the product grid.

---

# Voice Command Flow

```text
User Voice
     |
     v

Speech Recognition
     |
     v

Transcript
     |
     v

Intent Parser
     |
     v

Structured Intent
     |
     v

FastAPI Backend
     |
     v

MongoDB Query
     |
     v

Products Returned
     |
     v

Frontend Update
```

---

# Core Features

## Voice Search

Search products using voice.

Example:

```text
Show me headphones under 3000
```

---

## Voice Filters

Apply filters naturally.

Example:

```text
Show black shoes under 2000
```

---

## Cart Management

Examples:

```text
Add this item to cart
```

```text
Remove last item
```

```text
Open cart
```

---

## Voice Checkout

Example:

```text
Proceed to checkout
```

---

## Product Search

Traditional search functionality remains available.

---

## Location Selection

Users can select delivery location.

---

## Notification Center

Displays:

```text
Offers
Order Updates
Cart Reminders
```

---

## Analytics Dashboard

Track:

```text
Voice Searches

Popular Products

Most Used Commands

Command Success Rate

Command Failure Rate
```

---

# Future Scope

The project can be extended with:

```text
Hindi Voice Commands

Multi-Language Support

Wake Word Detection

Voice Authentication

Recommendation Engine

Payment Gateway Integration

Order Tracking

AI Shopping Assistant

Product Comparison Through Voice
```

---

# Expected Output

The completed system will allow users to:

* Search products using voice
* Apply filters using voice
* Manage cart using voice
* Navigate using voice
* Checkout using voice
* Browse products traditionally

The platform combines modern e-commerce functionality with natural language interaction to provide a more accessible and convenient shopping experience.

---

# Resume Description

Built VANI, a voice-powered e-commerce platform using React.js, FastAPI, MongoDB, Web Speech API, and NLP-based intent recognition. The system enables users to search products, apply filters, manage carts, and initiate checkout using natural language voice commands. Implemented speech-to-text processing, AI-based command parsing, product filtering, and analytics tracking for voice interactions.
