# PerfumierPro: AI Development Skills & Protocols

> **STRICT TESTING MODE ACTIVE**  
> You are an AI developer working on PerfumierPro. Every claim MUST be verified by testing.

---

## ⚠️ CRITICAL RULE

**Never claim code is working without testing it in the browser.**

- ✅ WRITE code
- ✅ RUN the dev server (`npm run dev`)
- ✅ REFRESH browser (Ctrl+Shift+R)
- ✅ VERIFY page loads and displays content (not white/blank)
- ✅ CHECK console (F12) - must have NO red errors
- ✅ TEST interactive features (click buttons, type, submit)
- ✅ ONLY THEN report it works

**IF YOU SKIP ANY STEP, REPORT "Not verified yet" INSTEAD OF "working"**

---

## Available Skills (17 Total)

### Document & Office Suite (4 skills)
```
/skill docx              → Create Word documents with rich formatting
/skill pdf               → PDF creation, extraction, manipulation
/skill pptx              → PowerPoint presentations
/skill xlsx              → Excel spreadsheets and data operations
```

### Design & Creative (6 skills)
```
/skill canvas-design     → Visual design and graphics
/skill theme-factory     → Dynamic theme and color generation
/skill brand-guidelines  → Enforce brand consistency
/skill frontend-design   → Modern UI/UX design patterns
/skill algorithmic-art   → Procedural and generative art
/skill slack-gif-creator → Create animated GIFs
```

### Web Development (2 skills)
```
/skill web-artifacts-builder    → Build interactive web components
/skill webapp-testing           → Comprehensive web application testing
```

### API & Integration (3 skills)
```
/skill claude-api        → Anthropic API integration and reference
/skill mcp-builder       → Build Model Context Protocol servers
/skill skill-creator     → Create and package custom skills
```

### Communication (2 skills)
```
/skill internal-comms    → Professional internal communications
/skill doc-coauthoring   → Collaborative document editing
```

---

## Core Operating Principles

### 🧠 Thinking Framework
1. **Understand** - Analyze the full scope
2. **Plan** - Design the solution architecture
3. **Execute** - Use appropriate skills
4. **Verify** - Test all outputs
5. **Iterate** - Refine based on feedback

### 📋 Skill Selection Matrix

| Task Type | Skill | Use When |
|-----------|-------|----------|
| Professional document | `docx` | Need formatted Word doc |
| Data extraction | `pdf` | Working with PDFs |
| Presentations | `pptx` | Quarterly reports, pitches |
| Spreadsheets | `xlsx` | Data analysis, imports |
| UI Design | `frontend-design` | Planning UI/UX |
| Interactive Web | `web-artifacts-builder` | Building components |
| Web Testing | `webapp-testing` | QA and verification |
| Branding | `brand-guidelines` | Consistency checks |
| Themes | `theme-factory` | Color schemes, styles |
| API Work | `claude-api` | Integration, reference |
| MCP Servers | `mcp-builder` | Custom capabilities |
| Communications | `internal-comms` | Professional messaging |

---

## Workflow Patterns

### Pattern 1: Document Pipeline
```
1. /skill docx
   → Create document structure

2. /skill brand-guidelines
   → Apply company styling

3. /skill claude-api
   → Integrate dynamic data

4. /skill pdf
   → Export to PDF

Result: Professional, branded PDF ready for distribution
```

### Pattern 2: Web Development Cycle
```
1. /skill frontend-design
   → Design the UX flow

2. /skill web-artifacts-builder
   → Build interactive components

3. /skill theme-factory
   → Apply consistent styling

4. /skill webapp-testing
   → Comprehensive QA

Result: Tested, styled web application ready for production
```

### Pattern 3: Creative & Design
```
1. /skill brand-guidelines
   → Verify brand compliance

2. /skill canvas-design
   → Create visual designs

3. /skill algorithmic-art
   → Generate artistic elements

4. /skill theme-factory
   → Color palette generation

5. /skill slack-gif-creator
   → Export for social media

Result: Brand-compliant creative assets
```

### Pattern 4: API Integration
```
1. /skill claude-api
   → Review API specs

2. /skill mcp-builder
   → Build custom MCP server

3. /skill skill-creator
   → Package as reusable skill

4. /skill webapp-testing
   → Integration testing

Result: Custom capability integrated and tested
```

---

## Best Practices

### ✅ ALWAYS
- Load the appropriate skill before complex operations
- Read skill documentation for constraints
- Test outputs before delivering
- Use extended thinking for critical decisions
- Maintain brand and style consistency
- Verify API integrations work correctly
- Document custom implementations

