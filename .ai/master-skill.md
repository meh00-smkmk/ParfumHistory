---
name: anthropic-master-skill
description: Master skill aggregating all Anthropic capabilities for enhanced AI agent performance
version: 1.0.0
author: Anthropic + Rosetta
last-updated: 2026-04-03
---

# 🧠 Anthropic Master Skill - All Capabilities

This is the single source of truth for all AI agent capabilities. Synced to:
- **Antigravity** → `.agent/skills/project-skill.md`
- **Windsurf** → `.windsurf/rules/rosetta-rules.md`
- **Claude Code** → `CLAUDE.md`

---

## Core Directives

### 1. INTELLIGENT THINKING
- Use extended thinking for complex problems
- Break down tasks into logical steps
- Explain your reasoning process
- Verify solutions before presenting

### 2. SKILL-BASED OPERATIONS
Use the appropriate skill for each task type:

#### **API & Integration** (`claude-api`)
- Understand Anthropic's API architecture
- Handle token management efficiently
- Implement proper error handling
- Support streaming and batch operations

#### **Document Creation & Editing** (`docx`, `pdf`, `pptx`, `xlsx`)
- Create professional documents with formatting
- Handle complex layouts and styling
- Extract and manipulate document data
- Support multi-format workflows

#### **Web & UI Development** (`webapp-testing`, `web-artifacts-builder`, `frontend-design`)
- Test web applications comprehensively
- Build interactive web artifacts
- Design beautiful, responsive UIs
- Ensure cross-browser compatibility

#### **Creative & Design** (`canvas-design`, `theme-factory`, `brand-guidelines`, `frontend-design`, `algorithmic-art`)
- Generate artistic and visual content
- Maintain brand consistency
- Create custom themes and palettes
- Produce algorithmic art patterns

#### **Communication Tools** (`internal-comms`, `slack-gif-creator`, `doc-coauthoring`)
- Draft professional communications
- Create engaging Slack content
- Enable collaborative document editing
- Support team workflows

#### **Development Tools** (`mcp-builder`, `skill-creator`)
- Build Model Context Protocol (MCP) servers
- Create custom skills for AI agents
- Package and distribute extensions
- Maintain skill specifications

---

## Skill Directories

### Available Skills (17 Total)

```
skills/
├── algorithmic-art/          # Generate procedural art and patterns
├── brand-guidelines/         # Maintain brand consistency
├── canvas-design/            # Create visual designs on canvas
├── claude-api/               # Anthropic API integration
├── doc-coauthoring/          # Collaborative document editing
├── docx/                     # Word document creation/editing
├── frontend-design/          # Modern UI/UX design patterns
├── internal-comms/           # Internal communications templates
├── mcp-builder/              # Build Model Context Protocol servers
├── pdf/                      # PDF creation and manipulation
├── pptx/                     # PowerPoint presentation creation
├── skill-creator/            # Create and package AI skills
├── slack-gif-creator/        # Generate Slack-ready GIFs
├── theme-factory/            # Dynamic theme generation
├── web-artifacts-builder/    # Create interactive web artifacts
├── webapp-testing/           # Comprehensive web app testing
└── xlsx/                     # Excel spreadsheet operations
```

---

## How to Use Skills

### **In Antigravity**
```
@skill algorithmic-art: Generate a mandala pattern
@skill webapp-testing: Test the login flow
@skill docx: Create a professional proposal
```

### **In Windsurf**
```
/use skill-creator
/use mcp-builder
/use webapp-testing
```

### **In Claude Code**
```
/skill pdf
/skill docx
/skill webapp-testing
```

---

## Task-Specific Workflows

### 📊 Data & Analysis
1. Use `xlsx` for spreadsheet operations
2. Use `pdf` for data extraction
3. Use `claude-api` for API-based analysis
4. Document findings with `docx` or `pptx`

### 🎨 Creative & Design
1. Use `brand-guidelines` for consistency
2. Use `theme-factory` for color schemes
3. Use `algorithmic-art` for visual generation
4. Use `canvas-design` for detailed designs
5. Export as `web-artifacts-builder`

### 🧪 Web Development & Testing
1. Use `webapp-testing` for comprehensive QA
2. Use `web-artifacts-builder` for UI creation
3. Use `frontend-design` for UX patterns
4. Document with `doc-coauthoring`

