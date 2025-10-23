import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { ForecastingPage } from './pages/ForecastingPage';
import { DeparturesPage } from './pages/DeparturesPage';
import { DepartureDetailPage } from './pages/DepartureDetailPage';

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col bg-kaptio-background">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <Routes>
            <Route path="/" element={<DeparturesPage />} />
            <Route path="/departure/:departureId" element={<DepartureDetailPage />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />
            <Route path="/portfolio" element={<DashboardPage />} />
            <Route path="/comparison" element={<ComparisonPage />} />
            <Route path="/forecasting" element={<ForecastingPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

