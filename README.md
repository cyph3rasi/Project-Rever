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
  - MetaMask integration
  - Wallet connection UI
  - Basic error handling

### In Progress
- Enhanced security measures for wallet connection
- Token system implementation
- Smart contract development

### Next Steps
1. Implement token mechanics and smart contracts
2. Add IPFS integration for content storage
3. Build out post creation and interaction features
4. Develop user profile system

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
- Blockchain: Avalanche (Fuji Testnet)
- Authentication: MetaMask wallet integration

### To Be Implemented
- Smart Contracts: Solidity
- Storage: IPFS
- Database: TBD based on scaling requirements

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MetaMask wallet

### Installation

1. Clone the repository:
```bash
git clone https://github.com/cyph3rasi/Project-Rever.git
cd Project-Rever
```

2. Run the setup script (installs all dependencies and builds the frontend):
```bash
npm run setup
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the environment variables in `.env` with your configuration

### Running the Application

Start the development server:
```bash
npm run dev
```

This will start the server on port 3334, serving both the API and frontend.

After making frontend changes, rebuild the React app:
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
│       └── build/       # Compiled frontend (served by Express)
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

### Users (To Be Implemented)
- GET `/api/users/profile/:address` - Get user profile
- PUT `/api/users/profile` - Update user profile
- GET `/api/users/:address/posts` - Get user's posts

## Development

### Frontend Development
The frontend is built using Create React App and is served by the Express backend. After making changes to the frontend code:

1. Rebuild the frontend:
```bash
npm run client-build
```

2. The changes will be automatically served by the Express backend

### Backend Development
The backend uses nodemon in development mode, so changes to server files will automatically restart the server.

## Contributing

Contributions are welcome! Please read our contribution guidelines before submitting a pull request.

## License

This project is licensed under the MIT License.
