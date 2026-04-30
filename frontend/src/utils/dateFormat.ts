export const formatDate = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const formatMoney = (value: number | string | null | undefined): string => {
  if (value == null || isNaN(Number(value))) return '0.00';
  return Number(value).toFixed(2);
};

export const getStatusType = (statusName: string): string => {
  if (statusName === '已取消' || statusName === '退订') return 'danger';
  if (statusName === '待安排') return 'warning';
  if (statusName === '已安排') return 'primary';
  if (statusName === '已完成') return 'success';
  if (statusName === '待回款') return 'info';
  return '';
};
