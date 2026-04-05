---
name: anthropic-all-skills-windsurf
description: Complete Anthropic skills suite for Windsurf IDE
version: 1.0.0
---

# 🔄 Anthropic Master Rules for Windsurf

> **Source**: `.ai/master-skill.md` (Managed by Rosetta)

All 17 Anthropic skills are available in this Windsurf environment.

---

## Windsurf Commands

```
/use anthropic-skills          # Load all skills
/skill docx                    # Word documents
/skill pdf                     # PDF operations
/skill webapp-testing          # Test web apps
/skill mcp-builder             # Build MCP servers
/skill brand-guidelines        # Brand consistency
/skill web-artifacts-builder   # Build web UIs
```

---

## Available Skills (17 Total)

### **Core Capabilities**

#### 📄 Document Suite
- `/skill docx` - Professional Word documents
- `/skill pdf` - PDF creation & extraction
- `/skill pptx` - PowerPoint presentations
- `/skill xlsx` - Excel spreadsheets

#### 🎨 Design & Creative
- `/skill canvas-design` - Visual design
- `/skill theme-factory` - Theme generation
- `/skill brand-guidelines` - Brand compliance
- `/skill frontend-design` - UI/UX patterns
- `/skill algorithmic-art` - Procedural art
- `/skill slack-gif-creator` - GIF creation

#### 🧪 Web & Development
- `/skill webapp-testing` - Web app QA
- `/skill web-artifacts-builder` - Interactive UI
- `/skill claude-api` - API integration
- `/skill mcp-builder` - Protocol servers
- `/skill skill-creator` - Create skills

#### 💬 Communication
- `/skill internal-comms` - Professional messaging
- `/skill doc-coauthoring` - Collaborative editing

---

## Windsurf Workflow Examples

### Create Professional Document
```
1. /skill docx
   "Create a professional proposal with our branding"

2. /skill brand-guidelines
   "Apply company colors and fonts"

3. /skill pdf
   "Export to PDF format"
```

### Build & Test Web App
```
1. /skill frontend-design
   "Design the login flow"

2. /skill web-artifacts-builder
   "Build interactive components"

3. /skill webapp-testing
   "Run full QA test suite"

4. /skill theme-factory
   "Apply theme styling"
```

### API Integration
```
1. /skill claude-api
   "Review API documentation"

2. /skill mcp-builder
   "Build custom MCP server"

3. /skill skill-creator
   "Package as reusable skill"

4. /skill webapp-testing
   "Integration testing"
```

### Design & Branding
```
1. /skill brand-guidelines
   "Verify brand compliance"

2. /skill theme-factory
   "Generate color palette"

3. /skill canvas-design
   "Create visual designs"

4. /skill algorithmic-art
   "Generate artistic elements"

5. /skill slack-gif-creator
   "Export for social media"
```

---

## Windsurf Best Practices

### ✅ DO
- Use skill commands for specialized tasks
- Load skills before complex operations
- Test outputs in preview mode first
- Use extended thinking for complex problems
- Reference skill documentation

### ❌ DON'T
- Skip skill selection
- Mix incompatible document formats
- Deploy untested code
- Ignore brand guidelines
- Use generic operations when skills exist

---

## Extended Thinking in Windsurf

For complex tasks, enable thinking:

```
/think
Consider the best approach for: [complex task]
Then /skill [appropriate-skill]
```

---

## Integration with Antigravity

Both IDEs use the same **master skill** (`.ai/master-skill.md`):

- **Antigravity** → `.agent/skills/project-skill.md`
- **Windsurf** → `.windsurf/rules/rosetta-rules.md`
- **Master** → `.ai/master-skill.md`

---

## Skill Resources

```
Skills Location: c:\Users\quick\skills\skills\

Available:
├── algorithmic-art/
├── brand-guidelines/
├── canvas-design/
├── claude-api/
├── doc-coauthoring/
├── docx/
├── frontend-design/
├── internal-comms/
├── mcp-builder/
├── pdf/
├── pptx/
├── skill-creator/
├── slack-gif-creator/
├── theme-factory/
├── web-artifacts-builder/
├── webapp-testing/
└── xlsx/
```

---

## Operating Principles

### Decision Framework
1. **Identify task type** - Document? Web? Design? API?
2. **Select skill** - Use specialized skill
3. **Reference docs** - Read skill documentation
4. **Execute** - Run skill command
5. **Verify** - Test output
6. **Iterate** - Refine as needed

### Constraint Handling
- **Brand Mode**: Strict compliance with guidelines
- **Testing Mode**: Comprehensive QA before deployment
- **API Mode**: Proper token management and error handling
- **Design Mode**: Consistent with theme and branding

---

## Troubleshooting

### Skill Not Available
```
/use anthropic-skills
Then try again
```

### Format Issues
```
Check skill documentation with: /skill [name]
Look for constraints and requirements
```

### Integration Problems
```
1. Verify API keys with: /skill claude-api
2. Check network connectivity
3. Review error logs
```

---

## Advanced Usage

### Creating Custom Workflows

```
/workflow "document-pipeline"
  1. Create document with docx
  2. Apply branding with brand-guidelines
  3. Add visuals with canvas-design
  4. Export to pdf
  5. Create presentation with pptx
```

### Chaining Skills

```
/skill docx → /skill pdf → /skill internal-comms
Creates document → Exports → Sends via messaging
```

---

## Configuration

```yaml
windsurf_config:
  agent_mode: advanced
  extended_thinking: enabled
  skill_mode: all_anthropic_skills
  brand_compliance: strict
  testing_level: comprehensive
  api_integration: enabled
```

---

## Resources

- **Master Skill**: `.ai/master-skill.md`
- **Anthropic Skills**: https://github.com/anthropics/skills
- **Skills Specification**: https://agentskills.io/specification
- **Local Skills**: `c:\Users\quick\skills\`

---

**Version**: 1.0.0  
**Updated**: 2026-04-03  
**IDE**: Windsurf  
**Status**: ✅ Active & Synced

Last synced with master skill: 2026-04-03
