import { AllRoutes } from "./routes/AllRoutes";
import { Header } from "./components";
import "./App.css";
import { MenuProvider } from "./contexts/MenuContext";
import { CartProvider } from "./contexts/CartContext";

function App() {
  return (
    <div className="App">
      <MenuProvider>
        <CartProvider>
          <Header />
          <AllRoutes />
        </CartProvider>
      </MenuProvider>
    </div>
  );
}

export default App;
