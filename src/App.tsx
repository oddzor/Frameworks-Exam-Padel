import { useEffect, useState } from "react";
import Header from "./components/main/Header";
import Footer from "./components/main/Footer";
import AppRouter from "./routes/Router";
import { restoreAuthState } from "./features/auth/authSlice";
import { useAppDispatch } from "./app/hooks";

export default function App() {
  const dispatch = useAppDispatch();
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("authState");
    if (stored) {
      const parsed = JSON.parse(stored);
      dispatch(restoreAuthState(parsed));
    }
    setLoadingAuth(false);
  }, [dispatch]);

  if (loadingAuth) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="flex-1">
        <AppRouter />
      </main>
      <Footer />
    </div>
  );
}