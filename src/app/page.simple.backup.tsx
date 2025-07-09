export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>LightingPro - AI Lighting Expert</h1>
      <p>Welcome to our AI-powered lighting recommendation system!</p>
      
      <div style={{ marginTop: '30px' }}>
        <h2>🌟 Featured Products</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
            <h3>Philips Hue Smart Bulb</h3>
            <p>Energy-efficient LED smart bulb</p>
            <div style={{ fontWeight: 'bold', color: '#2563eb' }}>$29.99</div>
          </div>
          
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
            <h3>IKEA VÄXJÖ Pendant Lamp</h3>
            <p>Modern pendant lamp for dining rooms</p>
            <div style={{ fontWeight: 'bold', color: '#2563eb' }}>$89.99</div>
          </div>
          
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
            <h3>Xiaomi Yeelight LED Strip</h3>
            <p>Smart LED strip with app control</p>
            <div style={{ fontWeight: 'bold', color: '#2563eb' }}>$24.99</div>
          </div>
          
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
            <h3>Osram Smart Table Lamp</h3>
            <p>Adjustable smart table lamp</p>
            <div style={{ fontWeight: 'bold', color: '#2563eb' }}>$159.99</div>
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <button style={{ 
          backgroundColor: '#2563eb', 
          color: 'white', 
          padding: '12px 24px', 
          border: 'none', 
          borderRadius: '6px', 
          fontSize: '16px',
          cursor: 'pointer',
          marginRight: '10px'
        }}>
          Get Smart Recommendations
        </button>
        
        <button style={{ 
          backgroundColor: 'transparent', 
          color: '#2563eb', 
          padding: '12px 24px', 
          border: '2px solid #2563eb', 
          borderRadius: '6px', 
          fontSize: '16px',
          cursor: 'pointer'
        }}>
          Browse All Products
        </button>
      </div>
      
      <div style={{ marginTop: '50px', textAlign: 'center', color: '#666' }}>
        <p>© 2024 LightingPro. All rights reserved.</p>
      </div>
    </div>
  );
}