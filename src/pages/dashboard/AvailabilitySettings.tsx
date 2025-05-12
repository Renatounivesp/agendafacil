import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Clock, Save } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

type AvailabilityFormData = {
  availabilitySlots: {
    id?: string;
    dia_semana: number;
    hora_inicio: string;
    hora_fim: string;
  }[];
};

const diasDaSemana = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado'
];

const AvailabilitySettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<AvailabilityFormData>({
    defaultValues: {
      availabilitySlots: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'availabilitySlots'
  });

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('disponibilidade')
          .select('*')
          .eq('user_id', user.id)
          .order('dia_semana', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          reset({ availabilitySlots: data });
        } else {
          reset({
            availabilitySlots: [{
              dia_semana: 1,
              hora_inicio: '09:00',
              hora_fim: '17:00'
            }]
          });
        }
      } catch (error) {
        console.error('Erro ao carregar disponibilidade:', error);
        toast.error('Não foi possível carregar sua disponibilidade.');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [user, reset]);

  const onSubmit = async (data: AvailabilityFormData) => {
    if (!user) return;
    setSaving(true);

    try {
      // Primeiro, excluir todas as entradas existentes
      await supabase
        .from('disponibilidade')
        .delete()
        .eq('user_id', user.id);

      // Depois, inserir as novas entradas
      const { error: insertError } = await supabase
        .from('disponibilidade')
        .insert(
          data.availabilitySlots.map(slot => ({
            user_id: user.id,
            dia_semana: Number(slot.dia_semana),
            hora_inicio: slot.hora_inicio,
            hora_fim: slot.hora_fim
          }))
        );

      if (insertError) throw insertError;

      toast.success('Disponibilidade salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar disponibilidade:', error);
      toast.error('Ocorreu um erro ao salvar sua disponibilidade.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configurar Disponibilidade</h1>
        <p className="text-gray-600">
          Defina os dias e horários em que você está disponível para agendamentos
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-card p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border border-gray-200 rounded-md bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Horário #{index + 1}</h3>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="small"
                      className="text-error-600 border-error-300 hover:bg-error-50"
                      icon={<Trash2 className="w-4 h-4" />}
                      onClick={() => remove(index)}
                    >
                      Remover
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dia da Semana
                    </label>
                    <select
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      {...register(`availabilitySlots.${index}.dia_semana` as const, {
                        required: 'Dia da semana é obrigatório'
                      })}
                    >
                      {diasDaSemana.map((dia, diaIndex) => (
                        <option key={diaIndex} value={diaIndex}>
                          {dia}
                        </option>
                      ))}
                    </select>
                    {errors.availabilitySlots?.[index]?.dia_semana && (
                      <p className="mt-1 text-sm text-error-600">
                        {errors.availabilitySlots[index]?.dia_semana?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora de Início
                    </label>
                    <input
                      type="time"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      {...register(`availabilitySlots.${index}.hora_inicio` as const, {
                        required: 'Hora de início é obrigatória'
                      })}
                    />
                    {errors.availabilitySlots?.[index]?.hora_inicio && (
                      <p className="mt-1 text-sm text-error-600">
                        {errors.availabilitySlots[index]?.hora_inicio?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora de Término
                    </label>
                    <input
                      type="time"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      {...register(`availabilitySlots.${index}.hora_fim` as const, {
                        required: 'Hora de término é obrigatória'
                      })}
                    />
                    {errors.availabilitySlots?.[index]?.hora_fim && (
                      <p className="mt-1 text-sm text-error-600">
                        {errors.availabilitySlots[index]?.hora_fim?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              fullWidth
              icon={<Plus className="w-4 h-4" />}
              onClick={() => append({
                dia_semana: 1,
                hora_inicio: '09:00',
                hora_fim: '17:00'
              })}
            >
              Adicionar Horário
            </Button>

            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={saving}
                icon={<Save className="w-4 h-4" />}
              >
                Salvar Alterações
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AvailabilitySettings;