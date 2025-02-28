# Project: Gokstad Padel

## Table of Contents

1. [Introduction](#introduction)
2. [Dependencies](#dependencies)
3. [Setup and Installation](#setup-and-installation)
4. [Configuration](#configuration)
5. [Running The Application](#running-the-application)
6. [Relevant Features and Functionality](#features-and-functionality)
7. [Reference Material](#reference-material)

---

## Introduction

#### Gokstad Padel is an application built in React, TypeScript, React-Router-DOM, TailwindCSS and React Redux. Its a booking platform for padel enthusiasts that allow users to create an account, book padel and edit padel sessions. With admin privileges that can handle all users, bookings and support requests.

---

## Dependencies

**Dependencies**:

- `@emotion/react` (^11.14.0)
- `@emotion/styled` (^11.14.0")
- `@mui/material` (^6.4.5)
- `@mui/x-date-pickers` (^7.27.0)
- `@reduxjs/toolkit` (^2.5.1)
- `bcrypt` (^5.1.1")
- `bcryptjs` (^3.0.2)
- `dayjs` (^1.11.13)
- `node-fetch` (^3.3.2)
- `react` (^19.0.0)
- `react-dom` (^19.0.0)
- `react-icons` (^5.5.0)
- `react-redux` (^9.2.0)
- `react-router-dom` (^7.2.0)

**Dev Dependencies**:

- `TypeScript` (~5.7.2)
- `@types/react` (^19.0.8)
- `@types/react-dom` (^19.0.3)
- `@types/react-router-dom` (^5.3.3)
- `@types/bcrypt` (^5.0.2)
- `@types/bcryptjs` (^2.4.6)
- `@types/jest` (^29.5.14)
- `@vitejs/plugin-react` (^4.3.4)
- `Vite` (^6.1.0)
- `Vitest` (^3.0.6)
- `dotenv` (^16.4.7)
- `eslint` (^9.19.0)
- `eslint-plugin-react-hooks` (^5.0.0)
- `eslint-plugin-react-refresh` (^0.4.18)
- `tailwindcss` (^3.3.3)
- `postcss` (8.4)
- `autoprefixer` (^10.4.20)
- `ts-node` (^10.9.2)
- `tsx` (^4.19.3)

---

## Setup and installation

1. Clone the repository: `git clone https://github.com/oddzor/Frameworks-Exam-Padel`
2. Navigate to the project directory: `cd [your-project-directory]`
3. Install dependencies: `npm install`
4. <em>**[Set up environment variables](#configuration) in a `.env` file.**</em>

---

## Configuration

> [!CAUTION]  
> Failing to create an .env-file in the `ROOT FOLDER` and using these keys will cause app to not work as intended.

> [!CAUTION]  
> If endpoint runs out of requests, use `npm run dev` again to ensure "courts" are populated to your new endpoint

> [!IMPORTANT]  
> If encountering issues with crudcrud connection, install plugins to allow CORS


- **VITE_CRUDCRUD_URL** = `"https://crudcrud.com/api/<your-unique-endpoint">` (NO "/" in the end of the url)
- **VITE_ADMIN_USERNAME** = `"admin"`.
- **VITE_ADMIN_PASSWORD** = `"admin"`
- **VITE_MOCK_USERNAME** = `"mock@user.com"`
- **VITE_MOCK_PASSWORD** = `"password"`
- **VITE_SECRET_KEY** = `<"your-secret-code">`



---

## Running the application.

After creating .env file, filling in the data, using `npm install`, use `npm run dev`.

`npm run dev` will launch the seeding script which will populate some mock data to the crud crud endpoint if empty. 
If you execute `npm run dev` again, it will abort seeding when the checks for data are complete. You will see a user and some bookings in the admin panel, but for testing I recommend creating a new user and getting the full experience.

---

## Relevant features and functionality.

### General Functionality

#### <ins>Booking Logic</ins>

There are 6 courts, available from 10AM to 10PM every day. Each court is available for 2 or 4 players. If a user books a court, a request is sent to check booking data to ensure that the court is available at that time and date.

If the court is booked at that time and date, the user is not provided that timeslot in the dropdown menu. There is also added redundancy to "suggest next available time" if somehow the user is able to force a booking for an occupied timeslot. 

When selecting a booking, and selecting 2 or 4 players, you are given input fields to fill in "Main player" and "Extra player(s)".

#### <ins>Users Logic</ins>

Users may self register, upon registration the user is given a role to indicate their "accesss rights", this will ensure that the user may only access the pages and routes that are intended, handled via `authSlice`. An example of a blocked route is if the user tries to manually route to /admin, they will be flagged as unauthorized and redirect to homepage.

#### <ins>Tickets Logic</ins>

Users may, for any reason, send a support ticket. For example if an admin uses their rights to "cancel membership", and the cancelled user tries to log in, they can only access the contact page to send a ticket, this ticket will be sent to the admin panel tickets tab, where the admin can read the case and close or keep open the ticket.


#### <ins>Admin Logic</ins>

The admin dashboard contains:

- All bookings
- All users
- Tickets
- Filtering

This functionality allows the admin unilateral control of all things related to the webpage. The admin can edit bookings, control user access, cancel memberships (which will flag the users data with a `banned: boolean`, restricting route access).


### Technical Functionality



#### <ins>AuthState Management With Redux</ins>

The authentication system keeps track of various details such as whether the user is logged in, their role (admin or regular user), and if they are banned. This is managed using a Redux slice, which provides functions to log in (loginUser), log out (logout), and restore a previously saved authentication state (restoreAuthState).


#### <ins>API Management</ins>

All CRUD operations are handled in separate files for their respective endpoints, direct connection to the specified crudcrud endpoint from the env file. Serverless operation, but crudcrud endpoint mandatory for app to function.

### Pages

#### <ins>LandingPage</ins>

Hero section with some information cards, will allow users to register or log in with some state management for displaying buttons, from here you can navigate to all sections easily.

#### <ins>LoginPage</ins>

Login form that sends or checks credentials to crudcrud endpoint (or if admin, from the env), and on success, manages state providing a role, depending on what type of user logged in.

#### <ins>AdminPage</ins>

Admin dashboard that provides management of user accounts, bookings, support tickets. Admin has full autonomy to CRUD operations on all users in the system.

#### <ins>BookingsPage</ins>

Calendar view imported from Material UI, user selects a date from calendar via doubleclick, booking modal is triggered and the user can select amount of players, what time and how many players. Logic is implemented to not list already booked Courts at the same time, but there is a fallback that will suggest another time if the user selects a time that is already booked.

#### <ins>ContactPage</ins>

Portal to send support requests, for example if you have gotten banned/cancelled, you will be able to access this portion of the webpage to inform admin that you have issues.

---

## Testing

Testing is done through vitest and run via `npm test`, alternatively the tests could be run through a vitest plugin for IDE of choice. 
The tests are mainly focused on data flows and ensuring that the mock calls from the API endpoints handle correctly.

#### <ins>adminsAPI</ins>

- Ensures admins can fetch all bookings successfully.
- Verifies that an admin can update a booking correctly.
- Confirms that an admin can delete a booking without errors.


#### <ins>authSlice</ins>

- Checks that the auth state initializes correctly.
- Ensures that login updates the state (pending, success, failure).
- Confirms that logout resets the state.
- Verifies that restoring auth state works properly.

#### <ins>bookingsAPI</ins>

- Ensures users can create a booking successfully.
- Confirms that updating a booking works with a valid _id.
- Tests that finding the next available time slot functions correctly.




## Reference Material

**References**

- [Redux-Toolkit Store Configuration](https://redux-toolkit.js.org/api/configureStore)
- [Tailwind Documentation](https://v2.tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Redux-Toolkit Slices](https://redux-toolkit.js.org/api/createSlice)
- [Auth Handling With Redux Toolkit](https://blog.logrocket.com/handling-user-authentication-redux-toolkit/)
- [React-Router-DOM Documentation](https://reactrouter.com/start/framework/routing)
- [React + Typescript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/docs/basic/setup)
- [brcrypt NPM Documentation](https://www.npmjs.com/package/bcryptjs?activeTab=readme)
- [Material UI Calendar](https://mui.com/x/react-date-pickers/date-range-calendar/)



**Previous projects**


- [Mandatory Assignment REACT 2024](https://github.com/oddzor/Arbeidskrav-2---Javascript-Rammeverk)
- [React Exam 2024](https://github.com/oddzor/Exam-Javascript-Frameworks.git)

