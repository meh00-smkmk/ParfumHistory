---
name: anthropic-all-skills
description: Complete Anthropic skills suite for Antigravity - API, documents, web, design, and development tools
---

# 🚀 Anthropic Skills Suite for Antigravity

> **Source of Truth**: `.ai/master-skill.md` (Managed by Rosetta)

This skill loads **all 17 Anthropic capabilities** into your Antigravity AI agents.

---

## Available Skills

### 🔌 **API & Integration**
- `claude-api` - Anthropic API with token management, streaming, batch operations

### 📄 **Document Tools**
- `docx` - Word documents with advanced formatting
- `pdf` - PDF creation, extraction, manipulation
- `pptx` - PowerPoint presentations
- `xlsx` - Excel spreadsheets and data

### 🎨 **Design & Creative**
- `canvas-design` - Visual design and graphics
- `theme-factory` - Dynamic theme and color generation
- `brand-guidelines` - Brand consistency enforcement
- `frontend-design` - Modern UI/UX patterns
- `algorithmic-art` - Procedural art generation
- `slack-gif-creator` - Animated GIF creation

### 🧪 **Web Development**
- `webapp-testing` - Comprehensive web app testing
- `web-artifacts-builder` - Interactive web components

### 💬 **Communication**
- `internal-comms` - Professional communications
- `doc-coauthoring` - Collaborative document editing

### 🛠️ **Development**
- `mcp-builder` - Model Context Protocol servers
- `skill-creator` - Create and package AI skills

---

## Quick Usage

```
# Create a Word document
Use skill: docx to create a professional proposal

# Test a web app
Use skill: webapp-testing to verify login flow

# Generate a presentation
Use skill: pptx to create quarterly report

# Build a theme
Use skill: theme-factory to generate color schemes

# Create an MCP server
Use skill: mcp-builder to extend capabilities

# Design UI
Use skill: web-artifacts-builder to create interactive components
```

---

## Task Workflows

### 📊 Data Analysis & Reporting
1. `xlsx` - Spreadsheet operations
2. `pdf` - Data extraction
3. `docx` - Documentation
4. `pptx` - Presentation
5. `claude-api` - Dynamic data integration

### 🎨 Design & Branding
1. `brand-guidelines` - Verify consistency
2. `theme-factory` - Generate palettes
3. `canvas-design` - Create visuals
4. `algorithmic-art` - Generate patterns
5. `web-artifacts-builder` - Export to web

### 🧪 Web Development
1. `frontend-design` - UX planning
2. `web-artifacts-builder` - Build UI
3. `webapp-testing` - Comprehensive QA
4. `theme-factory` - Apply styling
5. `claude-api` - Backend integration

### 📱 API Integration
1. `claude-api` - API reference
2. `mcp-builder` - Protocol servers
3. `skill-creator` - Custom skills
4. `webapp-testing` - Integration testing

### 📝 Communication & Documentation
1. `internal-comms` - Draft messaging
2. `doc-coauthoring` - Collaborative editing
3. `docx` - Create documents
4. `pptx` - Build presentations
5. `slack-gif-creator` - Social media content

---

## Skill Location Map

```
c:\Users\quick\skills\skills\
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

### ✅ Always
- Load the appropriate skill for the task
- Reference skill documentation
- Test outputs before delivery
- Maintain brand consistency
- Use extended thinking for complex tasks
- Verify inputs and constraints

### ❌ Never
- Skip skill selection for generic operations
- Ignore skill limitations
- Modify core skills without version control
- Deploy untested documents or UIs
- Mix conflicting design systems

---

## Integration Examples

### Create a Professional Proposal
```
1. docx: Create document structure
2. brand-guidelines: Apply branding
3. claude-api: Add dynamic data
4. pdf: Export to PDF
```

### Build & Test Web App
```
1. frontend-design: UX planning
2. web-artifacts-builder: Build UI
3. webapp-testing: Full QA suite
4. theme-factory: Styling
```

### Generate Marketing Materials
```
1. brand-guidelines: Brand compliance
2. canvas-design: Graphics
3. pptx: Presentation
4. slack-gif-creator: Social media
```

---

## Configuration

```yaml
antigravity_config:
  agent_mode: autonomous
  skill_loading: all_anthropic_skills
  extended_thinking: enabled
  brand_mode: strict_compliance
  api_integration: enabled
  testing_mode: comprehensive
```

---

## Resources

- **Master Skill**: `.ai/master-skill.md`
- **Anthropic Skills Repo**: https://github.com/anthropics/skills
- **Agent Skills Spec**: https://agentskills.io/specification
- **Local Skills Dir**: `c:\Users\quick\skills\`

---

**Version**: 1.0.0  
**Updated**: 2026-04-03  
**Scope**: Antigravity IDE  
**Status**: ✅ Active
