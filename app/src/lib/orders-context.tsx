"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface OrderItem {
  id: string;
  name: string;
  article: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  clientPhone: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  items: OrderItem[];
  totalPrice: number;
  deliveryAddress: string;
  deliveryDateTime?: string;
  deliveryType: "pickup" | "courier";
  deliveryPrice: number;
  paymentStatus: "pending" | "paid" | "cancelled";
  orderStatus: "new" | "confirmed" | "shipped" | "delivered" | "cancelled";
  notes?: string;
}

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  getOrderById: (id: string) => Order | undefined;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("orchidea_orders");
    if (stored) {
      try {
        setOrders(JSON.parse(stored));
      } catch {
        setOrders([]);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("orchidea_orders", JSON.stringify(orders));
    }
  }, [orders, isLoaded]);

  const addOrder = (order: Order) => {
    setOrders(prev => [...prev, order]);
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const getOrderById = (id: string) => {
    return orders.find(o => o.id === id);
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder, updateOrder, deleteOrder, getOrderById }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within OrdersProvider");
  }
  return context;
}
