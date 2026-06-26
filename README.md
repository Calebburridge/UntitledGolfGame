# Untitled Golf Game

A minimalist, mobile roguelike golf game built with React Native and Expo for iOS and Android. 

---

## Project Overview
**Untitled Golf Game** combines the precision of classic mobile golf physics with the strategic risk/reward loops of a roguelike. Players tackle shifting courses, manage their gear, and draft upgrades to survive 18 holes. 

The visual design draws heavy inspiration from the lo-fi, ultra-minimalist aesthetic of [Paper Apps: Golf](https://gladdendesign.com/products/paper-apps-golf).

---

## Core Gameplay Loop

1. **Aim & Power:** Tap and drag back to determine the shot's trajectory and strength.
2. **The Precision Minigame:** Upon release, a "stop-the-cursor" timing minigame triggers. Your success determines the ultimate accuracy of the shot.
3. **The Roguelike Run:** Complete courses while managing meta-progression to unlock superior gear.

### Progression & Upgrade Systems
Players earn permanent or run-based upgrades to their equipment:
* **Better Balls:** Unique physics, wind resistance, or terrain bonuses.
* **Upgraded Clubs:** 
  * *Forgiveness:* Grants more leeway/wider success zones in the precision minigame.
  * *Vision:* Extends the trajectory prediction line (more guide dots) and narrows the variance cone for better shot visualization.

---

## Course Structure
* **Initial Release Target:** 5 unique courses.
* **Game Length:** 18 holes per full run.
* **Bite-Sized Play:** Options to play just the **Front 9** or **Back 9** for quicker, mobile-friendly sessions.

---

## Tech Stack & Development
* **Framework:** React Native via Expo
* **IDE:** Visual Studio Code
* **Version Control:** Git

---

## Development Roadmap

### Phase 1: Foundations
- [ ] Establish project folder structure (components, hooks, screens, state).
- [ ] Implement basic 2D physics canvas or layout for the ball and hole.
- [ ] Create the "Tap, Pull, and Release" aiming mechanic.

### Phase 2: Core Mechanics
- [ ] Build the "Stop the Cursor" timing minigame.
- [ ] Connect minigame accuracy to the ball's final trajectory.
- [ ] Implement basic win/loss conditions for a single hole.

### Phase 3: Roguelike & Content
- [ ] Design the UI for club/ball upgrades.
- [ ] Create a progression system that alters trajectory dots and minigame difficulty.
- [ ] Build out the 5-course data structures (Front 9 / Back 9 logic).

### Phase 4: Polish & Refinement
- [ ] Apply the minimalist "Paper Apps" visual theme and custom typography.
- [ ] Add sound effects and subtle haptic feedback.
- [ ] Deploy test builds via Expo Go.