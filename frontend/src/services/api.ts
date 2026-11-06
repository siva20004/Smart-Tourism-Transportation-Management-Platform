import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchDashboardKPIs = (range = '30d') => api.get(`/dashboard/kpis?range_type=${range}`);
export const fetchDashboardCharts = (range = '30d') => api.get(`/dashboard/charts?range_type=${range}`);

export const fetchDestinations = () => api.get('/tourism/destinations');
export const fetchSeasonality = () => api.get('/tourism/seasonality');

export const fetchStations = () => api.get('/transportation/stations');
export const fetchRoutes = () => api.get('/transportation/routes');
export const fetchSchedules = () => api.get('/transportation/schedules');
export const fetchPassengerAnalytics = () => api.get('/transportation/passengers');

export const fetchForecast = (horizon = 7) => api.get(`/forecast/predictions?horizon=${horizon}`);

export const fetchHotelProperties = () => api.get('/hotel/properties');
export const fetchHotelOccupancy = () => api.get('/hotel/occupancy-trends');

export const fetchBookings = (status = 'all') => api.get(`/booking/records?status=${status}`);
export const fetchBookingStats = () => api.get('/booking/stats');

export const chatAssistant = (message: string, language = 'en') =>
  api.post('/assistant/chat', { message, language });

export const fetchRegionalMap = () => api.get('/routes/regional-map');
export const fetchItineraries = () => api.get('/routes/itinerary-suggestions');

export const fetchDataSources = () => api.get('/data-sources/list');
export const testDataSource = (id: number) => api.post(`/data-sources/test-connection/${id}`);
export const fetchLiveWeather = () => api.get('/data-sources/weather-live');

export const previewUpload = (formData: FormData) =>
  api.post('/upload/preview', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const confirmUpload = (formData: FormData) =>
  api.post('/upload/confirm', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const fetchImportHistory = () => api.get('/upload/history');
export const getDatasetDownloadUrl = (type: string) => `/api/v1/upload/download/${type}`;
export const getTemplateDownloadUrl = (type: string) => `/api/v1/upload/templates/${type}`;

export const fetchMLModels = () => api.get('/ml/list');
export const trainMLModel = (id: number) => api.post(`/ml/train/${id}`);

export const fetchReports = () => api.get('/reports/list');
export const generateReport = (type: string) => api.post(`/reports/generate?report_type=${encodeURIComponent(type)}`);

export default api;
