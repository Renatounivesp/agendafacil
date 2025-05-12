import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Mail, User, X, RefreshCw } from 'lucide-react';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

type Appointment = {
  id: string;
  nome_cliente: string;
  email_cliente: string;
  data_hora: string;
  status: 'agendado' | 'cancelado';
  created_at: string;
};

const ScheduleList = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const fetchAppointments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('user_id', user.id)
        .order('data_hora', { ascending: true });

      if (error) throw error;

      setAppointments(data || []);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      toast.error('Não foi possível carregar seus agendamentos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const cancelAppointment = async (id: string) => {
    if (!user) return;

    setCancelingId(id);
    try {
      const { error } = await supabase
        .from('agendamentos')
        .update({ status: 'cancelado' })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setAppointments(appointments.map(app => 
        app.id === id ? { ...app, status: 'cancelado' } : app
      ));
      
      toast.success('Agendamento cancelado com sucesso!');
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      toast.error('Não foi possível cancelar o agendamento.');
    } finally {
      setCancelingId(null);
    }
  };

  const formatDateTime = (dateTime: string) => {
    try {
      const date = parseISO(dateTime);
      return format(date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return dateTime;
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Filtrar agendamentos futuros e passados
  const now = new Date();
  const upcomingAppointments = appointments.filter(
    app => app.status === 'agendado' && new Date(app.data_hora) > now
  );
  
  const pastAppointments = appointments.filter(
    app => app.status === 'cancelado' || new Date(app.data_hora) <= now
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
          <p className="text-gray-600">Gerencie seus agendamentos marcados</p>
        </div>
        <Button 
          variant="outline" 
          className="mt-4 md:mt-0"
          icon={<RefreshCw className="w-4 h-4" />}
          onClick={() => {
            setLoading(true);
            fetchAppointments();
          }}
        >
          Atualizar
        </Button>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-card p-10 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum agendamento</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Você ainda não possui agendamentos. Compartilhe seu link público para que as pessoas possam agendar horários com você.
          </p>
          <Button
            onClick={() => window.open(`/agenda/${user?.user_metadata?.username}`, '_blank')}
          >
            Ver meu link público
          </Button>
        </div>
      ) : (
        <>
          {/* Próximos agendamentos */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Próximos Agendamentos</h2>
            {upcomingAppointments.length === 0 ? (
              <div className="bg-white rounded-lg shadow-card p-6 text-center">
                <p className="text-gray-600">Não há agendamentos próximos.</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data e Hora
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {upcomingAppointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-500" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {appointment.nome_cliente}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {appointment.email_cliente}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDateTime(appointment.data_hora)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Agendado
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="outline"
                              size="small"
                              className="text-error-600 border-error-300 hover:bg-error-50"
                              icon={<X className="w-4 h-4" />}
                              isLoading={cancelingId === appointment.id}
                              onClick={() => cancelAppointment(appointment.id)}
                            >
                              Cancelar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Agendamentos passados ou cancelados */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Histórico de Agendamentos</h2>
            {pastAppointments.length === 0 ? (
              <div className="bg-white rounded-lg shadow-card p-6 text-center">
                <p className="text-gray-600">Não há agendamentos anteriores.</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data e Hora
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pastAppointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-500" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {appointment.nome_cliente}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {appointment.email_cliente}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDateTime(appointment.data_hora)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {appointment.status === 'cancelado' ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Cancelado
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                Concluído
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ScheduleList;