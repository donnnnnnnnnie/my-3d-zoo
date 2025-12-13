'use client'

interface Props {
  emotion: string
  story: string
  photoUrl?: string
  onClose: () => void
}

export default function InfoPopup({ emotion, story, photoUrl, onClose }: Props) {
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      maxWidth: '400px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      zIndex: 1000,
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'none',
          border: 'none',
          fontSize: '20px',
          cursor: 'pointer',
        }}
      >
        ✕
      </button>
      
      <h2 style={{ margin: '0 0 12px', fontSize: '24px' }}>{emotion}</h2>
      
      {photoUrl && (
        <img
          src={photoUrl}
          alt="추억 사진"
          style={{
            width: '100%',
            borderRadius: '8px',
            marginBottom: '12px',
          }}
        />
      )}
      
      <p style={{ margin: 0, lineHeight: 1.6, color: '#333' }}>{story}</p>
    </div>
  )
}
