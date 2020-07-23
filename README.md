# Buddha Jones Portal

This project was created to bring Buddha Jones' management and administration methods into 21st century.

### Contributors guide

1. Create and checkout to branch with name starting from `feature`, `story`, `task` or `bug` followed by number of said item and optional additional details after dash, e.g. `story724-login-module`.
2. Ensure your IDE has ESLint and Editor Config support enabled. Follow ESLint errors and warnings to ensure consistent code formatting and organization across all developers.
3. At the end of each day commit changes you're working on and push them to remote branch to keep your progress public and secure.
4. When ready for code review, create pull request. Pull requests should always point single level up - tasks and bugs should be merged to stories, stories to features and featues to master branch.
5. In Visual Studio Team Services set your user picture, name and your preferred notifications email address.

### How to run front-end

1. In root directory run `npm install` to get NPM dependencies.
2. Run `npm start` to get app running with live reloading at `http://localhost:3000`.

### How to build front-end

1. Run `npm run build`.
2. Deploy files from `/public` directory to end server.

### How to run API documentation

1. In `/api/docs` directory run `bundle install` to get Ruby dependencies.
2. Run `bundle exec middleman server` to get docs running with live reloading at `http://localhost:4567`.

### How to build API documentation

1. In `/api/docs` directory run `bundle exec middleman build --clean`.
2. Deploy files from `/api/docs/build` directory to end server.
