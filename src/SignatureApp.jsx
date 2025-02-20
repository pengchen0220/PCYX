import React, { useState, useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import './SignatureApp.css';

const SignatureApp = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isRewardOpen, setIsRewardOpen] = useState(false);
  const [savedSignatures, setSavedSignatures] = useState([]);
  const sigCanvasRef = useRef(null);
  const [rewardEnum, setRewardEnum] = useState([]);
  const [reward, setReward] = useState([]);

  const rewardList = [0, 0, 3, 3, 0, 0, 2, 0, 0, 2, 0, 0, 0, 1, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 0];
  // 从 localStorage 加载保存的签名
  useEffect(() => {
    const savedSignaturesFromStorage = JSON.parse(localStorage.getItem('savedSignatures') || '[]');
    setSavedSignatures(savedSignaturesFromStorage);
  }, []);

  // 保存签名到 localStorage
  const saveSignaturesToStorage = (signatures) => {
    localStorage.setItem('savedSignatures', JSON.stringify(signatures));
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleOpenRewardPopup = () => {
    setIsRewardOpen(true);
  };

  const handleCloseRewardPopup = () => {
    setIsRewardOpen(false);
  };

  const handleClearSignature = () => {
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear(); // 清除画布
    }
  };

  const handleReward = (rewardEnum) =>{
    setRewardEnum(rewardEnum)
  };

  const handleSaveSignature = () => {
    if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
      const signatureData = sigCanvasRef.current.toDataURL(); // 获取签名的 base64 数据
      if (savedSignatures.length < 25) {
        handleReward(rewardList[savedSignatures.length])
        const newSignatures = [...savedSignatures, signatureData];
        setSavedSignatures(newSignatures); // 更新状态
        saveSignaturesToStorage(newSignatures); // 保存到 localStorage
        sigCanvasRef.current.clear(); // 清除画布
        setIsPopupOpen(false); 
        handleOpenRewardPopup(true);
      } else {
        alert('最多只能保存 25 个签名！');
      }
    } else {
      alert('Please Sign');
    }
  };

  return (
    <div className = "signature">
        <div className="signature-app">
          <button className="signature-button" onClick={handleOpenPopup}>
          </button>
          <div className="saved-signatures">
            <div className="witnessby"> </div>
            <div className="signature-grid">
              {savedSignatures.map((sig, index) => (
                <div key={index} className="signature-item">
                  <img src={sig} alt={`签名 ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
          {isPopupOpen && (
            <div className="popup-overlay">
              <div className="popup-content">
                <button className="close-button" onClick={handleClosePopup}>
                  ×
                </button>
                <div className="signature-box">
                  <SignatureCanvas
                    ref={sigCanvasRef}
                    canvasProps={{
                      width: 270,
                      height: 180,
                      className: 'signature-canvas',
                    }}
                  />
                </div>
                <div className="popup-buttons">
                  <button onClick={handleClearSignature}>Clear</button>
                  <button onClick={handleSaveSignature}>Save</button>
                </div>
              </div>
            </div>
          )}
           {isRewardOpen && (
            <div className="popup-overlay">
              <div className={`popup-content background-capy${rewardEnum}`}>
                <button className="close-button" onClick={handleCloseRewardPopup}>
                  ×
                </button>
                <h2 className="reward-display">{reward}</h2>
              </div>
            </div>
          )}
        </div>
    </div>
  );
};

export default SignatureApp;