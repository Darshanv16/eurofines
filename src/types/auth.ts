export type UserRole = 'user' | 'admin';
export type Entity = 'adgyl' | 'agro' | 'biopharma';
export type InventoryType = 'test_item' | 'study' | 'facility_doc';

export interface User {
  id: number | string;
  email: string;
  password?: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  selectedEntity: Entity | null;
  selectedInventory: InventoryType | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, role: UserRole) => Promise<boolean>;
  selectEntity: (entity: Entity) => void;
  selectInventory: (inventory: InventoryType) => void;
  logout: () => void;
  isAuthenticated: boolean;
}
