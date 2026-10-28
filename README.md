# AuthMed

A cloud-native platform built on AWS for NGOs to securely manage and verify medicine inventories. Designed with a serverless-first mindset — leveraging AWS DynamoDB for NoSQL data persistence, AWS IAM for access control, and AWS SES for automated expiry notifications — AuthMed demonstrates real-world cloud architecture patterns applied to a healthcare domain.

---

## The Problem

NGOs that distribute medicines — food banks, health camps, disaster relief teams — manage their inventories using spreadsheets, paper registers, or nothing at all. This leads to:

- **Medicine wastage** — expired stock goes unnoticed until it is too late to act
- **No visibility** — staff have no real-time view of what is in stock and what is running low
- **Manual effort** — tracking expiry dates across hundreds of medicines by hand is error-prone and time-consuming
- **No access control** — anyone can edit a shared spreadsheet, making the data unreliable
- **Zero alerts** — no one is notified when a medicine is about to expire

For an NGO operating on a tight budget, wasted medicine is a direct cost and a failure to serve the people who need it most.

## Our Solution

AuthMed replaces spreadsheets with a secure, cloud-native platform purpose-built for NGO medicine management:

- **Centralised inventory on AWS DynamoDB** — all medicine records stored in a scalable NoSQL database, accessible from anywhere
- **Per-NGO data isolation** — every NGO logs in with a JWT-secured account and can only see their own medicines; no shared access, no data leakage
- **Automated expiry alerts via AWS SES** — when a medicine is within 8 days of expiry, the system automatically sends an email alert so the NGO can act before stock is wasted
- **Smart prioritisation with a Min-Heap** — medicines are ranked by expiry date using a DSA-based min-heap, surfacing the most urgent items instantly
- **Serverless backend on AWS Lambda** — zero server management, scales automatically, and costs nothing when idle — ideal for NGOs with unpredictable usage
- **One-click cloud deployment** — the entire backend deploys to Lambda + API Gateway with a single `npm run deploy` command via the Serverless Framework

---

## Cloud Architecture

AuthMed is built entirely on AWS managed services, eliminating the need for self-managed infrastructure:

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                           │
│               React SPA (Vite + Tailwind)               │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼────────────────────────────────┐
│                    AWS API GATEWAY                       │
│           Routes /api/auth  and  /api/medicine          │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                   AWS LAMBDA                             │
│        Node.js Express handler (serverless)             │
│   authController  │  medicineController  │  JWT Verify  │
└──────────┬─────────────────────┬──────────────────────--┘
           │                     │
┌──────────▼──────────┐ ┌───────▼─────────────────────────┐
│   DynamoDB          │ │        AWS SES                   │
│  Users Table        │ │  Expiry alert emails to NGOs     │
│  Medicine Table     │ └─────────────────────────────────-┘
└─────────────────────┘
```

### AWS Services Used

| Service | Role in AuthMed |
|---|---|
| **AWS DynamoDB** | NoSQL database storing users and medicine records with on-demand scaling |
| **AWS Lambda** | Serverless compute running the Express.js backend — no server management |
| **AWS API Gateway** | Managed HTTP API layer routing requests to Lambda functions |
| **AWS SES** | Sends automated email alerts to NGOs when medicines are nearing expiry |
| **AWS IAM** | Fine-grained access policies controlling Lambda's permissions to DynamoDB and SES |

### Why Serverless?

- **Zero server management** — No EC2 instances to patch or maintain
- **Auto-scaling** — Lambda scales to zero when idle and handles traffic spikes automatically
- **Pay-per-use** — Cost is directly proportional to actual usage, ideal for NGO workloads
- **High availability** — DynamoDB and Lambda are managed across multiple AWS Availability Zones by default

---

## Features

- **JWT Authentication** — Secure signup and login. Only registered NGOs can access the dashboard.
- **Add Medicines** — Log medicines with name, manufacturer, quantity, and expiry date.
- **View Inventory** — Responsive table showing all medicines belonging to the logged-in NGO.
- **Expiry Alerts via AWS SES** — Automated emails sent when medicines are within 8 days of expiry.
- **Per-NGO Data Isolation** — DynamoDB FilterExpression ensures each NGO only reads their own records.
- **Min-Heap Expiry Prioritization** — Medicines sorted by expiry using a DSA min-heap for O(log n) prioritization.
- **Responsive UI** — Fully optimized for desktop and mobile screens.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Tailwind CSS, ShadCN UI, Framer Motion |
| Backend | Node.js, Express.js (deployed on AWS Lambda) |
| Database | AWS DynamoDB (NoSQL, serverless) |
| API Layer | AWS API Gateway |
| Email Notifications | AWS SES |
| Authentication | JWT (jsonwebtoken) + bcryptjs |
| IAM | AWS IAM roles and policies |
| Routing | React Router |

---

## DynamoDB Schema

### Users Table
| Attribute | Type | Role |
|---|---|---|
| `email` | String | Partition Key |
| `name` | String | NGO display name |
| `password` | String | bcrypt hashed |
| `createdAt` | String | ISO timestamp |

### Medicine Table
| Attribute | Type | Role |
|---|---|---|
| `medicineId` | String | Partition Key (UUID v4) |
| `ngoEmail` | String | Foreign key to Users (filter key) |
| `name` | String | Medicine name |
| `manufacturer` | String | Manufacturer |
| `quantity` | Number | Stock count |
| `expiryDate` | String | YYYY-MM-DD format |
| `createdAt` | String | ISO timestamp |

---

## Project Structure

```
authmed/
├── frontend/
│   └── src/
│       ├── pages/          # Landing, Login, Signup, Dashboard
│       ├── components/     # Navbar, MedicineTable, ShadCN UI components
│       ├── services/       # Axios API client
│       └── hooks/          # Custom React hooks
│
└── backend/
    ├── config/             # DynamoDB DocumentClient setup (dynamo.js)
    ├── controller/         # authController.js, medicineController.js
    ├── middleware/         # JWT auth middleware
    ├── routes/             # /api/auth, /api/medicine
    └── index.js            # Express entry point (Lambda handler)
