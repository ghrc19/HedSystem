import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Dialog from '../ui/Dialog';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Periodo } from '../../types';
import useCatalogoStore from '../../store/catalogoStore';
import { showSuccess, showError } from '../layout/NotificationManager';

interface PeriodoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  periodoEditar?: Periodo;
}

const PeriodoDialog: React.FC<PeriodoDialogProps> = ({ isOpen, onClose, periodoEditar }) => {
  const { addPeriodo, updatePeriodo } = useCatalogoStore();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<Periodo>({
    defaultValues: periodoEditar || { nombre: '' }
  });

  const onSubmit = async (data: Periodo) => {
    setLoading(true);
    try {
      if (periodoEditar?.id) {
        await updatePeriodo(periodoEditar.id, data);
        showSuccess('Periodo actualizado correctamente');
      } else {
        await addPeriodo(data);
        showSuccess('Periodo agregado correctamente');
      }
      reset({ nombre: '' });
      onClose();
    } catch (error) {
      showError(periodoEditar ? 'Error al actualizar periodo' : 'Error al agregar periodo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={periodoEditar ? 'Editar Periodo' : 'Nuevo Periodo'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nombre del Periodo"
          placeholder="Ingrese el nombre del periodo (ej. 2023-I)"
          {...register('nombre', { required: 'El nombre es requerido' })}
          error={errors.nombre?.message}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={loading}
          >
            {periodoEditar ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default PeriodoDialog;