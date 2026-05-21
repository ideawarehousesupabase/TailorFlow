import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { collection, query, where, getDocs, doc, getDoc, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { Role } from "./store";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: Role;
  company?: string;
}

interface AuthContextType {
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    profileData: { name: string; role: Role; company?: string },
  ) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    // Restore session from localStorage
    const restoreSession = async () => {
      const uid = localStorage.getItem("tf_auth_uid");
      if (uid) {
        try {
          const docSnap = await getDoc(doc(db, "users", uid));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile({
              uid,
              name: data.name,
              email: data.email,
              role: data.role,
              company: data.company,
            });
          } else {
            localStorage.removeItem("tf_auth_uid");
          }
        } catch {
          localStorage.removeItem("tf_auth_uid");
        }
      }
      setLoading(false);
    };

    restoreSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    const emailLower = email.toLowerCase();
    const q = query(collection(db, "users"), where("email", "==", emailLower));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      throw new Error("Invalid email or password.");
    }
    
    let matchedDoc = null;
    snapshot.forEach(doc => {
      if (doc.data().password === password) {
        matchedDoc = { id: doc.id, ...doc.data() };
      }
    });

    if (!matchedDoc) {
      throw new Error("Invalid email or password.");
    }

    const userProfile = {
      uid: matchedDoc.id,
      name: matchedDoc.name,
      email: matchedDoc.email,
      role: matchedDoc.role,
      company: matchedDoc.company,
    };
    
    setProfile(userProfile);
    localStorage.setItem("tf_auth_uid", userProfile.uid);
  };

  const signUp = async (
    email: string,
    password: string,
    profileData: { name: string; role: Role; company?: string },
  ) => {
    const emailLower = email.toLowerCase();
    const q = query(collection(db, "users"), where("email", "==", emailLower));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      throw new Error("An account with that email already exists.");
    }

    const userDoc = {
      name: profileData.name,
      email: emailLower,
      password: password,
      role: profileData.role,
      company: profileData.company || "",
    };
    
    const docRef = await addDoc(collection(db, "users"), userDoc);
    
    const userProfile = {
      uid: docRef.id,
      name: userDoc.name,
      email: userDoc.email,
      role: userDoc.role,
      company: userDoc.company,
    };

    setProfile(userProfile);
    localStorage.setItem("tf_auth_uid", userProfile.uid);
  };

  const signOut = async () => {
    setProfile(null);
    localStorage.removeItem("tf_auth_uid");
  };

  const resetPassword = async (email: string) => {
    // Mock successful reset logic since there's no real backend auth
    await new Promise(r => setTimeout(r, 1000));
  };

  return (
    <AuthContext.Provider value={{ profile, loading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
