export interface AuthState {
  email: string | null;
  role: "admin" | "user" | null;
  isLoggedIn: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export type CalendarView = "year" | "month" | "day";

export interface User {
  _id?: string;
  username?: string;
  name: string;
  email?: string;
  password: string;
  role: "admin" | "user";
  banned?: boolean;
  banReason?: string;
}

export interface Court {
  _id?: string;
  name: string;
}

export interface Booking {
  _id?: string;
  userEmail: string;            
  date: string;                 
  time: string;                 
  court: string;                
  players: number;             
  mainPlayerName?: string;      
  coPlayers?: string[];    
}

export interface CourtsState {
  items: Court[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}


export interface BookingsState {
  items: Booking[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface RegisterFormProps {
  email: string;
  password: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

interface LoginFormProps {
  emailOrAdmin: string;
  password: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export interface BookingsListProps {
  bookings: Booking[];
}

export interface StyledPickersDayProps extends PickersDayProps<Dayjs> {
  bookings: Booking[];
}

export interface CalendarSectionProps {
  selectedDate: Dayjs | null;
  onChange: (value: Dayjs | null) => Promise<void>;
  DayComponent: ComponentType<PickersDayProps<Dayjs>>;
}

export interface AdminFilterState {
  date?: string;
  court?: string;
  players?: number;
}

export interface AdminBookingsProps {
  bookings: Booking[];
  onEdit: (booking: Booking) => void;
  onDelete: (id: string) => void;
}


interface BookingModalProps {
  isOpen: boolean;
  date: Dayjs | null;
  onClose: () => void;
  onConfirm: (court: string, time: string) => void;
  courts?: Court[];
}

export interface SupportTicket {
  _id?: string;
  userEmail: string;
  subject: string;
  message: string;
  status: "open" | "closed" | string;
  createdAt: string;
}