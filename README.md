# Renting site

A final exam project for the subject "Internet technologies". The goal is to model a site for renting computer equipment - PS, Xbox, 
PC, chairs, desks if you want, it doesn't really matter .

# Tech stack

- [DynamoDB database](https://aws.amazon.com/dynamodb/), for storing item and rent history information; 
- [Express server](https://www.npmjs.com/package/express), for exposing the API to the frontend
- [Algolia](https://www.algolia.com/), for searching items from the database
- [Firebase](https://firebase.google.com/), for user authentication and file storage
- [React](https://reactjs.org/), for the frontend/site itself

# Before firing it up

There are some things that need to be done before running `npm start`. For the record, I am using `VSCode` as my editor. It's the best.

## Environment variables

Both the `frontend` and `backend` folders have their `env.example` file, listing all of the required secret information. Locally, my file
was called `.env.local`. If, after seeing the required keys, you already know what to do and to put there, great. If not, I will walk you
through it, step by step. Mini warning - it will be a relatively lengthy process.

## AWS and DynamoDB

To make the DynamoDB tables, you firstly need to have an AWS account. If you have one and have it set up, great. You will need your 
access key ID and secret access key. If you don't have those at your hand, go to whereever your `.aws` folder is located (mine is 
`C:\Users\Luka`) and open the `credentials` file with whatever editor (Notepad++, VSCode...). Put the keys in your `backend/.env.local` 
file, under the names `AWS_ACCOUNT_ACCESS_KEY_ID` and `AWS_ACCOUNT_SECRET_ACCESS_KEY`, as listed in `backend/env.example`. While you're
at it, fill in `AWS_ACCOUNT_REGION` as well (mine was `eu-central-1`).

If you do not have an AWS account, follow [step #1](https://serverless-stack.com/chapters/create-an-aws-account.html), [step #2](https://serverless-stack.com/chapters/create-an-iam-user.html) 
and optionally [step #3](https://serverless-stack.com/chapters/configure-the-aws-cli.html), if you want to use AWS through the CLI later on.

After saving the keys you got in step #2, copy those into your `backend/.env.local` file under the names `AWS_ACCOUNT_ACCESS_KEY_ID` and 
`AWS_ACCOUNT_SECRET_ACCESS_KEY`, as listed in `backend/env.example`. While you're at it, fill in `AWS_ACCOUNT_REGION` as well (mine was `eu-central-1`).

After finishing with the keys, fill in the `ITEMS_TABLE_NAME` and `RENT_HISTORY_TABLE_NAME` parameters. Use whatever names you wish, what 
they are for is quite self explanatory - the first one is a table name for all the items, and the second is a table name for storing
a user's renting/order history.

## Algolia

Go to [Algolia's website](https://www.algolia.com/) and make an account if you don't have one. Once you are logged in, go back to the front 
page and get into the Dashboard. On the left, in the navigation bar, click the dropdown for applications (the first option beneath their logo) and select "Create 
application at the bottom. Give your application a name. Select the **FREE** billing plan. Scroll down and click "Next Step - Data Center". Leave
the default region, click "Review Application Details" on the right. Agree to the terms of service or whatever and create your application.

Select the "Experienced user" option, because I will walk you through what you need to do for now. Go to the "API Keys" option in the navigation
bar. Copy the `Application ID` and the `Admin API Key` to the corresponding parameters in `backend/.env.local` - `ALGOLIA_APP_ID` and
`ALGOLIA_ADMIN_KEY`.

## Firebase

We're almost done, we just need to setup Firebase. To setup Firebase, follow the instructions on this [link](https://www.youtube.com/watch?v=PKwu15ldZ7k),
from 1:40 to 6:22. You can skip making the development and production projects, and just make a development project. The environment variables now go in 
`frontend/.env.local`, rather than the backend, as we want to be able to authenticate users and allow them to upload files from the website.

Next, while in the Firebase console, in the sidebar, go Build -> Storage (the text highlighted in blue in the picture). We will use the Storage for storing item images.

![image](https://i.gyazo.com/8b8fcaf6082b35ee65178869d3b8a144.png)

Next, go to the "Rules" tab, and replace the existing rules with the following: \
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow write: if request.auth != null;
      allow read: if true;
    }
  }
}
```

Publish the changes. What that does is, it allows any user (logged in or not) to be able to see the images of an item, but only logged in users 
can add images (i.e. create or update a new item).

With that, the tech stack setup is complete.

# Firing up the website

From the root of the project, navigate to `backend` and run the command `npm install`. Have a look at `other-packages.txt` too - I used `nodemon`
for firing up the Express server, but you can use the plain `node` command too. After `npm install` has finished, run the command `node make-tables.js`.
If you did everything correctly (and if I didn't forget anything), this should create the two needed DynamoDB tables. Run the command `nodemon app.js`
(or `node app.js`) to start the server.

In another terminal instance, navigate to the `frontend` folder and do `npm install` as well. And, if everything went according to plan, you 
can run `npm start` and the website should fire up on `localhost:3000`. After that, you can start using the site.

Create an account, make a new item or two, try updating the items, searching for them. Create a new account (so you can rent the items you
created) and rent some of the items - either enter your super totally legit credit card information, or pay on arrival. After ordering,
check your rent history on your profile page.
