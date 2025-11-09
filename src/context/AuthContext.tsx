import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface StoredUser extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async (): Promise<void> => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Demo account
      if (
        email === "demo@example.com".toLocaleLowerCase() &&
        password === "password"
      ) {
        const userData: User = {
          id: 1,
          name: "Demo User",
          email: email,
        };
        setUser(userData);
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        return true;
      }

      const users = await AsyncStorage.getItem("users");
      const userList: StoredUser[] = users ? JSON.parse(users) : [];
      const foundUser = userList.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        const userData: User = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
        };
        setUser(userData);
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const users = await AsyncStorage.getItem("users");
      const userList: StoredUser[] = users ? JSON.parse(users) : [];

      if (userList.find((u) => u.email === email)) {
        return false;
      }

      const newUser: StoredUser = {
        id: Date.now(),
        name: name.trim(),
        email,
        password,
      };

      userList.push(newUser);
      await AsyncStorage.setItem("users", JSON.stringify(userList));

      const userData: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      };
      setUser(userData);
      await AsyncStorage.setItem("user", JSON.stringify(userData));

      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setUser(null);
      await AsyncStorage.removeItem("user");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
