/**
 * Clients API — localStorage Edition
 * Full CRUD for client management, offline-first
 */

const CLIENTS_KEY = 'perfume_clients_db';

const DEFAULT_CLIENTS = [
  { id: 'CL001', name: 'Ahmed Benali', email: 'ahmed@email.com', phone: '0555123456', address: 'Rue Didouche', city: 'Alger', type: 'vip', totalSpent: 85000, purchaseCount: 12 },
  { id: 'CL002', name: 'Fatima Zohra', email: 'fatima@email.com', phone: '0661234567', address: 'Boulevard Amirouche', city: 'Béjaïa', type: 'retail', totalSpent: 32000, purchaseCount: 5 },
  { id: 'CL003', name: 'Mohamed Kaci', email: 'mkaci@email.com', phone: '0770987654', address: 'Cité des 200', city: 'Sétif', type: 'wholesale', totalSpent: 150000, purchaseCount: 25 },
];

const initClients = () => {
  if (!localStorage.getItem(CLIENTS_KEY)) {
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(DEFAULT_CLIENTS));
  }
};
initClients();

const getAll = () => JSON.parse(localStorage.getItem(CLIENTS_KEY) || '[]');
const saveAll = (data) => localStorage.setItem(CLIENTS_KEY, JSON.stringify(data));

export const getClients = async (options = {}) => {
  return { success: true, data: getAll() };
};

export const getClientById = async (clientId) => {
  const client = getAll().find(c => c.id === clientId);
  return client ? { success: true, data: client } : { success: false, error: 'Not found' };
};

export const createClient = async (clientData) => {
  const clients = getAll();
  const newClient = {
    id: `CL${Date.now()}`,
    ...clientData,
    totalSpent: 0,
    purchaseCount: 0,
    createdAt: new Date().toISOString(),
  };
  clients.push(newClient);
  saveAll(clients);
  return { success: true, data: newClient };
};

export const updateClient = async (clientId, clientData) => {
  const clients = getAll();
  const idx = clients.findIndex(c => c.id === clientId);
  if (idx === -1) return { success: false, error: 'Not found' };
  clients[idx] = { ...clients[idx], ...clientData, updatedAt: new Date().toISOString() };
  saveAll(clients);
  return { success: true, data: clients[idx] };
};

export const deleteClient = async (clientId) => {
  saveAll(getAll().filter(c => c.id !== clientId));
  return { success: true, message: 'Deleted' };
};

export const getClientPurchaseHistory = async (clientId) => {
  return { success: true, data: [] };
};

export const getClientLoyalty = async (clientId) => {
  return { success: true, data: {} };
};

export const updateLoyaltyPoints = async () => ({ success: true });

export const searchClients = async (query) => {
  const q = query.toLowerCase();
  const results = getAll().filter(c =>
    c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.phone?.includes(q)
  );
  return { success: true, data: results };
};

export const getTopClients = async (limit = 10) => {
  const clients = getAll().sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0));
  return { success: true, data: clients.slice(0, limit) };
};

export const addClientNote = async () => ({ success: true });
export const getClientNotes = async () => ({ success: true, data: [] });
export const exportClients = async () => ({ success: false, error: 'Not available' });

export default { getClients, createClient, updateClient, deleteClient, getTopClients };
