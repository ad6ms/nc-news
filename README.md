# Northcoders News API

Hello,

Welcome to nc_news, a backend project created as part of Northcoders learn to code Javascript fundamentsals course. If you wish to clone and use this repository please follow the setup below:

1. Create two seperate .env files for your test and development databases.

- .env.test

- .env.development

2. Add PGDATABASE=nc_news_test to the test file and PGDATABASE=nc_news to the development file.

3. Run 'npm install' in your terminal to install the dependencies used for this project.

4. Run 'npm run setup-dbs' in your terminal to drop and create the databases.

5. Run 'npm run seed' in your terminal to seed the development database.

6. To test the functionality, the tests are available in the '**tests**' folder. Run 'npm test' to run the test suite in full.

Requirements: Postgres "^8.7.3", Node.js "^22.7.0"

Link to hosted site: https://nc-news-r6j6.onrender.com/api