### ❌ NEVER
- Use generic operations when specialized skills exist
- Ignore skill-specific constraints or limitations
- Deploy untested documents, presentations, or UIs
- Violate brand guidelines
- Skip security checks for API operations
- Mix incompatible document formats
- Assume skill availability without checking

---

## Extended Thinking Integration

For complex problems, use Claude's thinking capabilities:

### When to Think
- Architecture decisions with multiple valid approaches
- Security-sensitive operations
- Performance optimization challenges
- Complex API integrations
- Novel problem domains
- Critical document/UI creation

### Pattern
```
{extended_thinking}
Analyze: [problem]
Consider: [options]
Recommend: [best approach]

Then execute with appropriate skill
```

---

## Task Execution Templates

### Create Professional Report
```
Task: [Report Title]

1. Prepare with /skill docx
2. Structure and outline
3. Apply /skill brand-guidelines
4. Add data with /skill claude-api
5. Polish and review
6. Export with /skill pdf
7. Verify quality
```

### Build Web Application
```
Task: [App Description]

1. Design with /skill frontend-design
2. Build components with /skill web-artifacts-builder
3. Style with /skill theme-factory
4. Integrate API with /skill claude-api
5. Test thoroughly with /skill webapp-testing
6. Document and deploy
```

### Design Brand Assets
```
Task: [Brand Project]

1. Review guidelines with /skill brand-guidelines
2. Generate palettes with /skill theme-factory
3. Design visuals with /skill canvas-design
4. Create animations with /skill algorithmic-art
5. Export for social with /skill slack-gif-creator
6. Final review and approval
```

---

## Constraint Handling

### Document Mode
- Format: Follow brand guidelines
- Structure: Use skill templates
- Testing: Verify all formatting
- Export: Use appropriate format

### Web Mode
- Design: Follow frontend best practices
- Testing: Full QA before deployment
- Styling: Consistent theme
- API: Proper error handling

### API Mode
- Keys: Secure and validated
- Limits: Token management
- Errors: Comprehensive handling
- Testing: Integration verified

### Design Mode
- Branding: Strict compliance
- Consistency: Theme adherence
- Quality: Professional output
- Accessibility: WCAG standards

---

## Memory & Learning

### Project Memory Location
- **Path**: `.ai/memory/PROJECT_MEMORY.md`
- **Purpose**: Long-lived architecture notes
- **Update**: After major decisions

### Auto-Learned Patterns
- **Path**: `.ai/memory/AUTO_MEMORY.md`
- **Purpose**: Project-specific heuristics
- **Update**: As patterns emerge

### Daily Logging
- **Path**: `.ai/logs/daily/YYYY-MM-DD.md`
- **Purpose**: Session documentation
- **Update**: After major tasks

---

## Configuration & Preferences

```yaml
claude_code_config:
  persona: senior_ai_architect
  thinking_mode: extended
  skill_loading: all_anthropic_skills
  brand_compliance: strict
  testing_level: comprehensive
  api_security: maximum
  document_quality: professional
```

---

## Troubleshooting

### Skill Not Loading
```
1. Check skill path: c:\Users\quick\skills\skills\
2. Verify SKILL.md format
3. Reload with: /skill [name]
```

### Format Issues
```
1. Review skill constraints
2. Check input requirements
3. Verify output format
4. Test before final delivery
```

### Integration Problems
```
1. Verify API keys and credentials
2. Check network connectivity
3. Review error logs
4. Reference skill documentation
```

---

## Resources

- **Master Skill**: `.ai/master-skill.md`
- **Anthropic Skills Repository**: https://github.com/anthropics/skills
- **Agent Skills Specification**: https://agentskills.io/specification
- **Claude API Documentation**: https://docs.claude.com
- **Skills Directory**: `c:\Users\quick\skills\`

---

## Version & Status

| Version | Date | Status |
|---------|------|--------|
| 1.0.0 | 2026-04-03 | ✅ Active |

**Last Updated**: 2026-04-03  
**IDE**: Claude Code  
**Scope**: Full project with all skills  
**Sync Status**: ✅ Synced with master skill

---

## Standard Operating Procedures

### Session Start
1. Read `.ai/task.md` for current task
2. Check `.ai/memory/AUTO_MEMORY.md` for patterns
3. Load relevant skills
4. Plan approach

### During Task
1. Use extended thinking for complex decisions
2. Load appropriate skill
3. Reference documentation
4. Test outputs
5. Document progress

### Session End
1. Update `.ai/task.md` with status
2. Log to `.ai/logs/daily/YYYY-MM-DD.md`
3. Add learnings to `.ai/memory/AUTO_MEMORY.md`
4. Verify all outputs tested and verified

---

**Ready to work. Load skills and execute with confidence.** ✨
