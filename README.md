# Film Log - MUBI Take Home Task

> _“As a user, I want to keep a log of my film reviews.”_

I have developed a React application for this take home task; that allows users to write reviews on certain films, giving ratings and managing previous reviews.

I developed this project using Typescript with React as the framework. I have aimed to stay true to the wireframes and requirements for this task.

There are two versions of this project on seperate branches. I used some additional time to add a few different features to make my project stand out a little, these are found in the `additional-changes` branch.

---

## Features Implemented

### Core Requirements

| Requirement                    | Implementation                                                                                                                   |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| **Create a film review**       | Users are able to write a review for any film within the provided API.                                                           |
| **Delete a review**            | Reviews can be viewed and deleted with a confirmation.                                                                           |
| **Canonical URLs for reviews** | Reviews have unique `/reviews/:id` routes, pulled from the title and year id. Year was added to avoid same name titles clashing. |
| **Search for films by title**  | The new review form includes a search field with a dropdown.                                                                     |
| **Index view of all reviews**  | `/reviews` displays all reviews with the appropriate thumbnails and data.                                                        |

---

### Bonus Features

| Feature                 | Description                                                                                        |
| ----------------------- | -------------------------------------------------------------------------------------------------- |
| **Filter by genre**     | Dropdown filter is included in the index/main page to filter reviews by film genre.                |
| **Local persistence**   | Reviews are held in `localStorage`; they can be restored when the app is reopened/refreshed.       |
| **Responsive design**   | Mobile and desktop viewing are both responsive, using grid and flex layouts.                       |
| **Star rating system**  | Integrated an additional feature,`react-flexible-star-rating` for users to assign a visual rating. |
| **Light & dark themes** | Additional feature; users can toggle between themes via an icon in the header.                     |
| **ARIA accessibility**  | ARIA attributes used for form fields, search and lists.                                            |

---

## Design Notes

- The **`main`** branch closely matches the provided wireframes for this task, focusing on functionality.
- The **`additional-changes`** branch introduces a few extra tidbits:
  - Star ratings
  - Theme toggle (light/dark mode)
  - Subtle accessibility improvements

---

## Development Process

My project was built iteratively, with a series of meaningful commits demonstrating:

- Introduction of features
- Refactors or fixes to maintain clarity in code and structure
- Commits written with clarity, to illustrate my approach to solving each problem

---

## Accessibility Considerations

- Search dropdown and keyboard focus management for film selection.
- Descriptive labels and ARIA attributes for interactive elements.
- Minimal reliance on colour, using themes to manage this

---

## How I would improve with more time

- Match the MUBI aesthetic: refine typography, spacing, and film-poster presentation to emulate MUBI’s cinematic minimalism
- Interactions: introduce transitions and animations to create a more tactile and responsive feel
- Accessibility enhancements: improve screen reader experience, add focus outlines and ensure dynamic regions announce properly
- Desktop optimisation: fine-tune layout spacing and card proportions for larger viewports to allow better viewability on wider screens

---

### Up an running

- npm install
- use `main` branch for the wireframe accurate
- use `additional-changes` branch to view the app with additional feature changes

- npm run dev for dev server at http://localhost:5173
