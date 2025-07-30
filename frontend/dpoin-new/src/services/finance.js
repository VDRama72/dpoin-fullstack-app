// src/services/finance.js

import api from './api';

export const fetchAllTransactions = () => api.get('/finance');
export const fetchMyTransactions = () => api.get('/finance/me');
export const fetchSummary = () => api.get('/finance/summary');
export const verifyTransaction = (id) => api.put(`/finance/${id}/verify`);
export const markAsPaid = (id) => api.put(`/finance/${id}/pay`);
