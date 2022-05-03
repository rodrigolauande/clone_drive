import './App.css';
import React, {useRef, useState, useEffect} from 'react';
import Home from './Home';
import {auth, provider} from './firebase';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

function App() {
  const [login, setLogin] = useState(null);

  useEffect(()=>{
    //Sistema de login persistente
    auth.onAuthStateChanged((val)=>{
      setLogin({
        nome: val.displayName,
        email: val.email,
        imagem: val.photoURL,
        uid: val.uid
      });
    })
  },[])

  function handleLogin(e){
    e.preventDefault();
    auth.signInWithPopup(provider)
    .then(function(result){
      if(result){
        setLogin(result.user.email);
      }
    })
  }

  const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const signUp = e => {
        e.preventDefault();
        auth.createUserWithEmailAndPassword(
            emailRef.current.value,
            passwordRef.current.value
        ).then(user => {
            console.log(user)
        }).catch(err => {
            console.log(err)
        })
    }
    const signIn = e => {
        e.preventDefault();
        auth.signInWithEmailAndPassword(
            emailRef.current.value,
            passwordRef.current.value
        ).then(user => {
            console.log(user)
        }).catch(err => {
            console.log(err)
        })
    }
  return (
    <div className="App">
      {(login)?(
        <Router>
          <Switch>

            <Route path="/home">
              <Home login={login} />
            </Route>

            <Route path="/">
              <Home login={login} />
            </Route>

          </Switch>
        </Router>
      ):
      <section>
        <div className='btn-login'><a onClick={(e)=>handleLogin(e)} href='#'>Fazer Login Google</a></div>
        <form>
            <form className='form-input'>
              <label>Email</label>
              <input ref={emailRef} type="email" />
            </form>
            <form className='form-input'>
              <label>Senha</label>
              <input ref={passwordRef} type="password" />
            </form>
            <button onClick={signIn}>Logar</button>
            <h6>Nao tem cadastro? <a onClick={signUp} className="signin__link" href='#'>Cadastre-se</a></h6>
        </form>
      </section>
      }

    </div>
  );
}

export default App;
