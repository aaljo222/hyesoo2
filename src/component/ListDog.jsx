import React, { useEffect, useState } from 'react';
import '../css/listDogs.css';
import axios from 'axios';
import BackToTopButton from './BackToTopButton.jsx';

const ListDogs = () => {
    const [animalPhotos, setAnimalPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const listDogs = process.env.REACT_APP_LIST_DOGS; // Directly using Vercel environment variable
        console.log("Loaded Environment Variable (listDogs):", listDogs);

        const fetchAnimalPhotos = async () => {
            if (!listDogs) {
                setError("Environment variable REACT_APP_LIST_DOGS is not set.");
                setLoading(false);
                return;
            }

            const url = `http://openapi.seoul.go.kr:8088/${listDogs}/xml/TbAdpWaitAnimalPhotoView/1/300/`;

            try {
                const response = await axios.get(url);
                const xmlText = response.data;

                // XML Parsing
                const xml = new DOMParser().parseFromString(xmlText, "application/xml");
                const items = Array.from(xml.getElementsByTagName("row")).map((item) => {
                    const animalNo = item.querySelector("ANIMAL_NO")?.textContent || "알 수 없음";
                    const photoUrl = item.querySelector("PHOTO_URL")?.textContent || "";
                    const fullPhotoUrl = photoUrl.startsWith("http") ? photoUrl : `https://${photoUrl}`;
                    return { animalNo, photoUrl: fullPhotoUrl };
                });

                // Deduplicate by animalNo
                const uniqueAnimals = Array.from(new Set(items.map(animal => animal.animalNo)))
                    .map(animalNo => items.find(item => item.animalNo === animalNo));

                setAnimalPhotos(uniqueAnimals);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching animal photos:", err);
                setError("Failed to fetch animal photos.");
                setLoading(false);
            }
        };

        fetchAnimalPhotos();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='listDogcont'>
            <BackToTopButton />
            <div className='listDogHead'>
                <h3>보호동물</h3>
            </div>
            <div className='listDogWrapper'>
                {animalPhotos.map((animal, index) => (
                    <div key={index}>
                        {animal.photoUrl ? (
                            <img src={animal.photoUrl} alt={`동물 번호 ${animal.animalNo}`} width="300" height="250" />
                        ) : (
                            <p>사진 없음</p>
                        )}
                        <h3>동물 번호 : <span>{animal.animalNo}</span></h3>
                        <p>자세한 정보는 아래 버튼을 누른 후 확인 부탁드립니다</p>
                        <h5><a href="https://animal.seoul.go.kr/index">더보기</a></h5>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListDogs;
