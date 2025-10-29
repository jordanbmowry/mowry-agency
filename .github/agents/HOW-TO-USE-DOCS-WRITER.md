# How to Use the Docs Writer Agent

The Docs Writer Agent is a specification that helps maintain documentation. Here's how to use it:

## Method 1: Manual Invocation in VS Code (Recommended)

### Using GitHub Copilot Chat

1. **Open Copilot Chat** (Cmd/Ctrl + Shift + I or click the Copilot icon)

2. **Use one of these commands**:

```
@workspace Acting as the docs-writer-agent defined in .github/agents/DOCS-WRITER-AGENT.md, please review the recent changes to [file/feature] and update the relevant documentation.
```

Or more specifically:

```
@workspace I just fixed the date input mobile issue. As the docs-writer-agent, please:
1. Update the PERFORMANCE_OPTIMIZATION_REPORT.md if needed
2. Update copilot-instructions.md with any new patterns
3. Check if README.md needs updates
```

### Quick Commands

**After adding a new component:**

```
@workspace /agent docs-writer I added a new component at app/components/[name]. Please document it.
```

**After adding a new composable:**

```
@workspace /agent docs-writer I created a new composable useXYZ. Please update documentation.
```

**After a bug fix:**

```
@workspace /agent docs-writer I fixed [issue]. Please update docs with the correct pattern.
```

**General review:**

```
@workspace /agent docs-writer Please review all documentation for accuracy and completeness.
```

## Method 2: As Part of Your Workflow

### Before Committing

Add this to your commit checklist:

1. ✅ Code changes complete
2. ✅ Tests passing
3. ✅ **Ask Copilot**: "Do any docs need updating for this change?"
4. ✅ Commit with updated docs

### During Code Review

In PR descriptions, ask:

```
@workspace /agent docs-writer What documentation should be updated for this PR?
```

### Weekly Reviews

Set a calendar reminder to ask:

```
@workspace /agent docs-writer Please audit all documentation for the past week's changes.
```

## Method 3: Custom Keyboard Shortcut

You can create a VS Code snippet for quick access:

1. **Open Command Palette** (Cmd/Ctrl + Shift + P)
2. Type "Snippets: Configure User Snippets"
3. Select "markdown.json"
4. Add this snippet:

```json
{
  "Invoke Docs Writer Agent": {
    "prefix": "@docs",
    "body": [
      "@workspace Acting as the docs-writer-agent defined in .github/agents/DOCS-WRITER-AGENT.md, please $1"
    ],
    "description": "Invoke the docs writer agent"
  }
}
```

Now type `@docs` in Copilot Chat and press Tab to auto-complete!

## Method 4: Git Hooks (Optional Automation)

Create a post-commit hook to remind you:

```bash
# .git/hooks/post-commit
#!/bin/bash

echo ""
echo "📚 Documentation Reminder:"
echo "Consider running: @workspace /agent docs-writer review recent changes"
echo ""
```

Make it executable:

```bash
chmod +x .git/hooks/post-commit
```

## Method 5: GitHub Actions (Future Enhancement)

The `.github/workflows/docs-maintenance.yml` file is included but needs fixes.
It's designed to:

- Create GitHub issues when documentation might need updates
- Validate markdown syntax
- Check for broken links

To enable it, the YAML syntax needs to be corrected.

## What Gets Updated

When you invoke the agent, it can update:

- ✅ `README.md` - Project overview and getting started
- ✅ `.github/copilot-instructions.md` - AI context and patterns
- ✅ `PERFORMANCE_OPTIMIZATION_REPORT.md` - Performance metrics
- ✅ `ERROR_HANDLING_GUIDE.md` - Error patterns
- ✅ `TCPA_COMPLIANCE_COMPLETE.md` - Compliance docs
- ✅ `SUPABASE_SETUP.md` - Database setup
- ✅ Component-specific docs

## Best Practices

### DO ✅

- Invoke the agent after significant changes
- Be specific about what changed
- Review the agent's suggestions before committing
- Use it for both adding and removing outdated info

### DON'T ❌

- Rely on it to catch everything automatically
- Skip manual review of generated documentation
- Forget to commit documentation changes with code changes
- Wait until end of project to update docs

## Examples

### Example 1: After Mobile Fix

```
@workspace I just fixed the date input rendering on mobile by:
1. Adding custom CSS to FormInput.vue
2. Setting min-height to 48px on mobile
3. Adding font-size: 16px to prevent iOS zoom

As the docs-writer-agent, please:
- Update copilot-instructions.md with this mobile optimization pattern
- Add this to any relevant troubleshooting docs
- Update code examples if FormInput usage changed
```

### Example 2: After Performance Optimization

```
@workspace I optimized performance by:
- Adding fetchpriority="high" to LCP image
- Adding resource hints for Google Fonts
- Improving font loading strategy

As docs-writer-agent, please:
- Update PERFORMANCE_OPTIMIZATION_REPORT.md with new metrics
- Document the optimization patterns in copilot-instructions.md
- Update README if performance claims changed
```

### Example 3: New Feature

```
@workspace I added a new feature: CSV export for leads.
Files changed:
- app/composables/useLeadsExport.ts (new)
- app/components/admin/LeadsTable.vue (updated)

As docs-writer-agent, please:
- Add this feature to README.md feature list
- Document the useLeadsExport composable in copilot-instructions.md
- Add usage examples for the CSV export functionality
```

## Monitoring Documentation Health

### Monthly Checklist

Run these commands monthly:

```
@workspace /agent docs-writer Please check:
1. Are all code examples still valid?
2. Are file paths up to date?
3. Are there any new patterns to document?
4. Are version numbers current?
5. Do screenshots need updating?
```

### After Major Releases

```
@workspace /agent docs-writer We just released v2.0. Please:
1. Update all version references
2. Create a migration guide if needed
3. Update the changelog
4. Review all breaking changes documentation
```

## Getting Help

If you're not sure what to ask the agent:

```
@workspace /agent docs-writer What documentation would you recommend updating based on my recent commits?
```

Or for specific guidance:

```
@workspace /agent docs-writer I'm about to [make changes]. What documentation should I prepare to update?
```

---

**Remember**: The docs-writer-agent is a guide - it helps you maintain better documentation but you still review and approve all changes!
