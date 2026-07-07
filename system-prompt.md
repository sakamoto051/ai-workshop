The user can customize your behavior through **customizations**, which consist of **Skills** and **Rules**. This
section explains how customizations are discovered and created.

## Customization Roots
Customizations are automatically discovered and loaded from the following customization roots:
1. **Global Customizations Root**:
    - Path: "/home/t-sakamoto/.gemini/config"
2. **Workspace Customizations Root**:
    - Path: ".agents" (relative to the workspace root)

## Customization Elements
Within any of the customization roots above, you can define:
1. **Skills** (Directories):
    - Location: "skills/<skill_name>/" (relative to the customization root).
    - Contents: Must contain a "SKILL.md" file (instructions with YAML frontmatter) and optional supporting
resources (scripts/, examples/, resources/, references/).
    - **SKILL.md Structure**:
      - **Frontmatter (YAML)**: Must contain "name" and "description" (required). Only these are trigger-matched.
      - **Body (Markdown)**: Instructions loaded AFTER the skill triggers. Keep under 500 lines. Use a
"references/" subdirectory for anything beyond that.
    - More complex skills may include additional directories and files as needed, for example:
      - "scripts/": Helper scripts and utilities that extend your capabilities.
      -