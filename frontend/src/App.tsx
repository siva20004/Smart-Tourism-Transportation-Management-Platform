import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewDashboard } from './pages/OverviewDashboard';
import { TourismAnalytics } from './pages/TourismAnalytics';
import { TransportationAnalytics } from './pages/TransportationAnalytics';
import { DemandForecasting } from './pages/DemandForecasting';
import { HotelAnalytics } from './pages/HotelAnalytics';
import { BookingManagement } from './pages/BookingManagement';
import { AiAssistant } from './pages/AiAssistant';
import { RouteIntelligence } from './pages/RouteIntelligence';
import { DataSources } from './pages/DataSources';
import { DataUpload } from './pages/DataUpload';
import { MlManagement } from './pages/MlManagement';
import { Reports } from './pages/Reports';
import { SystemSettings } from './pages/SystemSettings';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#f8fafc]">
        {/* Mount Fuji Japanese Enterprise Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="p-6 max-w-7xl w-full mx-auto flex-1">
            <Routes>
              <Route path="/" element={<OverviewDashboard />} />
              <Route path="/tourism" element={<TourismAnalytics />} />
              <Route path="/transportation" element={<TransportationAnalytics />} />
              <Route path="/forecasting" element={<DemandForecasting />} />
              <Route path="/hotels" element={<HotelAnalytics />} />
              <Route path="/bookings" element={<BookingManagement />} />
              <Route path="/assistant" element={<AiAssistant />} />
              <Route path="/routes" element={<RouteIntelligence />} />
              <Route path="/data-sources" element={<DataSources />} />
              <Route path="/upload" element={<DataUpload />} />
              <Route path="/ml-management" element={<MlManagement />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<SystemSettings />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
