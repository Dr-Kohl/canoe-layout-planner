Cardboard Boat Float Lab — IT Hosting Notes

Purpose
-------
This is a small interactive buoyancy-planning tool for EGGN 1910 students.
It collects no student information and requires no login, database, API key,
or external service.

Hosting request
---------------
Please host this as a small Node.js web application at a public HTTPS URL.
The project expects Node.js 22.13 or newer. Install the dependencies listed
in package.json, run the build script, and start the production server.

Available scripts
-----------------
pnpm install
pnpm build
pnpm start

The app should be reachable at the HTTPS URL supplied to the instructor.
Students can use that URL from Canvas. In Canvas, add it to a Module as an
External URL and select “Load in a new tab.”

The project has no environment variables or persistent storage requirements.
