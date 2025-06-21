#!/usr/bin/env node

/**
 * Color Migration Script for DevLabs
 * 
 * This script helps migrate hardcoded color values to CSS variables
 * from the centralized color system.
 * 
 * Usage:
 *   node scripts/migrate-colors.js [file-path]
 *   node scripts/migrate-colors.js frontend/src/pages/Home.css
 * 
 * Or run on all CSS files:
 *   find frontend/src -name "*.css" -exec node scripts/migrate-colors.js {} \;
 */

const fs = require('fs');
const path = require('path');

// Color mapping from hex values to CSS variables
const colorMappings = {
  // Primary Brand Colors
  '#ff5a5f': 'var(--primary-red)',
  '#e04e52': 'var(--primary-red-hover)',
  '#e31c5f': 'var(--primary-red-dark)',
  '#ff8a80': 'var(--primary-red-light)',
  
  // Secondary Brand Colors
  '#ff6b6b': 'var(--secondary-red)',
  '#ff5252': 'var(--secondary-red-hover)',
  '#ff385c': 'var(--secondary-orange)',
  
  // Accent Colors
  '#646cff': 'var(--accent-blue)',
  '#535bf2': 'var(--accent-blue-hover)',
  '#747bff': 'var(--accent-blue-light)',
  '#ffd700': 'var(--accent-gold)',
  '#ff9800': 'var(--accent-orange)',
  '#17a2b8': 'var(--accent-teal)',
  '#138496': 'var(--accent-teal-hover)',
  
  // Status Colors
  '#4CAF50': 'var(--success-green)',
  '#FF9800': 'var(--warning-orange)',
  '#F44336': 'var(--error-red)',
  '#9E9E9E': 'var(--completed-grey)',
  '#dc3545': 'var(--input-border-error)',
  '#c82333': 'var(--input-border-error)', // darker variant
  
  // Neutral Colors
  '#ffffff': 'var(--white)',
  '#000000': 'var(--black)',
  '#fafafa': 'var(--grey-50)',
  '#f8f9fa': 'var(--grey-100)',
  '#f5f5f5': 'var(--grey-200)',
  '#f0f0f0': 'var(--grey-300)',
  '#e9ecef': 'var(--grey-400)',
  '#e0e0e0': 'var(--grey-500)',
  '#ddd': 'var(--grey-600)',
  '#ccc': 'var(--grey-700)',
  '#bbb': 'var(--grey-800)',
  '#999': 'var(--grey-900)',
  
  // Text Colors
  '#333': 'var(--text-primary)',
  '#666': 'var(--text-secondary)',
  '#888': 'var(--text-muted)',
  '#cfcfcf': 'var(--text-light)',
  '#213547': 'var(--text-dark)',
  
  // Background Colors
  '#242424': 'var(--bg-dark)',
  '#1a1a1a': 'var(--bg-darker)',
  '#f7f7f7': 'var(--bg-secondary)',
  
  // Alert Colors
  '#fff5f5': 'var(--alert-error-bg)',
  '#fed7d7': 'var(--alert-error-border)',
  '#e53e3e': 'var(--alert-error-text)',
  '#d4edda': 'var(--alert-success-bg)',
  '#c3e6cb': 'var(--alert-success-border)',
  '#155724': 'var(--alert-success-text)',
  '#fee': 'var(--alert-warning-bg)',
  '#fcc': 'var(--alert-warning-border)',
  '#c33': 'var(--alert-warning-text)',
  '#f8d7da': 'var(--alert-info-bg)',
  '#f5c6cb': 'var(--alert-info-border)',
  '#721c24': 'var(--alert-info-text)',
  
  // DevLabs Dark Theme
  '#0f1115': 'var(--devlabs-bg-primary)',
  '#1a1d23': 'var(--devlabs-bg-secondary)',
  '#00ffcc': 'var(--devlabs-accent-primary)',
  '#ffb86c': 'var(--devlabs-accent-secondary)',
  '#33393f': 'var(--devlabs-border)',
};

