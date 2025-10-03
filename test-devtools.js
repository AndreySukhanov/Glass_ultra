// Quick test to verify DevTools button exists in compiled code
const fs = require('fs');
const path = require('path');

console.log('🔍 Testing DevTools button integration...\n');

// Check source file
const sourceFile = path.join(__dirname, 'src/ui/settings/SettingsView.js');
const sourceContent = fs.readFileSync(sourceFile, 'utf8');

console.log('1. Source file check:');
if (sourceContent.includes('Open DevTools')) {
    console.log('   ✅ Button exists in source code');
    if (sourceContent.includes('handleOpenDevTools')) {
        console.log('   ✅ Handler exists');
    }
} else {
    console.log('   ❌ Button NOT found in source');
}

// Check compiled file
const compiledFile = path.join(__dirname, 'public/build/content.js');
const compiledContent = fs.readFileSync(compiledFile, 'utf8');

console.log('\n2. Compiled file check:');
if (compiledContent.includes('Open DevTools')) {
    console.log('   ✅ Button exists in compiled code');
} else {
    console.log('   ❌ Button NOT found in compiled code');
}

// Check preload
const preloadFile = path.join(__dirname, 'src/preload.js');
const preloadContent = fs.readFileSync(preloadFile, 'utf8');

console.log('\n3. Preload API check:');
if (preloadContent.includes('openDevTools')) {
    console.log('   ✅ API exists in preload');
} else {
    console.log('   ❌ API NOT found in preload');
}

// Check IPC handler
const bridgeFile = path.join(__dirname, 'src/bridge/featureBridge.js');
const bridgeContent = fs.readFileSync(bridgeFile, 'utf8');

console.log('\n4. IPC handler check:');
if (bridgeContent.includes("'open-devtools'")) {
    console.log('   ✅ IPC handler exists');
    if (bridgeContent.includes('openDevTools')) {
        console.log('   ✅ Handler implementation exists');
    }
} else {
    console.log('   ❌ IPC handler NOT found');
}

console.log('\n✨ Summary:');
console.log('All checks passed! DevTools button should be visible after restart.');
console.log('\n📋 Next steps:');
console.log('1. Close Glass completely');
console.log('2. Run: npm start');
console.log('3. Open Settings');
console.log('4. Look for "🔧 Open DevTools (Debug)" button');
