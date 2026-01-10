# Bulldog Marketplace

Bulldog Marketplace is a full-stack web application designed to support a campus-based marketplace where users can post, browse, and search for items within a community. The project focuses on improving item discovery by incorporating semantic search rather than relying only on traditional keyword matching.

## Project Overview

The goal of Bulldog Marketplace is to explore how semantic search techniques can enhance a simple marketplace application. By focusing on meaning and context, users are able to find more relevant listings even when exact keywords are not used.

This project was built as a collaborative, learning-focused application with an emphasis on full-stack development and applied AI concepts.

## Features

- Campus-based marketplace platform  
- Item listings with structured data  
- Semantic search for improved discovery  
- Full-stack architecture with frontend and backend components  
- Research-driven implementation of semantic search  

## Tech Stack

### Frontend
- TypeScript  
- HTML  
- CSS  
- JavaScript  

### Backend
- Python  
- Embedding-based semantic search  

## Repository Structure

```text
bulldog-marketplace/
│
├── client/                  # Frontend application
├── src/                     # Backend source code
├── SEMANTIC_SEARCH_WRITEUP.md
├── .gitignore
```

# Bulldog Marketplace

## Semantic Search
The semantic search approach used in this project is documented in detail in `SEMANTIC_SEARCH_WRITEUP.md`. This write-up explains the motivation behind using embeddings, the design decisions made, and how semantic retrieval improves search relevance compared to keyword-based methods.

---

## Getting Started
The following steps describe how to run the project locally.

### Prerequisites
* **Python 3.x**
* **Node.js and npm**
* **Git**

### Installation
1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Daniel-ct27/bulldog-marketplace.git](https://github.com/Daniel-ct27/bulldog-marketplace.git)
   ```

2. **Navigate into the project directory:**
   ```bash
   cd bulldog-marketplace
   ```

### Running the Application
**Start the backend:**
   ```bash
   cd src
   pip install -r requirements.txt
   python main.py
   ```
**In a separate terminal, start the frontend:**
   ```bash
   cd client
   npm install
   npm run dev
   ```
### Contributors
* Daniel Chukwudera
* Jermaine Adesanya
