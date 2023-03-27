import { useState, useEffect } from "react";
import { dbService } from "fbase";
import { addDoc, collection, getDocs, orderBy, query, onSnapshot } from "firebase/firestore";
import Hyenweet from "components/Hyenweet";

function Home ({userObj}) {
    const [hyenweet, setHyenweet] = useState("");
    const [hyenweets, setHyenweets] = useState([]);

    const getHyenweets = async () => {
        //getDocs를 통해 db에 있는 정보들을 가져옴, but getDocs는 파이어스토어의 원본을 캡처하듯 찍어 보내준 것이기 때문에
        //실제 우리가 원하는 tweet 내용만을 가져오려면 여러 개의 문서 스냅샷에서 foreach문을 통해 하나씩 꺼내와야함
        const dbHyenweets = await getDocs(collection(dbService, "hyenweets"));
        dbHyenweets.forEach((doc) => {
            const tweetObject={
                ...doc.data(),
                id: doc.id, //id를 통해 update, delete 기능까지 하기 위해 id값을 받아옴.
            }
            //hyenweets에 데이터를 쌓기 위해서 전개구문(...prev)를 사용
            //hyenweets는 db에 쌓인 문서의 개수만큼 순회하는데, 순회 이전의 상태까지 넘겨받기 위해 전개구문을 사용하는 것임
            //[tweetObject, ...prev]로 코드를 작성하면 가장 최근의 트윗을 가장 나중에 보여줌
            //아래와 같이 [...prev, tweetObject]로 작성하면 새 트윗을 가장 먼저 보여줌
            setHyenweets((prev)=>[...prev, tweetObject]);
        }) 
    }
    
    useEffect(() => {
        getHyenweets();
        //onSnapshot() 함수를 통해 실시간으로 데이터베이스를 반환함
        //getDocs와 결과는 동일하지만, 실시간으로 진행한다는 차이 있음
        const q = query(collection(dbService, "hyenweets"), orderBy("createdAt", "desc"));
        onSnapshot(q, (snapshot) => {
            const tweetArr = snapshot.docs.map((document) => ({
                id: document.id,
                ...document.data(),
            }));
            setHyenweets(tweetArr);
        })
    }, [])

    const onSubmit = async (event) => {
        event.preventDefault();
        //hyenweet라는 컬렉션에 text, createdAt의 내용을 담은 문서를 생성
        await addDoc(collection(dbService, "hyenweets"),{
            text: hyenweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
        });
        setHyenweet("");
    };

    const onChange = (event) => {
        event.preventDefault();
        const {
            target: { value },
        } = event;
        setHyenweet(value);
    };

    return (
        <>
            <form onSubmit={onSubmit}>
                <input
                    value={hyenweet}
                    onChange={onChange}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120}  //글자수 120 제한
                />
                <input type="submit" value="hyenweet" />
            </form>
            <div>
                {hyenweets.map((hyenweet) => (
                    <Hyenweet key={hyenweet.id} hyenweetObj={hyenweet} isOwner={hyenweet.creatorId === userObj.uid} />
                ))}
            </div>
        </>
    )

}

export default Home;

//두번씩 출력되는데, firebase의 dev 환경이라 그렇고, production에서는 잘 작동한다.