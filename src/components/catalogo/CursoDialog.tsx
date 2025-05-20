import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Dialog from '../ui/Dialog';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Curso } from '../../types';
import useCatalogoStore from '../../store/catalogoStore';
import { showSuccess, showError } from '../layout/NotificationManager';

interface CursoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cursoEditar?: Curso;
}

const CursoDialog: React.FC<CursoDialogProps> = ({ isOpen, onClose, cursoEditar }) => {
  const { addCurso, updateCurso, isLoading } = useCatalogoStore();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<Curso>({
    defaultValues: cursoEditar || { nombre: '' }
  });

  const onSubmit = async (data: Curso) => {
    setLoading(true);
    try {
      if (cursoEditar?.id) {
        await updateCurso(cursoEditar.id, data);
        showSuccess('Curso actualizado correctamente');
      } else {
        await addCurso(data);
        showSuccess('Curso agregado correctamente');
      }
      reset({ nombre: '' });
      onClose();
    } catch (error) {
      showError(cursoEditar ? 'Error al actualizar curso' : 'Error al agregar curso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={cursoEditar ? 'Editar Curso' : 'Nuevo Curso'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nombre del Curso"
          placeholder="Ingrese el nombre del curso"
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
            {cursoEditar ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default CursoDialog;