'use client';

import { Trash2, AlertTriangle } from 'lucide-react';

// * Debug page to help diagnose button issues
export default function DebugPage() {
  console.log('🔧 DebugPage component mounted');

  // * Client-side only checks
  const isClient = typeof window !== 'undefined';
  const hasNavigator = isClient && 'navigator' in window;
  const hasServiceWorker = hasNavigator && 'serviceWorker' in navigator;

  const clearAllCaches = async () => {
    try {
      // Clear browser cache
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('✅ Cleared all caches:', cacheNames);
      }

      // Unregister service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map(registration => registration.unregister())
        );
        console.log('✅ Unregistered all service workers:', registrations.length);
      }

      alert('Caches cleared! Please refresh the page.');
    } catch (error) {
      console.error('❌ Error clearing caches:', error);
      const message = error instanceof Error ? error.message : String(error);
      alert('Error clearing caches: ' + message);
    }
  };

  const testBasicJS = () => {
    console.log('🎯 Basic JS test triggered');
    alert('✅ Basic JavaScript is working!');
  };

  const testConsoleLog = () => {
    console.log('🎯 Console test - this should appear in browser console');
    console.warn('🎯 Warning test - this should appear as warning');
    console.error('🎯 Error test - this should appear as error');
    alert('Check browser console for messages');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>🔧 Debug Console</h1>
      
      <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h3>Current Status</h3>
        <ul>
          <li>React Component: ✅ Mounted</li>
          <li>JavaScript: {isClient ? '✅ Working' : '❌ Not Working'}</li>
          <li>Console: {console ? '✅ Available' : '❌ Not Available'}</li>
          <li>Service Worker: {hasServiceWorker ? '✅ Supported' : '❌ Not Supported'}</li>
        </ul>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button 
          onClick={testBasicJS}
          style={{
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🎯 Test Basic JavaScript
        </button>

        <button 
          onClick={testConsoleLog}
          style={{
            padding: '10px 15px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          📝 Test Console Logging
        </button>

        <button 
          onClick={clearAllCaches}
          style={{
            padding: '10px 15px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          <Trash2 className="w-4 h-4 inline mr-2" />
          Clear All Caches & Service Workers
        </button>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '5px', border: '1px solid #ffeaa7' }}>
        <h4>
          <AlertTriangle className="w-4 h-4 inline mr-2" />
          Troubleshooting Steps:
        </h4>
        <ol>
          <li><strong>Clear browser cache manually</strong> (Ctrl+Shift+Delete)</li>
          <li><strong>Open DevTools</strong> (F12) and check Console tab for errors</li>
          <li><strong>Check Network tab</strong> for failed resource loads</li>
          <li><strong>Try in incognito/private mode</strong> to bypass cache</li>
          <li><strong>Disable browser extensions</strong> that might interfere</li>
        </ol>
      </div>
    </div>
  );
}
