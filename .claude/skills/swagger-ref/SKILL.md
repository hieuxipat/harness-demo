---
name: swagger-ref
description: >
  OpenAPI/Swagger reference cho API documentation.
  Dùng bởi skill /docs-api khi cần tra cứu OpenAPI specification chi tiết.
---

# Swagger Skill

Use when working with swagger, generated from official documentation.

## When to Use This Skill

This skill should be triggered when:
- Working with swagger
- Asking about swagger features or APIs
- Implementing swagger solutions
- Debugging swagger code
- Learning swagger best practices

## Quick Reference

### Common Patterns

**Pattern 1:** There are different aspects of customizing the code generator (located in this version at swagger codegen generator repo) beyond just creating or m...

```
1s -1 modules/swagger-codegen/src/main/java/io/swagger/codegen/languages/2
3AbstractJavaCodegen.java4AbstractJavaJAXRSServerCodegen.java5... (results omitted)6JavaClientCodegen.java7JavaJAXRSSpecServerCodegen.java
```

**Pattern 2:** and config

```
config.json
```

**Pattern 3:** example:

```
1Invoke-WebRequest -OutFile swagger-codegen-cli.jar https://repo1.maven.org/maven2/io/swagger/swagger-codegen-cli/2.4.45/swagger-codegen-cli-2.4.45.jar
```

**Pattern 4:** NoteOAS 3 This guide is for OpenAPI 3

```
POST /subscribe
```

**Pattern 5:** NoteOAS 3 This guide is for OpenAPI 3

```
type: oauth2
```

**Pattern 6:** implicit flow defines authorizationUrl that is used to obtain the access token from the authorization server

```
implicit
```

**Pattern 7:** The password flow uses tokenUrl and optional refreshUrl

```
password
```

**Pattern 8:** If you’re looking for the latest stable version, you can grab it directly from Maven

```
1wget https://repo1.maven.org/maven2/io/swagger/codegen/v3/swagger-codegen-cli/3.0.71/swagger-codegen-cli-3.0.71.jar -O swagger-codegen-cli.jar2
3java -jar swagger-codegen-cli.jar --help
```

### Example Code Patterns

**Example 1** (yaml):
```yaml
1Authorization: Basic ZGVtbzpwQDU1dzByZA==
```

**Example 2** (yaml):
```yaml
1paths:2  /items:3    get:4      parameters:5        - in: query6          name: sort7          description: Sort order8          schema:9            type: string10            enum: [asc, desc]
```

**Example 3** (yaml):
```yaml
1enum:2  - asc3  - desc
```

**Example 4** (json):
```json
1{2  "dependencies": {3    "swagger-ui": "~3.11.0"4  }5}
```

**Example 5** (yaml):
```yaml
1url: "https://petstore.swagger.io/v2/swagger.json",
```

## Reference Files

This skill includes comprehensive documentation in `references/`:

- **api.md** - Api documentation
- **open-source-tools.md** - Open-Source-Tools documentation
- **other.md** - Other documentation
- **specification.md** - Specification documentation

Use `view` to read specific reference files when detailed information is needed.

## Working with This Skill

### For Beginners
Start with the getting_started or tutorials reference files for foundational concepts.

### For Specific Features
Use the appropriate category reference file (api, guides, etc.) for detailed information.

### For Code Examples
The quick reference section above contains common patterns extracted from the official docs.

## Resources

### references/
Organized documentation extracted from official sources. These files contain:
- Detailed explanations
- Code examples with language annotations
- Links to original documentation
- Table of contents for quick navigation

### scripts/
Add helper scripts here for common automation tasks.

### assets/
Add templates, boilerplate, or example projects here.

## Notes

- This skill was automatically generated from official documentation
- Reference files preserve the structure and examples from source docs
- Code examples include language detection for better syntax highlighting
- Quick reference patterns are extracted from common usage examples in the docs

## Updating

To refresh this skill with updated documentation:
1. Re-run the scraper with the same configuration
2. The skill will be rebuilt with the latest information
