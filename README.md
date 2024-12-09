# Project Rever

A decentralized social network built on the Avalanche blockchain.

## State of the Project

Current Status: **Initial Development - Phase 1**

### Completed Features
- Basic Express.js backend server setup
- Avalanche network integration (Fuji testnet)
- Wallet authentication system
  - Connect wallet endpoint
  - Signature verification
  - Basic authentication middleware
- Initial React frontend
  - Modern landing page with wallet connection
  - MetaMask integration
  - Wallet connection UI
  - Basic error handling
  - Responsive design with Tailwind CSS

### In Progress
- Feed page implementation
- Enhanced security measures for wallet connection
- Token system implementation
- Smart contract development

### Next Steps
1. Complete feed page development
2. Implement token mechanics and smart contracts
3. Add IPFS integration for content storage
4. Build out post creation and interaction features
5. Develop user profile system

## Features (Planned)

- Wallet-based authentication ✓ (Basic Implementation)
- Decentralized content creation and storage
- Token-based engagement
- NFT integration
- DAO governance
- Privacy features
- Gamification

## Tech Stack

### Current Implementation
- Backend: Node.js with Express.js
- Frontend: React with ethers.js
- Styling: Tailwind CSS with shadcn/ui components
- Blockchain: Avalanche (Fuji Testnet)
- Authentication: MetaMask wallet integration

### To Be Implemented
- Smart Contracts: Solidity
- Storage: IPFS
- Database: Hybrid approach (on-chain metadata, off-chain indexing)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MetaMask wallet
- MetaMask configured for Avalanche Fuji Testnet

### Installation

1. Clone the repository:
```bash
git clone https://github.com/cyph3rasi/Project-Rever.git
cd Project-Rever
```

2. Install main project dependencies:
```bash
npm install
```

3. Install client dependencies and build frontend:
```bash
cd src/client
npm install
npm run build
cd ../..
```

4. Create environment file:
```bash
cp .env.example .env
```

5. Update the environment variables in `.env` with your configuration

### Development

You can run the project in two ways:

#### Option 1: Full Stack Development
Run the Express server which serves the built React app:
```bash
npm run dev
```
Access the application at http://localhost:3334

#### Option 2: Separate Development Servers
In one terminal, start the backend:
```bash
npm run dev
```

In another terminal, start the React development server:
```bash
cd src/client
npm start
```

This method provides hot reloading for frontend changes.

### Building for Production

To create a production build:
```bash
npm run client-build
```

## Project Structure

```
├── src/
│   ├── app.js           # Server entry point
│   ├── config/          # Configuration files
│   │   └── avalanche.js # Avalanche network setup
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   └── client/          # React frontend application
│       ├── src/         # React source files
│       │   ├── components/  # React components
│       │   │   ├── ui/     # UI components
│       │   │   └── LandingPage.jsx
│       │   ├── lib/        # Utility functions
│       │   └── App.js      # Main React component
│       └── build/       # Compiled frontend
├── .env.example         # Environment variables template
├── .gitignore          # Git ignore rules
├── package.json        # Project dependencies and scripts
└── README.md           # Project documentation
```

## API Endpoints

### Authentication
- POST `/api/auth/connect-wallet` - Connect wallet
- POST `/api/auth/verify-signature` - Verify wallet signature
- POST `/api/auth/logout` - Logout

### Posts (To Be Implemented)
- POST `/api/posts` - Create a new post
- GET `/api/posts` - Get all posts
- GET `/api/posts/:id` - Get post by ID
- POST `/api/posts/:id/like` - Like a post
- POST `/api/posts/:id/repost` - Repost
- POST `/api/posts/:id/mint-nft` - Mint post as NFT

### Users (To Be Implemented)
- GET `/api/users/profile/:address` - Get user profile
- PUT `/api/users/profile` - Update user profile
- GET `/api/users/:address/posts` - Get user's posts
- GET `/api/users/:address/nfts` - Get user's NFTs

### Token Operations (To Be Implemented)
- GET `/api/tokens/balance` - Get user's token balance
- POST `/api/tokens/tip` - Send tip to content creator
- GET `/api/tokens/rewards` - Get available rewards

## Contributing

Contributions are welcome! Please read our contribution guidelines before submitting a pull request.

## License

This project is licensed under the MIT License.
