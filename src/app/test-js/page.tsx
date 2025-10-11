'use client';

// * Minimal test page to check if JavaScript/React is working
export default function TestJSPage() {
  console.log('TestJSPage component mounted');

  const handleBasicClick = () => {
    console.log('Basic button clicked!');
    alert('JavaScript is working!');
  };

  const handleStateClick = () => {
    console.log('State button clicked!');
    const time = new Date().toLocaleTimeString();
    document.getElementById('output')!.innerText = `Clicked at ${time}`;
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>JavaScript Test Page</h1>
      <p>This page tests if JavaScript and React are working correctly.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleBasicClick}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Test Basic Click
        </button>

        <button 
          onClick={handleStateClick}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test DOM Manipulation
        </button>
      </div>

      <div 
        id="output" 
        style={{
          padding: '10px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '5px',
          minHeight: '30px'
        }}
      >
        Output will appear here...
      </div>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Instructions:</strong></p>
        <ul>
          <li>If the buttons work, JavaScript is functioning</li>
          <li>Check browser console for any errors</li>
          <li>If buttons don't work, there's a fundamental issue</li>
        </ul>
      </div>
    </div>
  );
}
