import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Calendar, Clock, User } from 'lucide-react';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    availabilityCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        // Fetch total appointments
        const { data: appointments, error: appointmentsError } = await supabase
          .from('agendamentos')
          .select('*')
          .eq('user_id', user.id);
        
        if (appointmentsError) throw appointmentsError;
        
        // Fetch upcoming appointments
        const now = new Date().toISOString();
        const { data: upcomingAppointments, error: upcomingError } = await supabase
          .from('agendamentos')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'agendado')
          .gt('data_hora', now);
        
        if (upcomingError) throw upcomingError;
        
        // Fetch availability settings
        const { data: availability, error: availabilityError } = await supabase
          .from('disponibilidade')
          .select('*')
          .eq('user_id', user.id);
        
        if (availabilityError) throw availabilityError;
        
        setStats({
          totalAppointments: appointments?.length || 0,
          upcomingAppointments: upcomingAppointments?.length || 0,
          availabilityCount: availability?.length || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);

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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo ao seu painel de controle</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-full">
              <Calendar className="h-6 w-6 text-primary-600" />
            </div>
            <h2 className="ml-3 text-lg font-medium text-gray-900">Agendamentos</h2>
          </div>
          <p className="mt-4 text-3xl font-semibold">{stats.totalAppointments}</p>
          <p className="text-gray-600">Total</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-full">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="ml-3 text-lg font-medium text-gray-900">Próximos</h2>
          </div>
          <p className="mt-4 text-3xl font-semibold">{stats.upcomingAppointments}</p>
          <p className="text-gray-600">Agendamentos</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-full">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="ml-3 text-lg font-medium text-gray-900">Disponibilidade</h2>
          </div>
          <p className="mt-4 text-3xl font-semibold">{stats.availabilityCount}</p>
          <p className="text-gray-600">Horários configurados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Acesso rápido</h2>
          <div className="space-y-4">
            <Button
              onClick={() => navigate('/dashboard/agendamentos')}
              fullWidth
              className="justify-start"
              variant="outline"
              icon={<Calendar className="h-5 w-5" />}
            >
              Ver agendamentos
            </Button>
            <Button
              onClick={() => navigate('/dashboard/disponibilidade')}
              fullWidth
              className="justify-start"
              variant="outline"
              icon={<Clock className="h-5 w-5" />}
            >
              Configurar disponibilidade
            </Button>
            <Button
              onClick={() => window.open(`/agenda/${user?.user_metadata?.username}`, '_blank')}
              fullWidth
              className="justify-start"
              variant="outline"
              icon={<User className="h-5 w-5" />}
            >
              Ver página pública
            </Button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Link público</h2>
          <p className="text-gray-600 mb-4">
            Compartilhe este link para que as pessoas possam agendar horários com você:
          </p>
          <div className="flex items-center bg-gray-50 p-3 rounded-md border border-gray-200">
            <span className="text-gray-700 text-sm truncate">
              {window.location.origin}/agenda/{user?.user_metadata?.username}
            </span>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/agenda/${user?.user_metadata?.username}`
                );
                alert('Link copiado!');
              }}
              variant="primary"
              size="small"
              className="ml-auto whitespace-nowrap"
            >
              Copiar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;