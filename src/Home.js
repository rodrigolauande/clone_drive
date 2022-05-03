import React, {useState, useEffect} from 'react';
import './Home.css';
import LogoDrive from './icon.png';
import {db, storage, auth} from './firebase';
import {AiTwotonePlusSquare, AiFillFolder} from 'react-icons/ai';
import { BsDownload, BsCameraVideoFill } from 'react-icons/bs';

function Home(props) {

    const [progress, setProgress] = useState(0);
    const [arquivos, setArquivos]  = useState([]);

    useEffect(()=>{
            db.collection('drive').doc(props.login.uid).collection('files').onSnapshot((snapshot)=>{
                setArquivos(snapshot.docs.map(l=>{
                    return l.data();
                }));
            })
    },[props]);

    function sair(e){
        e.preventDefault()
        auth.signOut().then(() => {
            alert("Deslogado!");
            window.location.href="/";
        }).catch((error) => {

        });
    }

    function fazerUploadArquivo(uid){
        let arquivo = document.querySelector('[name=arquivo]').files[0];
        //alert(arquivo.name);
        //alert(arquivo.type);
        
        const uploadTask = storage.ref('drive/'+uid+'/files/'+arquivo.name).put(arquivo);
        
        uploadTask.on('state_changed',(snapshot)=>{
            const progressTemp = (snapshot.bytesTransferred/snapshot.totalBytes) * 1;
            //console.log(progress);
            setProgress(progressTemp)
        },

        function(error){

        },

        function(){
            storage.ref('drive/'+uid+'/files/'+arquivo.name).getDownloadURL().then((url)=>{
                db.collection('drive').doc(uid).collection("files").add({
                    arquivoURL: url,
                    tipo_arquivo: arquivo.type,
                    nome: arquivo.name
                })
            })
            alert('Upload realizado com sucesso!');
            setProgress(0);
        }
        )
    }
    return(
        <div className="home">
            <div className="header">
                <div className="header__logo">
                    <img src ={LogoDrive} />
                </div>
                <div className="header__pesquisa">
                    <input type="text" placeholder="O que voce quer buscar?" />
                </div>
                <div className="header__user" >
                    <img src={props.login.imagem} />
                    <a onClick={(e)=>sair(e)} href='#'>Sair</a>
                </div>
            </div>
            <div className="main">
                    <div className="main__sidebar"> 
                        <form>
                            <label className='main__btnFileSelect' for="arquivo"><AiTwotonePlusSquare />Novo</label>
                            <input onChange={()=>fazerUploadArquivo(props.login.uid)} id="arquivo" className="hidden-input" type="file" name="arquivo" />
                        </form>
                        <div className='main__folders'>
                            <div className='main__folderMeuDrive'>
                                <span><AiFillFolder/>Meu Drive</span>
                            </div>
                            {
                                (progress > 0)?
                                <div>
                                    <label for="file">Downloading progress:</label>
                                    <progress id="file" value={progress} max="1">{progress}%</progress>
                                </div>
                                :
                                <div></div>
                            }
                        </div>
                    </div>
                    <div className="main__content">
                        <div className='mainTopoText'>
                            <h2>Meu Drive</h2>
                        </div>
                        <div className="boxFiles">
                            {
                                arquivos.map(function(data){
                                    if(data.tipo_arquivo === "video/mp4"){
                                        return(
                                            <div className="boxFileSingle">
                                                <div className="iconDownload">
                                                    <BsCameraVideoFill />
                                                </div>
                                                <a href={data.arquivoURL}>
                                                    {data.nome}
                                                </a>
                                            </div>
                                        )
                                    }else{
                                        return(
                                            <div className="boxFileSingle">
                                                <div className="iconDownload">
                                                    <BsDownload />
                                                </div>
                                                <a href={data.arquivoURL}>
                                                    {data.nome}
                                                </a>
                                            </div>
                                        )

                                    }
                                })
                            }
                        </div>
                    </div>
                </div>
        </div>
    )
}
export default Home;

// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {

// 		match /drive/{userId}/files/{documentId}{
//     	allow read, write: if request.auth.uid == userId;
//     }
//   }
// }



// rules_version = '2';
// service firebase.storage {
//   match /b/{bucket}/o {
//     match /drive/{userId}/files/{fileName}{
//      allow read, write: if request.auth.uid == userId;
//  		}
//   }
// }