### 📱 API & Integration
1. Consult `claude-api` documentation
2. Use `mcp-builder` for protocol servers
3. Use `skill-creator` for custom capabilities
4. Test with `webapp-testing`

### 📝 Communication & Documentation
1. Use `internal-comms` for company messaging
2. Use `doc-coauthoring` for collaborative editing
3. Use `docx` for formal documents
4. Use `pptx` for presentations
5. Use `slack-gif-creator` for social media

---

## Best Practices

### ✅ DO
- ✅ Load the appropriate skill before starting a task
- ✅ Reference skill documentation for complex operations
- ✅ Test outputs against requirements
- ✅ Maintain brand and style consistency
- ✅ Use version control for skill updates
- ✅ Document custom skill modifications

### ❌ DON'T
- ❌ Use generic operations when specialized skills exist
- ❌ Ignore skill-specific constraints or limitations
- ❌ Modify core skill files without version control
- ❌ Skip testing for critical document/presentation creation
- ❌ Use outdated skill versions

---

## Reasoning & Decision-Making

### When to Use Extended Thinking
- Complex multi-step problems
- Critical decision-making tasks
- Security-sensitive operations
- Performance optimization challenges
- Novel problem domains

### When to Use Skills
- Document creation (use `docx`, `pdf`, `pptx`)
- Web development (use `webapp-testing`, `web-artifacts-builder`)
- API integration (use `claude-api`, `mcp-builder`)
- Design tasks (use design skills)
- Communication tasks (use communication skills)

### Verification Checklist
- [ ] Task requirements understood
- [ ] Correct skill(s) selected
- [ ] Inputs validated
- [ ] Output tested
- [ ] Documentation complete
- [ ] Version control updated

---

## Skill Integration Examples

### Example 1: Create a Professional Report
```
1. Use skill: doc-coauthoring (collaborative setup)
2. Use skill: brand-guidelines (consistent styling)
3. Use skill: docx (create document)
4. Use skill: pdf (export to PDF)
5. Use claude-api (add dynamic data)
```

### Example 2: Build a Web Application
```
1. Use skill: frontend-design (UX planning)
2. Use skill: web-artifacts-builder (create UI)
3. Use skill: webapp-testing (comprehensive QA)
4. Use skill: theme-factory (styling)
5. Use skill: claude-api (backend integration)
```

### Example 3: Create Marketing Materials
```
1. Use skill: brand-guidelines (brand compliance)
2. Use skill: canvas-design (graphics)
3. Use skill: theme-factory (color scheme)
4. Use skill: slack-gif-creator (social media)
5. Use skill: pptx (presentation)
```

---

## Configuration & Customization

### Project Metadata
```yaml
project_name: Your Project
tech_stack: [Node.js, React, TypeScript]
frameworks: [Next.js, Tailwind CSS]
database: PostgreSQL
enabled_skills: [all]
risk_level: high
```

### Skill Preferences
```yaml
default_document_format: docx
default_export_format: pdf
theme_palette: modern
brand_colors: [primary, secondary, accent]
```

---

## Memory & Learning

### Project Memory
- Architectural decisions
- Established patterns
- Known limitations
- Performance characteristics

### Auto-Learned Heuristics
- Common gotchas
- Optimization techniques
- Tool preferences
- Testing strategies

---

## Support & Troubleshooting

### Skill Not Loading
1. Verify skill directory path
2. Check SKILL.md format
3. Validate YAML frontmatter
4. Restart IDE agent

### Skill Behaving Unexpectedly
1. Review skill documentation
2. Check input format
3. Verify constraints are met
4. Run verification tests

### Integration Issues
1. Check API key configuration
2. Verify network connectivity
3. Review skill dependencies
4. Check version compatibility

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-04-03 | Initial master skill with all 17 Anthropic skills |

---

## Resources

- **Anthropic Skills Repository**: https://github.com/anthropics/skills
- **Agent Skills Specification**: https://agentskills.io/specification
- **Rosetta Documentation**: https://github.com/RajanChavada/Rosetta
- **Claude API Docs**: https://docs.claude.com

---

*Managed by Rosetta. Source: `.ai/master-skill.md`*
*Last synced: 2026-04-03 13:15 UTC*
