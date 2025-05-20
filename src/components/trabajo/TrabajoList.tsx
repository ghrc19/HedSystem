import React, { useState, useEffect } from 'react';
import { Edit, Trash2, CheckCircle, RefreshCw, XCircle, Search, FilterX } from 'lucide-react';
import Button from '../ui/Button';
import { Trabajo, FilterOptions } from '../../types';
import useTrabajoStore from '../../store/trabajosStore';
import { getStatusColor } from '../../lib/utils';
import useCatalogoStore from '../../store/catalogoStore';
import { showSuccess, showError } from '../layout/NotificationManager';

interface TrabajoListProps {
  onEdit: (trabajo: Trabajo) => void;
}

const TrabajoList: React.FC<TrabajoListProps> = ({ onEdit }) => {
  const { trabajosFiltrados, fetchTrabajos, updateEstado, deleteTrabajo, applyFilters } = useTrabajoStore();
  const { cursos, proveedores, periodos, fetchCursos, fetchProveedores, fetchPeriodos } = useCatalogoStore();
  
  const [filtros, setFiltros] = useState<FilterOptions>({
    tipoPA: '',
    periodo: '',
    proveedor: '',
    busqueda: '',
    fechaInicio: '',
    fechaFin: ''
  });
  
  useEffect(() => {
    fetchTrabajos();
    fetchCursos();
    fetchProveedores();
    fetchPeriodos();
  }, [fetchTrabajos, fetchCursos, fetchProveedores, fetchPeriodos]);

  useEffect(() => {
    applyFilters(filtros);
  }, [filtros, applyFilters]);
  
  const handleChangeEstado = async (id: string | undefined, estadoActual: string) => {
    if (!id) return;
    
    try {
      let nuevoEstado: 'Pendiente' | 'Terminado';
      const fechaEntrega = new Date().toISOString().split('T')[0];
      
      if (estadoActual === 'Terminado') {
        nuevoEstado = 'Pendiente';
      } else {
        nuevoEstado = 'Terminado';
      }
      
      await updateEstado(id, nuevoEstado, nuevoEstado === 'Terminado' ? fechaEntrega : '');
      showSuccess(`Estado actualizado a: ${nuevoEstado}`);
    } catch (error) {
      showError('Error al actualizar el estado');
    }
  };
  
  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    
    if (window.confirm('¿Estás seguro de eliminar este trabajo?')) {
      try {
        await deleteTrabajo(id);
        showSuccess('Trabajo eliminado correctamente');
      } catch (error) {
        showError('Error al eliminar el trabajo');
      }
    }
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };
  
  const handleResetFilters = () => {
    setFiltros({
      tipoPA: '',
      periodo: '',
      proveedor: '',
      busqueda: '',
      fechaInicio: '',
      fechaFin: ''
    });
  };
  
  const getStatusButtonText = (estado: string) => {
    switch (estado) {
      case 'Pendiente':
        return 'Enviar';
      case 'Cancelado':
        return 'Enviar';
      case 'Terminado':
        return 'Devolver';
      default:
        return 'Acción';
    }
  };

  const getRowClassName = (estado: string) => {
    switch (estado) {
      case 'Pendiente':
        return 'border-l-4 border-blue-500 dark:border-blue-400';
      case 'Cancelado':
        return 'border-l-4 border-yellow-500 dark:border-yellow-400';
      case 'Terminado':
        return 'border-l-4 border-green-500 dark:border-green-400';
      default:
        return '';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo de PA
            </label>
            <select
              name="tipoPA"
              value={filtros.tipoPA}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todos</option>
              <option value="PA-01">PA-01</option>
              <option value="PA-02">PA-02</option>
              <option value="PA-03">PA-03</option>
              <option value="EF">EF</option>
              <option value="ES">ES</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Periodo
            </label>
            <select
              name="periodo"
              value={filtros.periodo}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todos</option>
              {periodos.map(periodo => (
                <option key={periodo.id} value={periodo.nombre}>
                  {periodo.nombre}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Proveedor
            </label>
            <select
              name="proveedor"
              value={filtros.proveedor}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todos</option>
              {proveedores.map(proveedor => (
                <option key={proveedor.id} value={proveedor.nombre}>
                  {proveedor.nombre}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
              <input
                name="busqueda"
                value={filtros.busqueda}
                onChange={handleFilterChange}
                type="text"
                className="w-full p-2 pl-10 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Buscar..."
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha Inicio
            </label>
            <input
              name="fechaInicio"
              value={filtros.fechaInicio}
              onChange={handleFilterChange}
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha Fin
            </label>
            <input
              name="fechaFin"
              value={filtros.fechaFin}
              onChange={handleFilterChange}
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button 
            variant="outline" 
            onClick={handleResetFilters}
          >
            <FilterX className="w-4 h-4 mr-2" />
            Limpiar
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Cliente
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Curso
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Proveedor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Tipo PA
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Fecha Reg.
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Fecha Entrega
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Precio
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {trabajosFiltrados.length > 0 ? (
              trabajosFiltrados.map((trabajo) => (
                <tr 
                  key={trabajo.id} 
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${getRowClassName(trabajo.estado)}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {trabajo.nombreCliente}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {trabajo.curso}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {trabajo.proveedor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {trabajo.tipoPA}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {trabajo.fechaRegistro}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {trabajo.fechaEntrega || 'Por definir'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    S/ {trabajo.precio}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(trabajo.estado)}`}>
                      {trabajo.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant={trabajo.estado === 'Terminado' ? 'secondary' : 'primary'}
                        onClick={() => handleChangeEstado(trabajo.id, trabajo.estado)}
                      >
                        {trabajo.estado === 'Terminado' ? (
                          <RefreshCw className="w-4 h-4 mr-1" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-1" />
                        )}
                        {getStatusButtonText(trabajo.estado)}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onEdit(trabajo)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(trabajo.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No hay trabajos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrabajoList;