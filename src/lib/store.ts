// Data store for TailorFlow – auth is handled by Firebase, this file manages app data in localStorage
export type Role = "merchant" | "partner" | "qa";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  company?: string;
}

export type OrderStatus =
  | "New"
  | "Routed"
  | "In Alteration"
  | "QA Pending"
  | "Approved"
  | "Rejected"
  | "Dispatched";

export interface TimelineEvent {
  label: string;
  at: string;
  by?: string;
}

export interface Order {
  id: string;
  customer: { name: string; email: string; address: string; phone: string };
  product: { id: string; name: string; image: string; size: string; qty: number; price: number };
  alteration: {
    requested: string[]; // raw customer choices
    note?: string;
    standardized: string; // converted instruction
  };
  status: OrderStatus;
  merchantId: string;
  partnerId?: string;
  qaId?: string;
  eta: string;
  createdAt: string;
  beforePhoto?: string;
  afterPhoto?: string;
  qaChecklist?: Record<string, boolean>;
  qaNotes?: string;
  timeline: TimelineEvent[];
}

export interface ProductRule {
  id: string;
  productType: string;
  allowed: string[];
}

export interface PartnerCapacity {
  partnerId: string;
  dailyCapacity: number;
  paused: boolean;
  available: boolean;
}

const KEYS = {
  orders: "tf_orders",
  rules: "tf_rules",
  capacity: "tf_capacity",
  seeded: "tf_seeded_v2",
} as const;

export function read<T>(k: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
export function write<T>(k: string, v: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(k, JSON.stringify(v));
  window.dispatchEvent(new CustomEvent("tf:update", { detail: { key: k } }));
}

export const uid = (p = "id") => `${p}_${Math.random().toString(36).slice(2, 9)}`;

// ---- Orders ----
export function getOrders(): Order[] {
  return read<Order[]>(KEYS.orders, []);
}
export function saveOrders(o: Order[]) {
  write(KEYS.orders, o);
}
export function updateOrder(id: string, patch: Partial<Order> | ((o: Order) => Order)) {
  const all = getOrders();
  const idx = all.findIndex((o) => o.id === id);
  if (idx === -1) return;
  const next = typeof patch === "function" ? patch(all[idx]) : { ...all[idx], ...patch };
  all[idx] = next;
  saveOrders(all);
}

// ---- Rules ----
export function getRules(): ProductRule[] {
  return read<ProductRule[]>(KEYS.rules, []);
}
export function saveRules(r: ProductRule[]) {
  write(KEYS.rules, r);
}

// ---- Capacity ----
export function getCapacity(partnerId: string): PartnerCapacity {
  const all = read<PartnerCapacity[]>(KEYS.capacity, []);
  return (
    all.find((c) => c.partnerId === partnerId) ?? {
      partnerId,
      dailyCapacity: 20,
      paused: false,
      available: true,
    }
  );
}
export function saveCapacity(c: PartnerCapacity) {
  const all = read<PartnerCapacity[]>(KEYS.capacity, []);
  const idx = all.findIndex((x) => x.partnerId === c.partnerId);
  if (idx === -1) all.push(c);
  else all[idx] = c;
  write(KEYS.capacity, all);
}

// ---- Standardize alteration instructions ----
export function standardize(requested: string[], note?: string): string {
  const parts: string[] = [];
  for (const r of requested) {
    if (r.includes("shorten by 1")) parts.push("Hem -2.5cm | Blind Stitch");
    else if (r.includes("shorten by 2")) parts.push("Hem -5.0cm | Blind Stitch");
    else if (r.toLowerCase().includes("waist")) parts.push("Waist intake -2cm | Reinforce belt loops");
    else if (r.toLowerCase().includes("sleeve")) parts.push("Sleeve -3cm | Match cuff");
    else if (r.toLowerCase().includes("length")) parts.push("Length -4cm | Even hem");
    else parts.push(r);
  }
  if (note) parts.push(`Tailor note: ${note}`);
  return parts.join(" • ");
}

// ---- Seed mock data (demo orders & rules only, no user seeding) ----
const PRODUCT_IMG =
  "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80";
const SHIRT_IMG =
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80";
const KURTA_IMG =
  "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80";

export function seed(currentUserId?: string) {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(KEYS.seeded)) return;

  const merchantId = currentUserId || "demo_merchant";
  const partnerId = currentUserId || "demo_partner";

  const rules: ProductRule[] = [
    { id: uid("r"), productType: "Trousers", allowed: ["Hemming", "Waist Adjustment"] },
    { id: uid("r"), productType: "Shirts", allowed: ["Sleeve Shortening"] },
    { id: uid("r"), productType: "Kurtas", allowed: ["Length Adjustment"] },
  ];
  saveRules(rules);

  const now = Date.now();
  const day = 86400000;
  const mkTl = (...labels: string[]): TimelineEvent[] =>
    labels.map((l, i) => ({ label: l, at: new Date(now - (labels.length - i) * day * 0.4).toISOString() }));

  const orders: Order[] = [
    {
      id: "ORD-1041",
      customer: { name: "Maya Iyer", email: "maya@example.com", address: "12 Linking Rd, Mumbai", phone: "+91 98200 11122" },
      product: { id: "p1", name: "Slim Fit Trousers", image: PRODUCT_IMG, size: "32", qty: 1, price: 89 },
      alteration: { requested: ["shorten by 2 inches"], standardized: "Hem -5.0cm | Blind Stitch" },
      status: "In Alteration",
      merchantId,
      partnerId,
      eta: new Date(now + 2 * day).toISOString(),
      createdAt: new Date(now - day).toISOString(),
      timeline: mkTl("Order Created", "Routed", "Tailor Accepted", "Alteration Started"),
    },
    {
      id: "ORD-1042",
      customer: { name: "Daniel Cho", email: "daniel@example.com", address: "44 King St, London", phone: "+44 7700 900123" },
      product: { id: "p2", name: "Oxford Dress Shirt", image: SHIRT_IMG, size: "M", qty: 1, price: 110 },
      alteration: { requested: ["sleeve shortening"], note: "match left & right", standardized: "Sleeve -3cm | Match cuff • Tailor note: match left & right" },
      status: "QA Pending",
      merchantId,
      partnerId,
      eta: new Date(now + day).toISOString(),
      createdAt: new Date(now - 2 * day).toISOString(),
      beforePhoto: SHIRT_IMG,
      afterPhoto: SHIRT_IMG,
      timeline: mkTl("Order Created", "Routed", "Tailor Accepted", "Alteration Started", "QA Review"),
    },
    {
      id: "ORD-1043",
      customer: { name: "Anika Rao", email: "anika@example.com", address: "9 Park Ave, NYC", phone: "+1 212 555 0199" },
      product: { id: "p3", name: "Cotton Kurta", image: KURTA_IMG, size: "L", qty: 1, price: 64 },
      alteration: { requested: ["length adjustment"], standardized: "Length -4cm | Even hem" },
      status: "Approved",
      merchantId,
      partnerId,
      qaId: currentUserId || "demo_qa",
      eta: new Date(now - day).toISOString(),
      createdAt: new Date(now - 4 * day).toISOString(),
      beforePhoto: KURTA_IMG,
      afterPhoto: KURTA_IMG,
      timeline: mkTl("Order Created", "Routed", "Tailor Accepted", "Alteration Started", "QA Review", "Completed"),
    },
    {
      id: "ORD-1044",
      customer: { name: "Sara Lin", email: "sara@example.com", address: "5 Bay Rd, Singapore", phone: "+65 8123 4567" },
      product: { id: "p1", name: "Slim Fit Trousers", image: PRODUCT_IMG, size: "30", qty: 1, price: 89 },
      alteration: { requested: ["shorten by 1 inch", "waist adjustment"], standardized: "Hem -2.5cm | Blind Stitch • Waist intake -2cm | Reinforce belt loops" },
      status: "New",
      merchantId,
      eta: new Date(now + 3 * day).toISOString(),
      createdAt: new Date(now - 0.2 * day).toISOString(),
      timeline: mkTl("Order Created"),
    },
    {
      id: "ORD-1045",
      customer: { name: "Omar Faruq", email: "omar@example.com", address: "21 Souk Lane, Dubai", phone: "+971 50 123 4567" },
      product: { id: "p2", name: "Oxford Dress Shirt", image: SHIRT_IMG, size: "L", qty: 1, price: 110 },
      alteration: { requested: ["sleeve shortening"], standardized: "Sleeve -3cm | Match cuff" },
      status: "Dispatched",
      merchantId,
      partnerId,
      qaId: currentUserId || "demo_qa",
      eta: new Date(now - 3 * day).toISOString(),
      createdAt: new Date(now - 7 * day).toISOString(),
      timeline: mkTl("Order Created", "Routed", "Tailor Accepted", "Alteration Started", "QA Review", "Completed", "Dispatched"),
    },
  ];
  saveOrders(orders);

  localStorage.setItem(KEYS.seeded, "1");
}

export const PRODUCT = {
  id: "p1",
  name: "Slim Fit Trousers",
  price: 89,
  image: PRODUCT_IMG,
  sizes: ["28", "30", "32", "34", "36"],
  description:
    "Tailored from premium Italian wool blend, the Slim Fit Trousers feature a refined silhouette with a clean drape. Half-canvas construction with hand-finished hem.",
  type: "Trousers",
};

export const CART_KEY = "tf_cart";
export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  size: string;
  qty: number;
  alterations: string[];
  note?: string;
  type: string;
}
export function getCart(): CartItem[] {
  return read<CartItem[]>(CART_KEY, []);
}
export function saveCart(c: CartItem[]) {
  write(CART_KEY, c);
}
