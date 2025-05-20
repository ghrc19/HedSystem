import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import EstadisticaCard from '../components/dashboard/EstadisticaCard';
import GraficoEstados from '../components/dashboard/GraficoEstados';
import GraficoTipoPA from '../components/dashboard/GraficoTipoPA';
import { BarChart2, DollarSign, FileText, CheckCircle, Clock, Calendar } from 'lucide-react';
import useTrabajoStore from '../store/trabajosStore';

const DashboardPage: React.FC = () => {
  const { trabajos, fetchTrabajos } = useTrabajoStore();
  
  useEffect(() => {
    fetchTrabajos();
  }, [fetchTrabajos]);
  
  const contarTrabajosCompletados = () => {
    return trabajos.filter(trabajo => trabajo.estado === 'Terminado').length;
  };
  
  const contarTrabajosPendientes = () => {
    return trabajos.filter(trabajo => trabajo.estado === 'Pendiente').length;
  };
  
  const calcularIngresoTotal = () => {
    return trabajos
      .filter(trabajo => trabajo.estado === 'Terminado')
      .reduce((total, trabajo) => total + trabajo.precio, 0);
  };
  
  const obtenerMesActual = () => {
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    return meses[new Date().getMonth()];
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <EstadisticaCard
            titulo="Total de Trabajos"
            valor={trabajos.length}
            icono={<FileText className="h-6 w-6 text-white" />}
            colorClase="bg-blue-500"
          />
          
          <EstadisticaCard
            titulo="Trabajos Completados"
            valor={contarTrabajosCompletados()}
            icono={<CheckCircle className="h-6 w-6 text-white" />}
            colorClase="bg-green-500"
          />
          
          <EstadisticaCard
            titulo="Trabajos Pendientes"
            valor={contarTrabajosPendientes()}
            icono={<Clock className="h-6 w-6 text-white" />}
            colorClase="bg-yellow-500"
          />
          
          <EstadisticaCard
            titulo={`Ingresos (${obtenerMesActual()})`}
            valor={`S/ ${calcularIngresoTotal()}`}
            icono={<DollarSign className="h-6 w-6 text-white" />}
            colorClase="bg-purple-500"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <GraficoEstados trabajos={trabajos} />
          <GraficoTipoPA trabajos={trabajos} />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Resumen de Actividad Reciente
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Cliente
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Curso
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Fecha
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {trabajos.length > 0 ? (
                  trabajos.slice(0, 5).map((trabajo) => (
                    <tr key={trabajo.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {trabajo.nombreCliente}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {trabajo.curso}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {trabajo.fechaRegistro}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${trabajo.estado === 'Pendiente' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 
                            trabajo.estado === 'Terminado' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}
                        >
                          {trabajo.estado}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No hay trabajos disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;