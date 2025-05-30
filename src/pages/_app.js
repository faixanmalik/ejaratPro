import { useState , useEffect } from 'react'
import '@/styles/globals.css'
import "../styles/style.scss";

// React top loading bar
import LoadingBar from 'react-top-loading-bar'
import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'
import { useRouter } from 'next/router';


export default function App({ Component, pageProps }) {

  const router = useRouter();

  //  react top loading bar
  const [progress, setProgress] = useState(0)
  const [user, setUser] = useState({value: null})
  const [userEmail, setUserEmail] = useState('')
  const [key, setKey] = useState(0)

  //  Use Effect for routerChange
  useEffect(() => {

    router.events.on('routeChangeStart', ()=>{
      setProgress(75);
    });
    router.events.on('routeChangeComplete', ()=>{
      setProgress(100);
    }, []);

    let myUser = JSON.parse(localStorage.getItem("myUser"));
    if( myUser ){
      setUserEmail(myUser.businessName);
      setUser({value: myUser.token , email: myUser.email, name: myUser.name, department: myUser.department });
      setKey(Math.random());
    }
    
  }, [router.query, userEmail])



  // Logout function
  const logout = ()=>{
    localStorage.removeItem("myUser");
    setUser({value:null});
    setKey(Math.random());
    router.push(`/login`);
  }


  return <>
    {router.locale === 'en' ? (
      <div dir='ltr'>
        <Navbar key={key} user={user} logout={logout} />
        <LoadingBar
          color='#0800FF'
          height={3}
          progress={progress}
          waitingTime={300}
          onLoaderFinished={() => setProgress(0)}
        />
        <Component {...pageProps} userEmail={userEmail} />
        <Footer />
      </div>
    ) : (
      <div dir='rtl'>
        <Navbar key={key} user={user} logout={logout} />
        <LoadingBar
          color='#0800FF'
          height={3}
          progress={progress}
          waitingTime={300}
          onLoaderFinished={() => setProgress(0)}
        />
        <Component {...pageProps} userEmail={userEmail} />
        <Footer />
      </div>
    )}
    
  </>
}
