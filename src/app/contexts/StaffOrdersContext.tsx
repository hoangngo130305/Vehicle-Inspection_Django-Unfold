import { createContext, useContext, useState, ReactNode } from 'react';

export type OrderStatus = 'waiting' | 'processing' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  customer: string;
  phone: string;
  vehicle: string;
  vehicleType: string;
  brand: string;
  color: string;
  status: OrderStatus;
  time: string;
  date: string;
  location: string;
  priority: 'high' | 'normal';
  notes?: string;
  services: { name: string; price: string }[];
  total: string;
}

interface StaffOrdersContextType {
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

const StaffOrdersContext = createContext<StaffOrdersContextType | undefined>(undefined);

// Mock initial data
const initialOrders: Order[] = [
  {
    id: 'DK001',
    customer: 'Trần Minh Tuấn',
    phone: '0123456789',
    vehicle: '30A-123.45',
    vehicleType: 'Ô tô con',
    brand: 'Toyota Vios',
    color: 'Trắng',
    status: 'waiting',
    time: '08:30',
    date: '29/01/2026',
    location: 'Trạm Cầu Giấy - 123 Phố Huế, Hai Bà Trưng, Hà Nội',
    priority: 'high',
    notes: 'Khách hàng yêu cầu kiểm tra kỹ hệ thống phanh',
    services: [
      { name: 'Kiểm tra an toàn kỹ thuật', price: '340.000đ' },
      { name: 'Kiểm tra khí thải', price: '120.000đ' },
    ],
    total: '460.000đ',
  },
  {
    id: 'DK002',
    customer: 'Nguyễn Thị Hương',
    phone: '0987654321',
    vehicle: '29B-678.90',
    vehicleType: 'Ô tô con',
    brand: 'Honda City',
    color: 'Đỏ',
    status: 'processing',
    time: '09:00',
    date: '29/01/2026',
    location: 'Trạm Đống Đa - 456 Giải Phóng, Hai Bà Trưng, Hà Nội',
    priority: 'normal',
    services: [
      { name: 'Kiểm tra an toàn kỹ thuật', price: '340.000đ' },
    ],
    total: '340.000đ',
  },
  {
    id: 'DK003',
    customer: 'Phạm Đức Anh',
    phone: '0901234567',
    vehicle: '51F-234.56',
    vehicleType: 'Xe tải',
    brand: 'Hyundai',
    color: 'Xanh',
    status: 'waiting',
    time: '10:30',
    date: '29/01/2026',
    location: 'Trạm Cầu Giấy - 123 Phố Huế, Hai Bà Trưng, Hà Nội',
    priority: 'normal',
    services: [
      { name: 'Kiểm tra an toàn kỹ thuật', price: '500.000đ' },
      { name: 'Kiểm tra khí thải', price: '150.000đ' },
    ],
    total: '650.000đ',
  },
  {
    id: 'DK004',
    customer: 'Lê Thị Mai',
    phone: '0912345678',
    vehicle: '30F-567.89',
    vehicleType: 'Ô tô con',
    brand: 'Mazda 3',
    color: 'Bạc',
    status: 'completed',
    time: '07:30',
    date: '29/01/2026',
    location: 'Trạm Cầu Giấy - 123 Phố Huế, Hai Bà Trưng, Hà Nội',
    priority: 'normal',
    services: [
      { name: 'Kiểm tra an toàn kỹ thuật', price: '340.000đ' },
      { name: 'Kiểm tra khí thải', price: '120.000đ' },
    ],
    total: '460.000đ',
  },
  {
    id: 'DK005',
    customer: 'Hoàng Quốc Việt',
    phone: '0923456789',
    vehicle: '29C-890.12',
    vehicleType: 'Ô tô con',
    brand: 'Kia Morning',
    color: 'Đen',
    status: 'cancelled',
    time: '11:00',
    date: '29/01/2026',
    location: 'Trạm Đống Đa - 456 Giải Phóng, Hai Bà Trưng, Hà Nội',
    priority: 'normal',
    services: [
      { name: 'Kiểm tra an toàn kỹ thuật', price: '340.000đ' },
    ],
    total: '340.000đ',
  },
];

export function StaffOrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const getOrderById = (orderId: string) => {
    return orders.find((order) => order.id === orderId);
  };

  return (
    <StaffOrdersContext.Provider value={{ orders, updateOrderStatus, getOrderById }}>
      {children}
    </StaffOrdersContext.Provider>
  );
}

export function useStaffOrders() {
  const context = useContext(StaffOrdersContext);
  if (context === undefined) {
    throw new Error('useStaffOrders must be used within a StaffOrdersProvider');
  }
  return context;
}