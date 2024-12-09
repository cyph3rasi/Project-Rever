# Project Rever

A decentralized social network built on the Avalanche blockchain.

## Features

- Wallet-based authentication
- Decentralized content creation and storage
- Token-based engagement
- NFT integration
- DAO governance
- Privacy features
- Gamification

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Avalanche wallet (MetaMask, Core Wallet, etc.)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/cyph3rasi/Project-Rever.git
cd Project-Rever
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the environment variables in `.env` with your configuration

5. Start the development server:
```bash
npm run dev
```

## Project Structure

```
├── src/
│   ├── app.js           # Application entry point
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── routes/          # API routes
│   └── utils/           # Utility functions
├── .env.example         # Example environment variables
├── .gitignore          # Git ignore rules
├── package.json        # Project dependencies and scripts
└── README.md           # Project documentation
```

## API Endpoints

### Authentication
- POST `/api/auth/connect-wallet` - Connect wallet
- POST `/api/auth/verify-signature` - Verify wallet signature
- POST `/api/auth/logout` - Logout

### Posts
- POST `/api/posts` - Create a new post
- GET `/api/posts` - Get all posts
- GET `/api/posts/:id` - Get post by ID
- POST `/api/posts/:id/like` - Like a post
- POST `/api/posts/:id/repost` - Repost a post

### Users
- GET `/api/users/profile/:address` - Get user profile
- PUT `/api/users/profile` - Update user profile
- GET `/api/users/:address/posts` - Get user's posts

## Next Steps

1. Complete the smart contract implementations for:
   - Token system
   - NFT functionality
   - DAO governance

2. Implement IPFS integration for:
   - Media storage
   - Profile pictures
   - Content backup

3. Add frontend React components for:
   - Wallet connection
   - Post creation and viewing
   - User profiles

4. Enhance security with:
   - Rate limiting
   - Request validation
   - Signature verification

## Contributing

Contributions are welcome! Please read our contribution guidelines before submitting a pull request.

## License

This project is licensed under the MIT License.
