# Development Setup Guide

## Quick Start

```bash
npm install    # Install dependencies
npm run dev    # Start development server
```

## Development Workflow

When you run `npm run dev`, the following happens automatically:

1. **File Watching**: Nodemon watches the `src/` directory for changes
2. **ESLint Check**: Validates code quality and style
3. **TypeScript Check**: Ensures type safety
4. **Bot Startup**: If all checks pass, starts the bot with hot reloading

### File Change Detection
- **Watched Extensions**: `.ts`, `.json`
- **Ignored Files**: Test files (`.spec.ts`, `.test.ts`)
- **Restart Delay**: 1 second to prevent rapid restarts

## Available Scripts

### Development
```bash
npm run dev          # Start development server with linting and type checking
```

### Code Quality
```bash
npm run lint         # Run ESLint with auto-fix
npm run lint:check   # Run ESLint without auto-fix
npm run type-check   # Run TypeScript type checking
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

### Building & Production
```bash
npm run build        # Compile TypeScript to JavaScript
npm start            # Build and start with PM2
npm run stop         # Stop PM2 process
npm run restart      # Restart PM2 process
```

## TypeScript Features

### Path Aliases
Use cleaner imports with path aliases:
```typescript
// Instead of
import { readJSON } from '../utils/functions';

// Use
import { readJSON } from '@/utils/functions';
```

### Available Aliases
- `@/*` → `./src/*`
- `@/commands/*` → `./src/commands/*`
- `@/events/*` → `./src/events/*`
- `@/utils/*` → `./src/utils/*`
- `@/types/*` → `./src/types/*`
- `@/services/*` → `./src/services/*`
- `@/config/*` → `./src/config/*`

## VSCode Integration

The project includes VSCode settings for:
- **Format on Save** with Prettier
- **ESLint auto-fix** on save
- **TypeScript validation**
- **Recommended extensions**

### Recommended Extensions
- `esbenp.prettier-vscode` - Prettier formatting
- `dbaeumer.vscode-eslint` - ESLint integration
- `ms-vscode.vscode-typescript-next` - TypeScript support

## Current ESLint Warnings

The project currently has 15 warnings about `any` types. These are non-blocking but can be addressed by:
1. Adding proper type definitions
2. Using more specific types
3. Creating interfaces for better type safety

## Troubleshooting

### ESLint Errors
If ESLint fails to start:
1. Check that all dependencies are installed: `npm install`
2. Verify ESLint configuration in `.eslintrc.json`
3. Check TypeScript version compatibility

### TypeScript Errors
If type checking fails:
1. Run `npm run build` to see detailed error messages
2. Check `tsconfig.json` configuration
3. Ensure all imports are correct

### Development Server Issues
If the dev server doesn't start:
1. Check that all lint and type-check commands pass individually
2. Verify nodemon configuration in `nodemon.json`
3. Check for syntax errors in TypeScript files

## Best Practices

### Code Quality
- Fix ESLint warnings when possible
- Use proper TypeScript types instead of `any`
- Follow consistent code formatting

### Development Workflow
- Always run `npm run dev` for development
- Use `npm run lint` to auto-fix common issues
- Check `npm run type-check` before committing

### File Organization
- Keep all source code in the `src/` directory
- Use proper file extensions (`.ts` for TypeScript)
- Follow the established directory structure

## Performance Notes

- The development workflow adds some overhead due to linting and type checking
- For production, use `npm start` which only runs the build process
- The 1-second delay in nodemon prevents excessive restarts during rapid file changes 