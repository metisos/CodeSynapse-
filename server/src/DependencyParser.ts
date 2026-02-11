import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as fs from 'fs';
import * as path from 'path';
import { DependencyMap } from './types';

export class DependencyParser {
  private supportedExtensions = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'];

  parseFile(filePath: string): string[] {
    const ext = path.extname(filePath);

    if (!this.supportedExtensions.includes(ext)) {
      return [];
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return this.extractDependencies(content, filePath);
    } catch (error) {
      console.error(`Error parsing ${filePath}:`, error);
      return [];
    }
  }

  private extractDependencies(code: string, filePath: string): string[] {
    const dependencies: string[] = [];

    try {
      const ast = parser.parse(code, {
        sourceType: 'module',
        plugins: [
          'typescript',
          'jsx',
          'decorators-legacy',
          'classProperties',
          'dynamicImport'
        ]
      });

      traverse(ast, {
        // ES6 imports: import foo from 'bar'
        ImportDeclaration: (path) => {
          const importPath = path.node.source.value;
          const resolved = this.resolvePath(importPath, filePath);
          if (resolved) {
            dependencies.push(resolved);
          }
        },

        // Dynamic imports: import('bar')
        CallExpression: (path) => {
          // Handle require()
          if (
            path.node.callee.type === 'Identifier' &&
            path.node.callee.name === 'require' &&
            path.node.arguments.length > 0
          ) {
            const arg = path.node.arguments[0];
            if (arg.type === 'StringLiteral') {
              const requirePath = arg.value;
              const resolved = this.resolvePath(requirePath, filePath);
              if (resolved) {
                dependencies.push(resolved);
              }
            }
          }

          // Handle dynamic import()
          if (
            path.node.callee.type === 'Import' &&
            path.node.arguments.length > 0
          ) {
            const arg = path.node.arguments[0];
            if (arg.type === 'StringLiteral') {
              const importPath = arg.value;
              const resolved = this.resolvePath(importPath, filePath);
              if (resolved) {
                dependencies.push(resolved);
              }
            }
          }
        },

        // Export from: export { foo } from 'bar'
        ExportNamedDeclaration: (path) => {
          if (path.node.source) {
            const exportPath = path.node.source.value;
            const resolved = this.resolvePath(exportPath, filePath);
            if (resolved) {
              dependencies.push(resolved);
            }
          }
        },

        // Export all: export * from 'bar'
        ExportAllDeclaration: (path) => {
          const exportPath = path.node.source.value;
          const resolved = this.resolvePath(exportPath, filePath);
          if (resolved) {
            dependencies.push(resolved);
          }
        }
      });
    } catch (error) {
      console.error(`Error parsing AST for ${filePath}:`, error);
    }

    return [...new Set(dependencies)]; // Remove duplicates
  }

  private resolvePath(importPath: string, fromFile: string): string | null {
    // Skip node_modules and external packages
    if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
      return null;
    }

    const dir = path.dirname(fromFile);
    let resolved = path.resolve(dir, importPath);

    // Try to find the file with various extensions
    if (fs.existsSync(resolved)) {
      const stat = fs.statSync(resolved);
      if (stat.isDirectory()) {
        // Try index files
        for (const ext of this.supportedExtensions) {
          const indexFile = path.join(resolved, `index${ext}`);
          if (fs.existsSync(indexFile)) {
            return indexFile;
          }
        }
      } else {
        return resolved;
      }
    }

    // Try adding extensions
    for (const ext of this.supportedExtensions) {
      const withExt = `${resolved}${ext}`;
      if (fs.existsSync(withExt)) {
        return withExt;
      }
    }

    return null;
  }

  buildDependencyMap(files: string[]): DependencyMap {
    const map: DependencyMap = {};

    for (const file of files) {
      map[file] = this.parseFile(file);
    }

    return map;
  }
}
