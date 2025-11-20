<!-- 79b81ba3-dd0f-436d-8a66-7ca38232017d 4072c73a-aab7-4e92-b9f7-3729ae94a64d -->
# Local Proxy Server for LexaCut - Implementation Plan

## Overview

Create a lightweight local HTTP proxy server that starts automatically with the LexaCut plugin, bypasses firewall restrictions on SketchUp, and securely forwards requests to cloud API while keeping proprietary algorithms secret on the server side.

## Architecture

```
SketchUp + LexaCut Plugin (Ruby)
    ↓ HTTP (localhost:8080)
Local Proxy Server (Go/Rust binary)
    ↓ HTTPS (internet)
LexaPlus Cloud API (Your algorithms)
```

## Phase 1: Proxy Server Development

### 1.1 Technology Stack

**Language:** Go (recommended) or Rust

- Lightweight (single 5-10MB binary)
- Cross-platform compilation
- Built-in HTTP server
- Excellent concurrency

### 1.2 Core Features

- HTTP server listening on configurable port (default 8080)
- Health check endpoint: `GET /health`
- Request forwarding: All other requests → cloud API
- Request/response logging
- Graceful shutdown handling
- Single instance enforcement (prevent multiple proxies)

### 1.3 API Endpoints

```
GET  /health                    → Returns 200 OK
POST /api/v1/analyze/cutlist    → Forward to cloud
POST /api/v1/optimize/packing   → Forward to cloud
GET  /api/v1/license/status     → Check license validity
POST /api/v1/license/activate   → Initial activation (requires internet)
```

### 1.4 Configuration

- Cloud API base URL: `https://api.lexaplus.com`
- License key storage location
- Machine fingerprint generation
- Port selection (8080, fallback to 8081-8090)

## Phase 2: Licensing System

### 2.1 License Flow

**First-time Activation (requires internet):**

1. User enters license key in SketchUp dialog
2. Plugin calls proxy: `POST /api/v1/license/activate`
3. Proxy validates with cloud API
4. Cloud returns encrypted license file
5. Proxy saves to local disk
6. Returns success to plugin

**Subsequent Use (offline):**

1. Plugin calls proxy
2. Proxy reads local license file
3. Validates: expiry date + hardware fingerprint
4. If valid: forwards request to cloud
5. If invalid: returns 403 Forbidden

### 2.2 License File Structure

```json
{
  "license_key": "LEXACUT-XXXX-XXXX-XXXX",
  "customer_id": "uuid",
  "product": "lexacut-premium",
  "expires_at": "2025-12-31T23:59:59Z",
  "machine_id": "abc123def456",
  "signature": "encrypted_signature_here"
}
```

### 2.3 Security Measures

- Hardware fingerprint (MAC address + CPU ID hash)
- Asymmetric encryption (license signed by private key, validated with embedded public key)
- License file encrypted at rest
- API key never exposed to SketchUp plugin
- Request signing to prevent tampering

## Phase 3: Ruby Plugin Integration

### 3.1 New Files

```
src/ladb_lexacut/ruby/helper/proxy_helper.rb        (Proxy management)
src/ladb_lexacut/ruby/helper/lexaplus_api_helper.rb (API calls via proxy)
src/ladb_lexacut/bin/osx/lexacut-proxy              (Mac binary)
src/ladb_lexacut/bin/win/lexacut-proxy.exe          (Windows binary)
```

### 3.2 Proxy Management Logic

**On Plugin Load (plugin.rb setup):**

- Check if proxy already running (`GET localhost:8080/health`)
- If not running: start proxy process
- Wait for proxy to be ready (max 5 seconds)
- If fails: show error to user

**On Plugin Unload:**

- Send shutdown signal to proxy
- Wait for graceful shutdown
- If timeout: force kill process

### 3.3 API Helper Updates

**Modify existing workers:**

- `cutlist_packing_worker.rb` → Use proxy API instead of local Packy
- `cutlist_estimate_worker.rb` → Optional analysis via proxy
- New custom analysis workers

**Fallback Strategy:**

- If proxy unavailable: use local Packy (basic features)
- Show "Limited Mode" banner in UI
- Prompt user to check license/proxy status

### 3.4 UI Integration

**Settings Tab Additions:**

- License key input field
- "Activate License" button
- License status display (Active/Expired/Invalid)
- Proxy status indicator (Running/Stopped/Error)
- "Use Cloud Analysis" toggle

## Phase 4: Build System

### 4.1 Proxy Server Build

**Cross-compilation targets:**

- macOS Intel (darwin/amd64)
- macOS Apple Silicon (darwin/arm64)
- Windows x64 (windows/amd64)

**Build script (build-proxy.sh):**

```bash
# Go example
GOOS=darwin GOARCH=amd64 go build -o bin/osx/lexacut-proxy
GOOS=darwin GOARCH=arm64 go build -o bin/osx/lexacut-proxy-arm64
GOOS=windows GOARCH=amd64 go build -o bin/win/lexacut-proxy.exe
```

### 4.2 Gulp Integration

**Update gulpfile.js:**

- Add task to copy proxy binaries to dist
- Ensure binaries included in .rbz package
- Set executable permissions on macOS/Linux

### 4.3 Version Synchronization

- Proxy version must match plugin version
- Plugin checks proxy version on startup
- Warns if mismatch detected

