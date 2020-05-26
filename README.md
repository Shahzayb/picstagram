# Pistagram

It's a clone of instagram with limited features.

## Features List

1.  User can signin/signup
2.  User can edit profile info
3.  User can change password
4.  User can upload image
5.  User can like image
6.  User can comment on image
7.  User can follow/unfollow other user
8.  User can view his/her timeline
9.  User can reset password through email
10. User can search other users


## 3rd Party Services
This project uses these 3rd party services:
- [Cloudinary](https://cloudinary.com/)
- [SendGrid](https://sendgrid.com/)
- [Algolia](https://www.algolia.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## Installing

1. Clone the project and install dependencies

```
git clone https://github.com/Shahzayb/pistagram.git
```
```
cd pistagram
npm install
cd client && npm install
cd server && npm install
```

2. Create all third party services accounts mentioned above. I'm assuming you know about these services. If not, then there are many good tutorials on these services.

3. inside `pistagram/config` folder, create `dev.env` file. And in `pistagram/client` folder, create `.env.local` file.

4. Here is the list of all env variables you have to provide.

**inside dev.env:** 
```
CLOUDINARY_CLOUD_NAME=value
CLOUDINARY_API_SECRET=value
DB_URL=value
JWT_SECRET=value
SENDGRID_API_KEY=value
COMPANY_EMAIL=yourname@no-reply.com
CLIENT_BASE_URL=react app base url (i.e http://localhost:3000 for development environment)
ALGOLIA_APP_ID=value
ALGOLIA_ADMIN_API_KEY=value
```

**inside .env.local:**
 
```
REACT_APP_CLOUDINARY_CLOUD_NAME=value
REACT_APP_ALGOLIA_APP_ID=value
REACT_APP_ALGOLIA_SEARCH_API_KEY=value
REACT_APP_ALGOLIA_SEARCH_INDEX_NAME=index name
```

## Running the tests

inside the root of the project run:
```
npm run test
```




## Built With
* [Express.js](http://expressjs.com/)
* [Mongoose](https://mongoosejs.com/)
* [NPM](https://www.npmjs.com/)
* [Create React App](https://create-react-app.dev/)

## Author

* **Shahzaib Sarwar**  - [shahzayb](https://github.com/shahzayb)


## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/Shahzayb/pistagram/blob/master/LICENSE) file for details
