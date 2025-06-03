// src/components/TravelForm.js
import React, { useState } from 'react';
import axios from 'axios';

const TravelForm = () => {
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    tripType: 'טיול זוגי',
  });

  const [itinerary, setItinerary] = useState('');
  const [loading, setLoading] = useState(false);
  const downloadItinerary = () => {
    const blob = new Blob([itinerary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'travel-plan.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const tripOptions = [
    'טיול זוגי',
    'טיול משפחתי',
    'טיול טבע',
    'טיול עירוני',
    'טיול רומנטי',
    'טיול קולינרי',
    'טיול מסיבות',
    'טיול צעירים',
    'טיול חורף',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setItinerary('');

    try {
      const response = await axios.post('https://traversa-ai.onrender.com/generate-itinerary', formData);
      setItinerary(response.data.itinerary);
    } catch (err) {
      setItinerary('אירעה שגיאה בשליפת התכנון');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        direction: 'rtl',
        minHeight: '100vh',
        backgroundImage: 'url("/amalfi.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Heebo, sans-serif',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '20px',
          padding: '2rem',
          maxWidth: '500px',
          width: '90%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <img
            src="/traversa-1.png"
            alt="Traversa Logo"
            style={{ width: '180px', height: 'auto', marginBottom: '0.5rem' }}
        />
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.2rem' }}>
          מתכנן טיולים AI
        </h2>
        <form onSubmit={handleSubmit}>
          <label>יעד:</label>
          <input name="destination" value={formData.destination} onChange={handleChange} required style={inputStyle} />

          <label>תאריך התחלה:</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required style={inputStyle} />

          <label>תאריך סיום:</label>
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required style={inputStyle} />

          <label>סוג טיול:</label>
          <select name="tripType" value={formData.tripType} onChange={handleChange} style={inputStyle}>
            {tripOptions.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#003366',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '1rem',
              width: '100%',
              fontSize: '1rem',
            }}
          >
            {loading ? 'טוען...' : 'צור לי טיול'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
    <p>אהבת את הרעיון? תוכל לתמוך בפיתוח 🙏</p>
    <a
      href="https://www.buymeacoffee.com/galdev" // החלף בקישור שלך
      target="_blank"
      rel="noopener noreferrer"
      style={{
        backgroundColor: '#FFDD00',
        padding: '10px 20px',
        borderRadius: '10px',
        color: '#000',
        fontWeight: 'bold',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '1rem',
      }}
    >
      ☕ קנה לי קפה
    </a>
  </div>

        {itinerary && (
  <div style={{ marginTop: '2rem' }}>
    <h3 style={{ fontWeight: 'bold' }}>תכנון הטיול:</h3>
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '1rem',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      whiteSpace: 'pre-wrap',
      lineHeight: '1.8',
      fontSize: '1rem',
      color: '#333',
      direction: 'rtl',
    }}>
      {itinerary.split('###').map((section, idx) => {
        const lines = section.trim().split('\n');
        const title = lines[0];
        const content = lines.slice(1).join('\n');
        return (
          <div key={idx} style={{ marginBottom: '1.5rem' }}>
            <h4 style={{
              marginBottom: '0.5rem',
              borderBottom: '2px solid #0077cc',
              paddingBottom: '0.25rem',
              color: '#0077cc'
            }}>
              {title}
            </h4>
            <div dangerouslySetInnerHTML={{
              __html: content
                .replace(/[*]{2}(.*?)[*]{2}/g, '<strong>$1</strong>')
                .replace(/[*]{1}(.*?)[*]{1}/g, '🔹 $1')
                .replace(/\n/g, '<br>')
            }} />
          </div>
        );
      })}
    </div>
  </div>
)}
        {itinerary && (
          <>
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button
            onClick={downloadItinerary}
            style={{
                backgroundColor: '#00a86b',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                marginTop: '10px'
            }}
            >
            📥 הורד תוכנית טיול כקובץ טקסט
            </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p>אם התכנון עזר לך – אתה מוזמן לתמוך 💙</p>
        <a
          href="https://www.buymeacoffee.com/galdev"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: '#FFDD00',
            padding: '10px 20px',
            borderRadius: '10px',
            color: '#000',
            fontWeight: 'bold',
            textDecoration: 'none',
            display: 'inline-block',
            fontSize: '1rem',
          }}
        >
          ☕ קנה לי קפה
        </a>
      </div>
      </>
        )}


      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '1rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
};
  
export default TravelForm;
