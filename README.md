# Installation Instructions

- Make sure your NodeJS and npm versions are up to date for `React 16.8.6`

- To check for outdated dependencies: `npm outdated`

- Install dependencies: `npm install` or `yarn`

- Start the server: `npm run start` or `yarn start`

- Views are on: `localhost:3000`

Notes: there is a bug with material-table.  We had to downgrade to version 1.67.0.  Higher versions caused a memory leak when loading new table data.  We should look at other table libraries.

# Deployment Instructions

- To deploy to a preview channel:
`firebase hosting:channel:deploy daily-comparisons --expires 7d`

- Create production build: `npm run build`
- Deploy to Firebase hosting: `firebase deploy`

# Screenshots

![alt text](https://github.com/alexanderjpowell/meter-image-capturing-react/blob/master/screenshots/1.png)

![alt text](https://github.com/alexanderjpowell/meter-image-capturing-react/blob/master/screenshots/2.png)

![alt text](https://github.com/alexanderjpowell/meter-image-capturing-react/blob/master/screenshots/3.png)

![alt text](https://github.com/alexanderjpowell/meter-image-capturing-react/blob/master/screenshots/4.png)

![alt text](https://github.com/alexanderjpowell/meter-image-capturing-react/blob/master/screenshots/5.png)
