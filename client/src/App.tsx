import {Routes, Route} from "react-router-dom"
import Landing from './Landing'
import Login from './Login'
import ProductListing from "./Listing"
import Account from "./Account"
import Help from "./Help"
import AddListingPage from "./AddListing"
import { UserProvider } from "./UserContext";
function App() {  


  return (
    <UserProvider>
    <Routes>
      <Route path="/" element={<Landing/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/listing" element={<ProductListing/>}/>
      <Route path="/account" element={<Account/>}/>
      <Route path="/help" element={<Help/>}/>
      <Route path="/add" element={<AddListingPage/>}/>
    </Routes>
    </UserProvider>

  )
}

export default App
