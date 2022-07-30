import { Navbar, Welcome, Footer, Services, Transactions } from "./components/index";

const App = () => (
  <div className="min-h-screen">
    <div className="gradient-bg-welcome">
  
      <Welcome />
    </div>
    {/* <Services />
    <Transactions />
    <Footer /> */}
  </div>
);

export default App;