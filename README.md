# 🚀 P2P File Drop Zone

A professional, secure, and feature-rich peer-to-peer file transfer application for local area networks (LAN). Built with modern web technologies, this application enables seamless file sharing between devices on the same network without requiring external servers or cloud storage.

[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)](https://github.com/yourusername/p2p-file-drop-zone)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)](https://www.typescriptlang.org/)

## ✨ Features

### 🔐 **Security & Privacy**
- **End-to-End Encryption**: All file transfers are encrypted using WebRTC's built-in encryption
- **Local Network Only**: Files never leave your local network - no external servers involved
- **No Data Storage**: No files are stored on any servers - direct peer-to-peer transfer
- **Privacy First**: Complete control over your data with no third-party dependencies

### 📁 **File Transfer Capabilities**
- **Drag & Drop Interface**: Intuitive drag-and-drop file selection
- **Multiple File Support**: Transfer multiple files simultaneously
- **Large File Support**: Handle files up to 10GB with progress tracking
- **Resume Capability**: Automatic retry and resume for interrupted transfers
- **Progress Tracking**: Real-time transfer progress with speed indicators

### 🌐 **Network Features**
- **LAN Discovery**: Automatic discovery of peers on the same network
- **WebRTC Technology**: Modern peer-to-peer communication protocol
- **Cross-Platform**: Works on Windows, macOS, Linux, and mobile browsers
- **No Configuration**: Zero network configuration required

### 🎨 **User Experience**
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Themes**: Toggle between dark and light mode
- **Real-time Updates**: Live connection status and peer information
- **Transfer History**: Complete history of all file transfers
- **Settings Panel**: Comprehensive configuration options

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- Modern web browser with WebRTC support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/p2p-file-drop-zone.git
   cd p2p-file-drop-zone
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Start the application**
   ```bash
   # Start the signaling server (Terminal 1)
   npm run server
   
   # Start the React client (Terminal 2)
   npm run client
   ```

4. **Access the application**
   - Open your browser and navigate to `http://localhost:5173`
   - The signaling server will be running on `http://localhost:3001`

### Development Mode

```bash
# Run both server and client in development mode
npm run dev
```

## 📖 Usage

1. **Connect to Network**: Click the "Connect" button to join the local network
2. **Discover Peers**: Navigate to the "Peers" tab to see other connected devices
3. **Transfer Files**: Drag and drop files, select a peer, and click "Send Files"
4. **Monitor Progress**: Track transfers in real-time with progress indicators

## 🏗️ Architecture

### **Technology Stack**
- **Frontend**: React 18, TypeScript, TailwindCSS, Vite
- **Backend**: Node.js, Express, Socket.IO
- **P2P Communication**: WebRTC (RTCPeerConnection, RTCDataChannel)
- **Styling**: TailwindCSS with responsive design

### **Project Structure**
```
p2p-file-drop-zone/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utilities
│   └── package.json       # Frontend dependencies
├── server/                # Node.js backend
│   ├── src/               # Source code
│   └── package.json       # Backend dependencies
└── package.json           # Root package.json
```

## 🔧 Configuration

### **Environment Variables**

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# WebRTC Configuration
ICE_SERVERS=stun:stun.l.google.com:19302

# Security
CORS_ORIGIN=http://localhost:5173
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🚀 Deployment

### **Production Build**

```bash
# Build the application
npm run build

# Start production server
npm start
```

### **Docker Deployment**

```bash
# Build and run with Docker
docker build -t p2p-file-drop-zone .
docker run -p 3001:3001 p2p-file-drop-zone
```

## 🔒 Security

- **End-to-End Encryption**: All communications use WebRTC's built-in encryption
- **Local Network Only**: No files leave your local network
- **No Data Storage**: No files are stored on servers
- **Privacy First**: Complete data ownership and control

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and add tests
4. Ensure all tests pass: `npm test`
5. Commit your changes: `git commit -am 'Add new feature'`
6. Push to the branch: `git push origin feature/new-feature`
7. Submit a pull request

### **Development Setup**
```bash
# Install dependencies
npm install
cd client && npm install && cd ..

# Start development servers
npm run dev
```

## 🙏 Acknowledgments

- **WebRTC**: For enabling peer-to-peer communication
- **React Team**: For the amazing frontend framework
- **TailwindCSS**: For the utility-first CSS framework
- **Socket.IO**: For real-time communication capabilities

**Made with ❤️ by the P2P File Drop Zone Team**

*Empowering secure, local file sharing for everyone.* 
