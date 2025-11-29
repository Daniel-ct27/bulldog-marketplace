import {Routes, Route} from "react-router-dom"
import Landing from './Landing'
import Login from './Login'
import ProductListing from "./Listing"
import Account from "./Account"
import Help from "./Help"
import AddListingPage from "./AddListing"
import { UserProvider } from "./UserContext";
import RegistrationPage from "./Register"
import MessagingPage from "./Message"
import CheckoutPage from "./Checkout"
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
      <Route path="register" element={<RegistrationPage/>}/>
      <Route path="messages" element={<MessagingPage/>}/>
      <Route path="checkout" element={<CheckoutPage/>}/>

    </Routes>
    </UserProvider>

  )
}

export default App
