# P2P File Drop Zone - Debugging Guide

## 🚀 Current Status

✅ **Both servers are running successfully:**
- Signaling Server: `http://localhost:3001` ✅
- React Client: `http://localhost:5173` ✅
- WebSocket API: Accessible ✅

## 🔍 Testing Results

### Server Tests
- ✅ Signaling Server Health Check: PASSED
- ✅ WebSocket API Status: PASSED
- ✅ CORS Configuration: PASSED

### Application Tests
- ✅ React Development Server: RUNNING
- ✅ Application Loading: SUCCESSFUL
- ✅ Browser Compatibility: SUPPORTED

## 🐛 Common Issues & Solutions

### 1. Servers Not Starting

**Symptoms:**
- "Unable to connect to the remote server" error
- Ports 3001 or 5173 not listening

**Solutions:**
```bash
# Check if ports are in use
netstat -an | findstr ":3001\|:5173"

# Kill processes using the ports
taskkill /F /PID <PID>

# Restart servers
cd server && npm run dev
cd client && npm run dev
```

### 2. WebSocket Connection Issues

**Symptoms:**
- "Failed to connect to signaling server" error
- Peers not connecting

**Solutions:**
```bash
# Check WebSocket server
curl http://localhost:3001/health

# Check WebSocket API
curl http://localhost:3001/api/status

# Verify CORS settings in server/index.js
```

### 3. React App Not Loading

**Symptoms:**
- Blank page or "Cannot connect" error
- JavaScript errors in console

**Solutions:**
```bash
# Check React dev server
curl http://localhost:5173

# Check for build errors
cd client && npm run build

# Clear browser cache and reload
```

### 4. File Transfer Issues

**Symptoms:**
- Files not transferring
- Transfer stuck at 0%
- WebRTC connection failures

**Solutions:**
- Check browser WebRTC support
- Verify STUN server availability
- Check firewall settings
- Ensure both peers are on same LAN

### 5. Peer Discovery Issues

**Symptoms:**
- No peers showing up
- "No Peers Connected" message

**Solutions:**
- Verify all devices are on same LAN
- Check network firewall settings
- Ensure signaling server is accessible
- Try refreshing the page

## 🔧 Debug Commands

### Server Status Check
```bash
# Test signaling server
curl http://localhost:3001/health

# Test API status
curl http://localhost:3001/api/status

# Test React client
curl http://localhost:5173
```

### Process Management
```bash
# Find processes using ports
netstat -ano | findstr ":3001\|:5173"

# Kill specific process
taskkill /F /PID <PID>

# Check Node.js processes
tasklist | findstr node
```

### Log Analysis
```bash
# Check server logs
cd server && npm run dev

# Check client logs
cd client && npm run dev

# Monitor network activity
netstat -an | findstr ":3001\|:5173"
```

## 🧪 Testing Scenarios

### 1. Single Device Test
- Open multiple browser tabs
- Test UI functionality
- Verify theme switching
- Test file selection

### 2. Multi-Device Test
- Open on different devices
- Verify peer discovery
- Test file transfers
- Check transfer history

### 3. Network Test
- Test with different network configurations
- Verify LAN-only operation
- Test firewall scenarios

### 4. File Transfer Test
- Test various file types
- Test large files
- Test multiple files
- Test transfer cancellation

## 📊 Performance Monitoring

### Server Metrics
- Connected peers count
- Active transfers
- Server uptime
- Memory usage

### Client Metrics
- WebRTC connection status
- Transfer progress
- File processing speed
- Error rates

## 🛠️ Development Tools

### Browser Developer Tools
- **Console**: Check for JavaScript errors
- **Network**: Monitor WebSocket connections
- **Application**: Check localStorage and sessionStorage
- **Performance**: Monitor transfer speeds

### Server Monitoring
- **Process Manager**: Monitor Node.js processes
- **Network Monitor**: Check port usage
- **Log Analysis**: Review server logs

## 🔒 Security Considerations

### Network Security
- Verify LAN-only operation
- Check for data leakage
- Monitor WebRTC connections
- Validate encryption

### Browser Security
- Check HTTPS requirements
- Verify CORS settings
- Monitor localStorage usage
- Validate file access permissions

## 📝 Troubleshooting Checklist

- [ ] Both servers running (3001, 5173)
- [ ] WebSocket connection established
- [ ] Browser supports WebRTC
- [ ] Devices on same LAN
- [ ] Firewall allows connections
- [ ] No JavaScript errors in console
- [ ] File permissions correct
- [ ] Network connectivity stable

## 🆘 Emergency Procedures

### Complete Reset
```bash
# Stop all processes
taskkill /F /IM node.exe

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm run install:all

# Restart servers
npm run dev
```

### Alternative Startup
```bash
# Manual server start
cd server && node index.js

# Manual client start
cd client && npm run dev
```

## 📞 Support Information

- **Application URL**: http://localhost:5173
- **Server Health**: http://localhost:3001/health
- **API Status**: http://localhost:3001/api/status
- **Test Page**: test.html

---

**Last Updated**: 2025-07-05
**Status**: ✅ All Systems Operational 