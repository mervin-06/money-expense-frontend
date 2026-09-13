import './App.css'
import Path from './Router/Path';
import { Toaster } from 'react-hot-toast';
import InstallButton from './components/InstallButton';
function App() {

  return (
    <>
        <InstallButton/>
        <Toaster position='top-center'/>
        <Path/>
    </>
  )
}

export default App
