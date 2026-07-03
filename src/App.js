import { StoreProvider } from "./Header.jsx";
import Home from "./Home.jsx";

export default function App() {
  return (
    <StoreProvider>
      <Home />
      {/* any other page components go here too, all share the same cart/wishlist */}
    </StoreProvider>
  );
}