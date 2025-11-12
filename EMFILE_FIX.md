# Fix "EMFILE: too many open files" Error

This error occurs when the Node.js file watcher exceeds the system's limit for open files. This is common on macOS.

## Quick Fix (Temporary - Current Session Only)

Run these commands in your terminal:

```bash
# Increase the limit for the current session
ulimit -n 10240

# Then start the dev server
pnpm dev
```

## Permanent Fix (Recommended)

### Option 1: System-wide limit increase (macOS)

1. Create or edit the limit configuration files:

```bash
# Create the limit files
sudo nano /Library/LaunchDaemons/limit.maxfiles.plist
```

2. Add this content:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>limit.maxfiles</string>
    <key>ProgramArguments</key>
    <array>
      <string>launchctl</string>
      <string>limit</string>
      <string>maxfiles</string>
      <string>65536</string>
      <string>200000</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>ServiceIPC</key>
    <false/>
  </dict>
</plist>
```

3. Set proper permissions and load it:

```bash
sudo chown root:wheel /Library/LaunchDaemons/limit.maxfiles.plist
sudo chmod 644 /Library/LaunchDaemons/limit.maxfiles.plist
sudo launchctl load -w /Library/LaunchDaemons/limit.maxfiles.plist
```

4. Restart your terminal or computer for changes to take effect.

### Option 2: Add to your shell profile

Add this to your `~/.zshrc` or `~/.bashrc`:

```bash
# Increase file descriptor limit
ulimit -n 10240
```

Then reload your shell:
```bash
source ~/.zshrc  # or source ~/.bashrc
```

## Verify the Fix

Check your current limit:
```bash
ulimit -n
```

Should show `10240` or higher.

## Alternative: Reduce File Watching

If you can't increase the limit, reduce what Nuxt watches:

Create/edit `nuxt.config.ts` to exclude unnecessary directories:

```typescript
export default defineNuxtConfig({
  // ... other config
  vite: {
    server: {
      watch: {
        usePolling: false,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/dist/**',
          '**/.output/**',
          '**/.nuxt/**',
          '**/playwright-report/**',
          '**/test-results/**',
        ],
      },
    },
  },
})
```

## After Fixing

1. Kill any existing dev server processes:
```bash
lsof -ti:3000 | xargs kill -9
```

2. Start the dev server:
```bash
pnpm dev
```

3. Run Playwright tests in another terminal:
```bash
pnpm test:e2e
```
