
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import About from './pages/About';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import NotFound from './pages/NotFound';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { cn } from './lib/utils';

function App() {
  return (
    <div className={cn("min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300")}>
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/onboarding/*" element={<Onboarding />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
