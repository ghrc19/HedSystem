import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Dialog from '../ui/Dialog';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Proveedor } from '../../types';
import useCatalogoStore from '../../store/catalogoStore';
import { showSuccess, showError } from '../layout/NotificationManager';

interface ProveedorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  proveedorEditar?: Proveedor;
}

const ProveedorDialog: React.FC<ProveedorDialogProps> = ({ isOpen, onClose, proveedorEditar }) => {
  const { addProveedor, updateProveedor } = useCatalogoStore();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<Proveedor>({
    defaultValues: proveedorEditar || { nombre: '', celular: '' }
  });

  const onSubmit = async (data: Proveedor) => {
    setLoading(true);
    try {
      if (proveedorEditar?.id) {
        await updateProveedor(proveedorEditar.id, data);
        showSuccess('Proveedor actualizado correctamente');
      } else {
        await addProveedor(data);
        showSuccess('Proveedor agregado correctamente');
      }
      reset({ nombre: '', celular: '' });
      onClose();
    } catch (error) {
      showError(proveedorEditar ? 'Error al actualizar proveedor' : 'Error al agregar proveedor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={proveedorEditar ? 'Editar Proveedor' : 'Nuevo Proveedor'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nombre del Proveedor"
          placeholder="Ingrese el nombre del proveedor"
          {...register('nombre', { required: 'El nombre es requerido' })}
          error={errors.nombre?.message}
        />

        <Input
          label="Celular"
          placeholder="Ingrese el número de celular"
          {...register('celular', { 
            required: 'El celular es requerido',
            pattern: {
              value: /^[0-9]{9}$/,
              message: 'Ingrese un número de celular válido (9 dígitos)'
            }
          })}
          error={errors.celular?.message}
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
            {proveedorEditar ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default ProveedorDialog;