import { useState, useEffect } from "react";
import { dbService, storageService } from "fbase";
import { collection,addDoc, getDocs, orderBy, query, onSnapshot } from "firebase/firestore";
import Hyenweet from "components/Hyenweet";
import { v4 as uuidv4 } from "uuid";
import {ref, uploadString, getDownloadURL} from "@firebase/storage";

function Home ({userObj}) {
    const [hyenweet, setHyenweet] = useState("");
    const [hyenweets, setHyenweets] = useState([]);
    const [attachment, setAttachment] = useState();

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
        // await addDoc(collection(dbService, "hyenweets"),{
        //     text: hyenweet,
        //     createdAt: Date.now(),
        //     creatorId: userObj.uid,
        // });
        
        // setHyenweet("");

        let attachmentURL ="";

        if(attachment !== "")  {
            const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`) //폴더 이름 : 사용자 아이디, 파일 이름 : uuidv4 (경로 : 폴더/파일)
            const response = await uploadString(fileRef, attachment, "data_url");
            attachmentURL = await getDownloadURL(fileRef);
            console.log(attachmentURL)
        }
        const tweetObject = {
            text: hyenweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentURL,
        };
        await addDoc(collection(dbService, "hyenweets"), tweetObject);
        setHyenweet("");
        setAttachment("");
    
    };

    const onChange = (event) => {
        event.preventDefault(); 
        const {
            target: { value },
        } = event; 
        setHyenweet(value);
    };

    const onFileChange =(event) => {
        const {
            target: {files},
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => { //readAsDataURL 함수는 파일 선택 후 웹 브라우저가 파일을 인식하는 시점, 웹 브라우저 파일 인식이 끝난 시점을 포함하기 때문에 시점도 관리해줘야함
            const {
                currentTarget: { result },
            } = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    };

    const onClearAttachment = () => setAttachment("");
    
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
                <input type="file" accept="image/*" onChange={onFileChange}/>
                <input type="submit" value="hyenweet" />
                {
                attachment &&
                // eslint-disable-next-line jsx-a11y/alt-text
                <div>
                    <img src={attachment} width="100px" height="100px" />
                    <button onClick={onClearAttachment}>Clear</button>
                </div>
                }
            </form>
            <div>
                {hyenweets.map((hyenweet) => (
                    <Hyenweet key={hyenweet.id} userObj={hyenweet} isOwner={hyenweet.creatorId === userObj.uid} />
                ))}
            </div>
        </>
    )

}

export default Home;

//두번씩 출력되는데, firebase의 dev 환경이라 그렇고, production에서는 잘 작동한다.