```

---

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/signup` | `{ name, email, password }` | Register a new NGO account |
| POST | `/login` | `{ email, password }` | Login and receive a JWT token |

### Medicine — `/api/medicine` *(JWT required)*

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/add` | `{ name, manufacturer, quantity, expiryDate }` | Add a new medicine |
| GET | `/all` | — | Fetch all medicines for the authenticated NGO |

---

## Environment Variables

### Backend — `backend/.env`

```env
PORT=5000
JWT_SECRET=your_jwt_secret

AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_iam_access_key_id
AWS_SECRET_ACCESS_KEY=your_iam_secret_access_key

USERS_TABLE=your_dynamodb_users_table_name
MEDICINE_TABLE=your_dynamodb_medicine_table_name

SES_SENDER_EMAIL=your_verified_ses_sender_email
```

### Frontend — `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

## AWS Setup

### 1. DynamoDB Tables

Create two tables in the AWS Console or via AWS CLI:

```bash
# Users table
aws dynamodb create-table \
  --table-name AuthMed-Users \
  --attribute-definitions AttributeName=email,AttributeType=S \
  --key-schema AttributeName=email,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

# Medicine table
aws dynamodb create-table \
  --table-name AuthMed-Medicines \
  --attribute-definitions AttributeName=medicineId,AttributeType=S \
  --key-schema AttributeName=medicineId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

### 2. IAM Policy

Attach the following least-privilege policy to your IAM user or Lambda execution role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:REGION:ACCOUNT_ID:table/AuthMed-Users",
        "arn:aws:dynamodb:REGION:ACCOUNT_ID:table/AuthMed-Medicines"
      ]
    },
    {
      "Effect": "Allow",
      "Action": "ses:SendEmail",
      "Resource": "*"
    }
  ]
}
```

### 3. SES — Verify Sender Email

```bash
aws ses verify-email-identity --email-address your@email.com
```

---

## Getting Started (Local)

### Prerequisites

- Node.js v18+
- AWS CLI configured (`aws configure`)
- AWS account with DynamoDB tables and SES sender verified (see AWS Setup above)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/authmed.git
cd authmed
```

**2. Set up the backend**

```bash
cd backend
npm install
cp .env.example .env   # then fill in your values
npm run dev
```

**3. Set up the frontend**

```bash
cd frontend
npm install
cp .env.example .env   # then fill in your values
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:5000`.

---

## Deploying to AWS

### Backend — AWS Lambda + API Gateway (Serverless Framework)

**Prerequisites**

```bash
# Install Serverless Framework globally
npm install -g serverless

# Configure AWS credentials
aws configure
```

**Deploy**

```bash
cd backend
npm install
cp .env.example .env   # fill in all values
npm run deploy         # deploys to 'dev' stage by default
```

After deploy, Serverless prints your API Gateway URL:

```
endpoints:
  ANY - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/{proxy+}
```

Copy that base URL — you'll need it for the frontend.

**Deploy to production stage**

```bash
npm run deploy:prod
```

**Remove the deployment**

```bash
npm run remove
```

---

### Frontend — AWS S3 + CloudFront

**1. Build the frontend**

```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL to your API Gateway URL from the backend deploy step
# e.g. VITE_API_URL=https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/api
npm install
npm run build
```

This produces a `dist/` folder with the static site.

**2. Create an S3 bucket**

```bash
aws s3 mb s3://authmed-frontend --region us-east-1
aws s3 website s3://authmed-frontend \
  --index-document index.html \
  --error-document index.html
```

**3. Set bucket public-read policy**

```bash
aws s3api put-bucket-policy \
  --bucket authmed-frontend \
  --policy '{
    "Version":"2012-10-17",
    "Statement":[{
      "Effect":"Allow",
      "Principal":"*",
      "Action":"s3:GetObject",
      "Resource":"arn:aws:s3:::authmed-frontend/*"
    }]
  }'
```

**4. Upload the build**

```bash
aws s3 sync dist/ s3://authmed-frontend --delete
```

**5. (Optional) CloudFront CDN**

Create a CloudFront distribution pointing to your S3 bucket for HTTPS and global edge caching. Set the **Default Root Object** to `index.html` and add an error page for 404 → `index.html` (needed for React Router).

---

## License

MIT © [aryan-vijaykar](https://github.com/aryan-vijaykar)
