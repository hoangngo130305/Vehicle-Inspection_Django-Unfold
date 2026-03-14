import { createContext, useContext, useState, ReactNode } from 'react';

export interface Station {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  status: 'active' | 'inactive';
  rating?: number;
  reviews?: number;
  busyStatus?: 'empty' | 'normal' | 'busy';
}

interface StationsContextType {
  stations: Station[];
  activeStations: Station[];
  addStation: (station: Omit<Station, 'id'>) => void;
  updateStation: (id: number, station: Partial<Station>) => void;
  deleteStation: (id: number) => void;
  getStationById: (id: number) => Station | undefined;
  getStationDistance: (stationId: number, userLat?: number, userLng?: number) => string;
}

const StationsContext = createContext<StationsContextType | undefined>(undefined);

export function StationsProvider({ children }: { children: ReactNode }) {
  const [counter, setCounter] = useState(6);
  const [stations, setStations] = useState<Station[]>([
    {
      id: 1,
      name: 'TT Đăng kiểm 29-03D',
      address: 'Số 8 Phạm Hùng, Cầu Giấy, Hà Nội',
      latitude: 21.0285,
      longitude: 105.8542,
      phone: '024 1234 5678',
      status: 'active',
      rating: 4.8,
      reviews: 234,
      busyStatus: 'empty'
    },
    {
      id: 2,
      name: 'TT Đăng kiểm 29-02V',
      address: 'Số 456 Giải Phóng, Hai Bà Trưng, Hà Nội',
      latitude: 21.0122,
      longitude: 105.8438,
      phone: '024 2345 6789',
      status: 'active',
      rating: 4.6,
      reviews: 189,
      busyStatus: 'normal'
    },
    {
      id: 3,
      name: 'TT Đăng kiểm 29-01S',
      address: 'Số 120 Nguyễn Trãi, Thanh Xuân, Hà Nội',
      latitude: 21.0045,
      longitude: 105.8412,
      phone: '024 3456 7890',
      status: 'active',
      rating: 4.7,
      reviews: 312,
      busyStatus: 'busy'
    },
    {
      id: 4,
      name: 'TT Đăng kiểm 50-01S',
      address: '321 Đường 3/2, Ninh Kiều, Cần Thơ',
      latitude: 10.0452,
      longitude: 105.7469,
      phone: '0292 3456 123',
      status: 'active',
      rating: 4.5,
      reviews: 156,
      busyStatus: 'normal'
    },
    {
      id: 5,
      name: 'TT Đăng kiểm 31-02D',
      address: '654 Lạch Tray, Ngô Quyền, Hải Phòng',
      latitude: 20.8449,
      longitude: 106.6881,
      phone: '0225 3789 456',
      status: 'inactive',
      rating: 4.3,
      reviews: 98,
      busyStatus: 'empty'
    }
  ]);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const getStationDistance = (stationId: number, userLat = 21.0285, userLng = 105.8542): string => {
    const station = stations.find(s => s.id === stationId);
    if (!station) return '0 km';
    
    const distance = calculateDistance(userLat, userLng, station.latitude, station.longitude);
    return `${distance.toFixed(1)} km`;
  };

  const addStation = (stationData: Omit<Station, 'id'>) => {
    const newStation: Station = {
      ...stationData,
      id: counter,
      rating: stationData.rating || 4.5,
      reviews: stationData.reviews || 0
    };
    setStations([...stations, newStation]);
    setCounter(counter + 1);
  };

  const updateStation = (id: number, stationData: Partial<Station>) => {
    setStations(stations.map(station =>
      station.id === id ? { ...station, ...stationData } : station
    ));
  };

  const deleteStation = (id: number) => {
    setStations(stations.filter(station => station.id !== id));
  };

  const getStationById = (id: number): Station | undefined => {
    return stations.find(station => station.id === id);
  };

  const activeStations = stations.filter(s => s.status === 'active');

  return (
    <StationsContext.Provider 
      value={{ 
        stations, 
        activeStations,
        addStation, 
        updateStation, 
        deleteStation, 
        getStationById,
        getStationDistance
      }}
    >
      {children}
    </StationsContext.Provider>
  );
}

export function useStations() {
  const context = useContext(StationsContext);
  if (context === undefined) {
    throw new Error('useStations must be used within a StationsProvider');
  }
  return context;
}