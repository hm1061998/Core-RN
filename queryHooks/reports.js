import { useQuery } from 'react-query';
import {
  queryCustomers,
  queryDoctors,
  queryMedicines,
  queryStaff,
  querySuppliers,
  queryRevenue,
  queryRevenueDetail,
  queryDashboard,
  queryCheckgoods,
  queryInventory,
} from '~/services/reports';

// 1. Fetch tất cả products
export const useReportCustomer = (init = {}, options = {}) => {
  const { params, key = 'reports-customer' } = init;
  return useQuery(key, () => queryCustomers(params), options);
};

export const useReportDoctor = (init = {}, options = {}) => {
  const { params, key = 'reports-doctor' } = init;
  return useQuery(key, () => queryDoctors(params), options);
};

export const useReportMedicine = (init = {}, options = {}) => {
  const { params, key = 'reports-medicine' } = init;
  return useQuery(key, () => queryMedicines(params), options);
};

export const useReportStaff = (init = {}, options = {}) => {
  const { params, key = 'reports-staff' } = init;
  return useQuery(key, () => queryStaff(params), options);
};

export const useReportSuppiler = (init = {}, options = {}) => {
  const { params, key = 'reports-supplier' } = init;
  return useQuery(key, () => querySuppliers(params), options);
};
export const useReportRevenue = (init = {}, options = {}) => {
  const { params, key = 'reports-Revenue' } = init;
  return useQuery(key, () => queryRevenue(params), options);
};
export const useReportRevenueDetail = (init = {}, options = {}) => {
  const { params, key = 'reports-RevenueDetail' } = init;
  return useQuery(key, () => queryRevenueDetail(params), options);
};
export const useReportDashboard = (init = {}, options = {}) => {
  const { params, key = 'reports-dashboard' } = init;
  return useQuery(key, () => queryDashboard(params), options);
};

export const useReportCheckgoods = (init = {}, options = {}) => {
  const { params, key = 'reports-checkgoods' } = init;
  return useQuery(key, () => queryCheckgoods(params), options);
};

export const useReportInventory = (init = {}, options = {}) => {
  const { params, key = 'reports-inventory' } = init;
  return useQuery(key, () => queryInventory(params), options);
};