// RGBA and other color formats
const rgbaColorMappings = {
  'rgba(255, 255, 255, 0.87)': 'rgba(255, 255, 255, 0.87)', // Keep as is
  'rgba(0, 0, 0, 0.1)': 'var(--shadow-light)',
  'rgba(0, 0, 0, 0.15)': 'var(--shadow-medium)',
  'rgba(0, 0, 0, 0.2)': 'var(--shadow-dark)',
  'rgba(0, 0, 0, 0.3)': 'var(--shadow-heavy)',
  'rgba(255, 255, 255, 0.9)': 'var(--bg-overlay-light)',
  'rgba(255, 255, 255, 0.95)': 'var(--glass-bg)',
  'rgba(0, 0, 0, 0.5)': 'var(--bg-overlay)',
  'rgba(0, 0, 0, 0.7)': 'var(--overlay-dark)',
  'rgba(255, 255, 255, 0.8)': 'var(--overlay-light)',
  'rgba(255, 107, 107, 0.1)': 'rgba(255, 107, 107, 0.1)', // Focus rings - keep specific
  'rgba(255, 90, 95, 0.1)': 'rgba(255, 90, 95, 0.1)',
  'rgba(220, 53, 69, 0.1)': 'rgba(220, 53, 69, 0.1)',
  'rgba(255, 56, 92, 0.2)': 'rgba(255, 56, 92, 0.2)',
};

// Gradient mappings
const gradientMappings = {
  'linear-gradient(135deg, #ff5a5f 0%, #ff8a80 100%)': 'var(--gradient-primary)',
  'linear-gradient(90deg, #ff5a5f, #ff8a80)': 'var(--gradient-hero)',
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)': 'var(--gradient-secondary)',
  'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)': 'var(--gradient-auth)',
  'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)': 'var(--skeleton-bg)',
};

function migrateColors(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;
  
  // Track what changes were made
  const changeLog = [];
  
  // Replace hex colors
  Object.entries(colorMappings).forEach(([hex, variable]) => {
    const regex = new RegExp(hex.replace('#', '#'), 'gi');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, variable);
      changes += matches.length;
      changeLog.push(`${hex} → ${variable} (${matches.length} occurrences)`);
    }
  });
  
  // Replace RGBA colors
  Object.entries(rgbaColorMappings).forEach(([rgba, variable]) => {
    const regex = new RegExp(rgba.replace(/[()]/g, '\\$&'), 'gi');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, variable);
      changes += matches.length;
      changeLog.push(`${rgba} → ${variable} (${matches.length} occurrences)`);
    }
  });
  
  // Replace gradients
  Object.entries(gradientMappings).forEach(([gradient, variable]) => {
    const regex = new RegExp(gradient.replace(/[()]/g, '\\$&'), 'gi');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, variable);
      changes += matches.length;
      changeLog.push(`${gradient} → ${variable} (${matches.length} occurrences)`);
    }
  });
  
  if (changes > 0) {
    // Add import statement if not present
    if (!content.includes('@import') && !content.includes('./styles/colors.css')) {
      content = `/* Import centralized color system */\n@import './styles/colors.css';\n\n${content}`;
      changeLog.unshift('Added color system import');
    }
    
    // Write the updated content
    fs.writeFileSync(filePath, content);
    
    console.log(`✅ Updated ${filePath}:`);
    console.log(`   ${changes} color values migrated`);
    changeLog.forEach(change => console.log(`   - ${change}`));
    console.log('');
  } else {
    console.log(`⏭️  No changes needed for ${filePath}`);
  }
}

function migrateAllCSSFiles(directory) {
  const files = fs.readdirSync(directory, { withFileTypes: true });
  
  files.forEach(file => {
    const fullPath = path.join(directory, file.name);
    
    if (file.isDirectory()) {
      migrateAllCSSFiles(fullPath);
    } else if (file.name.endsWith('.css')) {
      migrateColors(fullPath);
    }
  });
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('🎨 DevLabs Color Migration Tool');
  console.log('');
  console.log('Usage:');
  console.log('  node scripts/migrate-colors.js [file-path]     # Migrate specific file');
  console.log('  node scripts/migrate-colors.js --all          # Migrate all CSS files');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/migrate-colors.js frontend/src/pages/Home.css');
  console.log('  node scripts/migrate-colors.js --all');
  process.exit(0);
}

if (args[0] === '--all') {
  console.log('🎨 Migrating all CSS files in frontend/src...');
  console.log('');
  migrateAllCSSFiles('frontend/src');
  console.log('✨ Migration complete!');
} else {
  const filePath = args[0];
  console.log(`🎨 Migrating colors in ${filePath}...`);
  console.log('');
  migrateColors(filePath);
  console.log('✨ Migration complete!');
}

console.log('');
console.log('📚 Next steps:');
console.log('1. Review the changes to ensure they look correct');
console.log('2. Test your application to ensure everything works');
console.log('3. Update any remaining hardcoded colors manually');
console.log('4. Consider using utility classes for common patterns');
console.log('');
console.log('📖 See COLOR_SYSTEM.md for full documentation');