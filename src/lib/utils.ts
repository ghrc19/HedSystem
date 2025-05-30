import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | null): string {
  if (!date) return 'Por definir';
  
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'Pendiente':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'Cancelado':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'Terminado':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
}

export function sortByStatus(items: any[]): any[] {
  const statusOrder = {
    'Pendiente': 1,
    'Terminado': 2,
    'Cancelado': 3
  };

  return [...items].sort((a, b) => {
    const aOrder = statusOrder[a.estado as keyof typeof statusOrder] || 4;
    const bOrder = statusOrder[b.estado as keyof typeof statusOrder] || 4;
    return aOrder - bOrder;
  });
}