"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sanitizer = void 0;
class Sanitizer {
    static sanitizeCode(code, options = {}) {
        const { allowHtml = false, maxLength = 100000, stripTags = false, } = options;
        if (typeof code !== 'string') {
            throw new TypeError('Code must be a string');
        }
        if (code.length > maxLength) {
            throw new Error(`Code exceeds maximum length of ${maxLength} characters`);
        }
        let sanitized = code.replace(/\0/g, '');
        if (!allowHtml || stripTags) {
            sanitized = sanitized
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                .replace(/<!--[\s\S]*?-->/g, '')
                .replace(/<[^>]*>/g, '');
        }
        return sanitized.trim();
    }
    static sanitizeQuery(obj) {
        if (obj === null || obj === undefined) {
            return obj;
        }
        if (Array.isArray(obj)) {
            return obj.map((item) => this.sanitizeQuery(item));
        }
        if (typeof obj === 'object') {
            const sanitized = {};
            Object.entries(obj).forEach(([key, value]) => {
                const cleanKey = key.replace(/^\$/, '').replace(/\./g, '');
                sanitized[cleanKey] = this.sanitizeQuery(value);
            });
            return sanitized;
        }
        return obj;
    }
    static sanitizeString(str, options = {}) {
        const { maxLength = 1000, stripTags = false } = options;
        if (typeof str !== 'string') {
            return '';
        }
        let sanitized = str.replace(/\0/g, '').trim();
        if (stripTags) {
            sanitized = sanitized
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                .replace(/<!--[\s\S]*?-->/g, '')
                .replace(/<[^>]*>/g, '');
        }
        return sanitized.substring(0, maxLength);
    }
    static sanitizeEmail(email) {
        if (typeof email !== 'string') {
            throw new TypeError('Email must be a string');
        }
        const sanitized = email.toLowerCase().trim().replace(/\0/g, '');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sanitized)) {
            throw new Error('Invalid email format');
        }
        return sanitized;
    }
    static sanitizeFilename(filename) {
        if (typeof filename !== 'string') {
            return 'file';
        }
        const sanitized = filename
            .replace(/\0/g, '')
            .replace(/\.\./g, '')
            .replace(/[/\\]/g, '')
            .replace(/[^a-zA-Z0-9._-]/g, '')
            .replace(/^\.+/, '');
        return sanitized || 'file';
    }
    static sanitizeLanguage(language) {
        const allowedLanguages = [
            'javascript',
            'typescript',
            'python',
            'java',
            'cpp',
            'csharp',
            'go',
            'rust',
            'html',
            'css',
            'sql',
            'php',
            'ruby',
            'swift',
            'kotlin',
        ];
        if (typeof language !== 'string') {
            throw new TypeError('Language must be a string');
        }
        const sanitized = language.toLowerCase().trim();
        if (!allowedLanguages.includes(sanitized)) {
            throw new Error(`Unsupported language: ${language}`);
        }
        return sanitized;
    }
}
exports.Sanitizer = Sanitizer;
//# sourceMappingURL=sanitizer.js.map