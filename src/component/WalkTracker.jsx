import React, { useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import '../css/walkTracker.css';
// import { key } from '../api/Api.js'

const containerStyle = {
    width: '85%',
    height: '400px',
};

const center = {
    lat: 37.5665,
    lng: 126.9780,
};

const WalkTracker = () => {
    const [path, setPath] = useState([]);
    const [photo, setPhoto] = useState(null);
    const [walkLog, setWalkLog] = useState('');
    const mapRef = useRef(null);
    const googleMapsApiKey = process.env.REACT_APP_LIST_DOGS; // Directly using Vercel environment variable
    console.log("Loaded Environment Variable (googleMapsApiKey):", googleMapsApiKey);

    const handleMapClick = (e) => {
        const newPath = [...path, { lat: e.latLng.lat(), lng: e.latLng.lng() }];
        setPath(newPath);
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleWalkLogChange = (e) => {
        setWalkLog(e.target.value);
    };

    return (
        <div className='walkTrackerCont'>
            <div className='walkTrackerWrapper'>
                <div className='walkTrackerheader'>
                    <h3>반려동물과 함께하는 서울 산책 코스</h3>
                </div>
                <div className='walkTrackerCourse'>
                    <div className='walkTrackerMap'>
                        <LoadScript googleMapsApiKey={googleMapsApiKey}>
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={center}
                                zoom={14}
                                onClick={handleMapClick}
                                onLoad={(map) => (mapRef.current = map)}
                            >
                                {path.map((position, index) => (
                                    <Marker key={index} position={position} />
                                ))}
                            </GoogleMap>
                        </LoadScript>
                    </div>
                    <div className="uploadSection">
                        <div>
                            <h3>산책 사진 업로드</h3>
                            <input type="file" accept="image/*" onChange={handlePhotoChange} />
                            {photo && <img src={photo} alt="Uploaded walk photo" style={{ width: '200px', marginTop: '10px' }} />}
                        </div>
                        <div>
                            <h3>산책 일지 작성</h3>
                            <textarea
                                value={walkLog}
                                onChange={handleWalkLogChange}
                                placeholder="산책 중 느낀 점을 작성해 보세요."
                                rows="4"
                                cols="50"
                            />
                        </div>
                        <button className="saveLogButton" onClick={() => alert('산책 코스가 저장되었습니다!')}>산책 기록 저장</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalkTracker;
