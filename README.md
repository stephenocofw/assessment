# Forge Works - Systemic Safety Assessment Tool

A modern, React-based application for safety incident reporting and systemic investigation, designed to move beyond simple "root cause" analysis to understanding organizational factors.

## Features

- **Initial Report Triage**: A streamlined 5-question form for supervisors to capture factual event details and immediate actions.
- **Systemic Investigation**: A comprehensive assessment tool evaluating 15 systemic factors across "Guide", "Enable", and "Execute" capacities.
- **Interactive Dashboard**: Real-time view of incident status, system health, and open investigations.
- **Analytics**: Visualization of systemic factors contributing to incidents vs. recovery.

## Tech Stack

- **Framework**: React + Vite
- **Styling**: Tailwind CSS + generic UI components
- **Language**: TypeScript
- **Icons**: Lucide React
- **Charts**: Recharts

## Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run Development Server**
    ```bash
    npm run dev
    ```

3.  **Build for Production**
    ```bash
    npm run build
    ```

## Project Structure

- `src/components/forms`: Core input forms (Initial Report, Investigation).
- `src/components/analytics`: Charting and visualization components.
- `src/context`: React Context for state management (`IncidentContext`).
- `src/data`: Mock data and type definitions.

## Key Concepts

- **Guide Factors**: Leadership, Strategy, Risk Management.
- **Enable Factors**: Resources, Systems, Training.
- **Execute Factors**: Frontline work, Communication, Decision Making.