## Phase 5: Error Handling & UX

### 5.1 Error Scenarios

1. **Proxy fails to start:** Show dialog with troubleshooting steps
2. **License invalid:** Show activation dialog
3. **Cloud API unreachable:** Use cached results or fallback to local
4. **Port already in use:** Try alternate ports, show error if all fail
5. **Antivirus blocks proxy:** Instructions to whitelist

### 5.2 User Notifications

- First run: "LexaCut is starting background services..."
- License needed: "Activate your license to use premium features"
- Offline mode: "Using local processing (limited features)"
- Error state: Clear error messages with solutions

### 5.3 Logging

- Proxy logs to: `~/Library/Logs/LexaCut/proxy.log` (Mac)
- Plugin logs to: SketchUp Ruby console
- Include timestamps, request IDs for debugging
- Log rotation (max 10MB, keep 5 files)

## Phase 6: Testing Strategy

### 6.1 Proxy Server Tests

- Unit tests for each endpoint
- License validation logic
- Port selection algorithm
- Shutdown graceful handling
- Cloud API communication (mocked)

### 6.2 Integration Tests

- Plugin starts proxy successfully
- Plugin communicates with proxy
- Proxy forwards to cloud API
- License activation flow
- Offline mode fallback

### 6.3 Firewall Scenarios

- Test with SketchUp blocked by firewall
- Verify proxy can still access internet
- Test various corporate firewall configurations
- Proxy behind corporate proxy (HTTP_PROXY env)

### 6.4 User Acceptance Testing

- Fresh installation on clean machine
- License activation process
- Normal operation workflow
- Error recovery scenarios
- Uninstallation cleanup

## Phase 7: Deployment & Distribution

### 7.1 Packaging

- Include proxy binaries in .rbz
- Code signing for Mac binary (prevent Gatekeeper issues)
- Digital signature for Windows .exe (prevent SmartScreen)
- README with troubleshooting guide

### 7.2 Installation Instructions

**For Users:**

1. Install lexacut-v8.x.x.rbz normally
2. On first run, approve proxy executable
3. Enter license key when prompted
4. Allow proxy through firewall if asked

**For IT Admins:**

- Firewall whitelist: lexacut-proxy.exe
- Outbound HTTPS to: api.lexaplus.com
- Local port: 8080 (configurable)

### 7.3 Update Strategy

- Plugin checks for proxy updates
- Auto-download new proxy binary if available
- Replace on next SketchUp restart
- Backward compatibility for 2 versions

## Security Considerations

### Critical Requirements

1. **Never expose API keys** - Only in proxy, not plugin
2. **Validate all inputs** - Prevent injection attacks
3. **Rate limiting** - Prevent abuse (e.g., 100 req/min)
4. **Audit logging** - Track all API usage
5. **Encrypted communication** - Use HTTPS to cloud
6. **License binding** - Tie to hardware, prevent sharing

### Threat Model

- **Bypassing proxy:** Not possible, plugin only talks to localhost
- **Reverse engineering:** Binary harder than Ruby source
- **License sharing:** Hardware fingerprint prevents
- **Cracked SketchUp:** Doesn't matter, proxy is separately licensed

## Performance Targets

- Proxy startup: < 1 second
- License validation: < 10ms (local)
- API request latency: < 100ms overhead
- Memory footprint: < 50MB
- CPU usage: < 5% idle, < 15% under load

## Rollback Plan

If major issues found:

1. Release plugin update that disables proxy
2. Fallback to local Packy automatically
3. Investigate and fix proxy issues
4. Re-enable in future version

## Success Metrics

- **Adoption rate:** % users with active licenses
- **API success rate:** > 99.5% requests successful
- **Support tickets:** < 5% related to proxy issues
- **Performance:** 95th percentile latency < 500ms

## Files to Create/Modify

### New Files (Proxy Server)

- `proxy/main.go` - Entry point
- `proxy/server/server.go` - HTTP server
- `proxy/license/validator.go` - License logic
- `proxy/client/cloud.go` - Cloud API client
- `proxy/config/config.go` - Configuration
- `proxy/Makefile` - Build automation

### New Files (Plugin)

- `src/ladb_lexacut/ruby/helper/proxy_helper.rb`
- `src/ladb_lexacut/ruby/helper/lexaplus_api_helper.rb`
- `src/ladb_lexacut/ruby/controller/license_controller.rb`

### Modified Files

- `src/lexacut.rb` - Start proxy on load
- `src/ladb_lexacut/ruby/plugin.rb` - Proxy management
- `src/ladb_lexacut/ruby/worker/cutlist/cutlist_packing_worker.rb` - Use API
- `src/ladb_lexacut/twig/tabs/settings/tab.twig` - License UI
- `build/gulpfile.js` - Include binaries in build

## Timeline Estimate

- Phase 1 (Proxy Server): 1 week
- Phase 2 (Licensing): 3-4 days
- Phase 3 (Ruby Integration): 3-4 days
- Phase 4 (Build System): 1-2 days
- Phase 5 (Error Handling): 2-3 days
- Phase 6 (Testing): 1 week
- Phase 7 (Deployment): 2-3 days

**Total: 3-4 weeks for full implementation**

### To-dos

- [ ] Reposition or remove the LexaCut branding badge in .ladb-header::before