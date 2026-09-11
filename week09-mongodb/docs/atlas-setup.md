# MongoDB Atlas setup

Atlas is MongoDB's hosted database. The free cluster is enough for every lab, assignment and the project, and it is the database your deployed API will use in Week 13. These steps were checked against the MongoDB documentation on 2026-09-11. Atlas changes its menus from time to time, so if a label doesn't match, look for the closest one.

## What the free cluster gives you

- 512 MB of storage (documents and indexes together), up to 500 connections and 100 operations per second.
- One free cluster per project. Create a new project for each app if you need more than one.
- No backups.
- **It pauses after 30 days with no connections.** You can resume it from the Atlas UI. If your project stops working after a break, check this first.

The docs call it the "Free cluster". Some screens still show its old name, **M0**.

## 1. Create an account and a project

1. Sign up at https://www.mongodb.com/cloud/atlas/register.
2. In the sidebar, under **Identity & Access**, click **All Projects**.
3. Click **New Project**, give it a name such as `cpan212`, click **Next**, then **Create Project**.

## 2. Create the free cluster

1. In the sidebar, click **Project Overview**, then **Create**.
2. Select the **M0** (free) option.
3. Pick a **Provider** (AWS, Google Cloud or Azure, any of them is fine for this course) and a **Region** close to you. In Week 13 the API is deployed to a US or Canadian region, and a database nearby keeps queries fast.
4. Give the cluster a **Name** (letters, numbers and hyphens). You can't rename it later.
5. Click **Create**.

Atlas then opens a **Security Quickstart**. It asks for a database user (a username and password, then **Create Database User**) and offers **Add My Current IP Address**. Do both there, then click **Finish and Close**. Sections 3 and 4 show where to find the same settings later.

## 3. Create a database user

The database user is what your app logs in with. It is not your Atlas account.

1. In the sidebar, under **Security**, click **Database & Network Access**, then the **Database Users** tab.
2. Click **Add New Database User**.
3. Choose **Password** as the authentication method. Enter a username such as `campus-events-app`.
4. Type a password or click **Autogenerate Secure Password**, and copy it somewhere safe (a password manager). A password without special characters saves you the encoding step in section 5.
5. Under **Built-in Role**, pick the role that can read and write to any database.
6. Click **Add User**.

Never use your Atlas account password here, and never commit this password to Git. It goes in `.env` only.

## 4. Allow your computer on the network access list

Atlas refuses connections from any IP address that is not on the project's IP access list.

1. In **Database & Network Access**, open the **IP Access List** tab.
2. Click **Add IP Address**. Use the option to add your current IP address if the dialog shows one, or type your address (search "what is my IP" to find it).
3. Click **Save and Close**.

The **Connect** dialog on your cluster also offers **Add Your Current IP Address** when your IP is missing.

Your home IP address can change, and school or coffee shop Wi-Fi has a different one. If your app suddenly can't connect with an error like `Could not connect to any servers in your MongoDB Atlas cluster` or a server selection timeout, add your current IP again.

Do not add `0.0.0.0/0` ("access from anywhere") for local development. It lets any computer on the internet try to log in to your database, and then the password is the only protection. Week 13 explains when a deployed server needs it and what that costs you.

## 5. Get the connection string

1. In the sidebar, under **Database**, click **Clusters**, then **Connect** on your cluster.
2. Choose **Drivers**, then Node.js.
3. Copy the connection string. It looks like this:

```
mongodb+srv://campus-events-app:<db_password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

4. Replace `<db_password>` (including the `<` and `>`) with the user's password.
5. Add a database name after `.mongodb.net/` and before the `?`. Without one, the driver uses a database called `test`.

```
mongodb+srv://campus-events-app:YOUR_PASSWORD@cluster0.abcde.mongodb.net/campus_events?retryWrites=true&w=majority&appName=Cluster0
```

6. Put the whole string in `api/.env`:

```
MONGODB_URI=mongodb+srv://campus-events-app:YOUR_PASSWORD@cluster0.abcde.mongodb.net/campus_events?retryWrites=true&w=majority&appName=Cluster0
```

The database and its collections don't need to exist yet. MongoDB creates them the first time you insert a document, so `npm run seed` creates both.

### Passwords with special characters

The connection string is a URL, so some characters in the password break it. If your password contains any of these characters, replace each one with its percent-encoded form:

| Character | Encoded |
|---|---|
| `@` | `%40` |
| `:` | `%3A` |
| `/` | `%2F` |
| `?` | `%3F` |
| `#` | `%23` |
| `[` | `%5B` |
| `]` | `%5D` |
| `!` | `%21` |
| `$` | `%24` |
| `&` | `%26` |
| `'` | `%27` |
| `(` | `%28` |
| `)` | `%29` |
| `*` | `%2A` |
| `,` | `%2C` |
| `;` | `%3B` |
| `=` | `%3D` |
| `%` | `%25` |
| space | `%20` |

For example, the password `p@ss:word!` goes in the connection string as `p%40ss%3Aword%21`. Only the password is encoded, not the rest of the string. You can also keep special characters out of the password by using **Autogenerate Secure Password**.

## 6. Check the connection

From the `api` folder:

```bash
npm run seed
```

You should see `Connected to MongoDB, database "campus_events"` and `inserted 8`. If you don't:

| Message | Likely cause |
|---|---|
| `MONGODB_URI is not set` | No `.env` file, or the variable name is misspelled |
| `bad auth : authentication failed` | Wrong username or password, or `<db_password>` was left in the string |
| A timeout, `Server selection timed out`, or `Could not connect to any servers` | Your IP address is not on the access list, or the cluster is paused |
| `querySrv ENOTFOUND` or `querySrv ECONNREFUSED` | A typo in the cluster host name, or your network blocks DNS SRV lookups (some campus and VPN networks do). Check the host name first. Then try another network, or use Atlas's standard `mongodb://` connection string (the one that lists every host) instead of the `mongodb+srv://` one, or run MongoDB locally with Docker for development. |
| `URI malformed` or `Password contains unescaped characters` | A special character in the password that needs encoding |

## Looking at your data with Compass

MongoDB Compass is a desktop app for browsing and editing documents.

1. Download it from https://www.mongodb.com/try/download/compass and install it.
2. In the Connections sidebar, click **Add New Connection**.
3. Paste the same connection string you put in `.env` and click **Save & Connect**.
4. Open the `campus_events` database, then the `events` collection. You can filter with a query like `{ "category": "arts" }`, sort, and edit a document to see the change in the app.

For a local database, the connection string is `mongodb://127.0.0.1:27017`.

## Using mongosh

mongosh is MongoDB's command-line shell. Install it from https://www.mongodb.com/docs/mongodb-shell/install/ (`brew install mongosh` on macOS, the MSI installer on Windows).

Connect to Atlas (mongosh asks for the password, so it isn't saved in your shell history):

```bash
mongosh "mongodb+srv://cluster0.abcde.mongodb.net/campus_events" --username campus-events-app
```

In Atlas, **Connect**, then **Shell**, shows this command with your cluster's host filled in. For a local database: `mongosh "mongodb://127.0.0.1:27017/campus_events"`.

Commands to try:

```js
show dbs
use campus_events
show collections
db.events.countDocuments()
db.events.find({ category: 'arts' }, { title: 1, startsAt: 1 })
db.events.find().sort({ startsAt: 1 }).limit(3)
db.events.findOne({ title: /hockey/i })
db.events.updateOne({ title: 'Open mic night' }, { $set: { capacity: 120 } })
```

Documents come back with `_id` and `__v`. The API renames `_id` to `id` and hides `__v`, but the database stores them as they are.
