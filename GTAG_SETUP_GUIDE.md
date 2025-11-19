# Google Tag (gtag.js) Setup Guide

## Current Issue

The **nuxt-gtag** module is configured in `nuxt.config.ts`, but Google Tag (gtag.js) is **NOT being rendered** on the production site at https://mowryagency.com.

### Why This Is Happening

The `nuxt-gtag` module reads environment variables at **build time**:

```typescript
gtag: {
  id: process.env.NUXT_PUBLIC_GTAG_ID || process.env.GOOGLE_TAG_ID || '',
  enabled: !!(process.env.NUXT_PUBLIC_GTAG_ID || process.env.GOOGLE_TAG_ID),
}
```

While `GOOGLE_TAG_ID` is set in your local `.env` file, it's **not available in Netlify's build environment** unless explicitly added to Netlify's environment variables.

## Solution: Add Environment Variable to Netlify

### Step 1: Log into Netlify

1. Go to [Netlify](https://app.netlify.com/)
2. Select your site (mowry agency)

### Step 2: Add Environment Variable

1. Navigate to **Site settings** → **Environment variables**
2. Click **Add a variable** → **Add a single variable**
3. Add:
   - **Key**: `GOOGLE_TAG_ID`
   - **Value**: `G-DZJJVW7Q02`
   - **Scopes**: Production, Deploy previews, Branch deploys (check all)

### Step 3: Trigger a New Deployment

After adding the environment variable:

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for the build to complete

### Step 4: Verify Installation

After deployment completes, verify gtag.js is installed:

#### Method 1: View Page Source
1. Visit https://mowryagency.com/quote
2. Right-click → **View Page Source**
3. Search for `G-DZJJVW7Q02`
4. You should see:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-DZJJVW7Q02"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-DZJJVW7Q02');
</script>
```

#### Method 2: Browser DevTools
1. Visit https://mowryagency.com/quote
2. Open browser DevTools (F12)
3. Go to **Console** tab
4. Type: `typeof gtag`
5. Should return: `"function"`

#### Method 3: Google Tag Assistant
1. Install [Google Tag Assistant Chrome Extension](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Visit https://mowryagency.com/quote
3. Click the extension icon
4. Should show: "Google Analytics: GA4" with tag ID `G-DZJJVW7Q02`

#### Method 4: Using mowry-leads Campaign Wizard
1. Go to http://localhost:3000/channels/google-ads/create-campaign?step=5 (in mowry-leads)
2. Enter landing page URL: `https://mowryagency.com/quote`
3. Click **Scan Landing Page**
4. Should show: "✓ Google Tag detected on your landing page"

## Alternative: Use Runtime Config (Not Recommended)

If you want the tag to work without Netlify environment variables (not recommended for production), you could hard-code the ID:

```typescript
// nuxt.config.ts
gtag: {
  id: 'G-DZJJVW7Q02', // Hard-coded
  enabled: true,
}
```

**However**, this is not recommended because:
- Exposes tracking ID in source code
- Can't use different tracking IDs for different environments
- Less flexible for team development

## Environment Variable Naming

The `nuxt-gtag` module checks for environment variables in this order:

1. `NUXT_PUBLIC_GTAG_ID` (recommended for Nuxt 3)
2. `GOOGLE_TAG_ID` (current approach)

You can use either name. The `NUXT_PUBLIC_` prefix makes it clear this is a public (client-side) variable.

## Troubleshooting

### Tag Still Not Showing After Deployment

1. **Clear cache**: The site might be using cached HTML
   - Force refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or use incognito/private browsing

2. **Check build logs**: 
   - Look for errors related to `nuxt-gtag`
   - Verify environment variable was available during build

3. **Verify module is installed**:
   ```bash
   pnpm list nuxt-gtag
   ```
   Should show: `nuxt-gtag@4.1.0`

4. **Check if module is loaded**:
   Look at build logs for: `ℹ Using Nuxt module: nuxt-gtag`

### Testing Locally

To test gtag.js locally:

1. Ensure `.env` file has:
   ```
   GOOGLE_TAG_ID=G-DZJJVW7Q02
   ```

2. Start dev server:
   ```bash
   npm run dev
   ```

3. Visit http://localhost:3000/quote

4. Open DevTools → Network tab → Filter by "gtag"
   - Should see request to: `https://www.googletagmanager.com/gtag/js?id=G-DZJJVW7Q02`

## Reference Links

- [nuxt-gtag Documentation](https://nuxt.com/modules/gtag)
- [Google Analytics Setup](https://support.google.com/analytics/answer/9304153)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Google Tag Assistant](https://support.google.com/tagassistant/)

## Contact

If issues persist, contact your development team or check:
- mowry_agency repository issues
- Netlify deployment logs
- Google Analytics account settings
