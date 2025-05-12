import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format, addDays, startOfDay, parseISO, setHours, setMinutes, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '../../lib/supabase';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

type ProfileData = {
  id: string;
  username: string;
  email: string;
};

type AvailabilitySlot = {
  id: string;
  user_id: string;
  dia_semana: number;
  hora_inicio: string;
  hora_fim: string;
};

type BookingFormData = {
  nome_cliente: string;
  email_cliente: string;
};

type TimeSlot = {
  time: string;
  dateTime: Date;
};

const SchedulePage = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([]);
  const [step, setStep] = useState(1);
  
  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormData>();

  useEffect(() => {
    const fetchProfileAndAvailability = async () => {
      if (!username) return;
      
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('perfis')
          .select('*')
          .eq('username', username)
          .single();
        
        if (profileError) throw profileError;
        
        if (!profileData) {
          toast.error('Usuário não encontrado');
          navigate('/');
          return;
        }
        
        setProfileData(profileData);
        
        const { data: availabilityData, error: availabilityError } = await supabase
          .from('disponibilidade')
          .select('*')
          .eq('user_id', profileData.id)
          .order('dia_semana', { ascending: true });
        
        if (availabilityError) throw availabilityError;
        
        setAvailabilitySlots(availabilityData || []);
        
        const dates = [];
        for (let i = 0; i < 14; i++) {
          const date = addDays(new Date(), i);
          const diaSemana = date.getDay();
          
          const hasAvailability = availabilityData?.some(
            slot => slot.dia_semana === diaSemana
          );
          
          if (hasAvailability) {
            dates.push(date);
          }
        }
        
        setAvailableDates(dates);
        
        if (dates.length > 0) {
          setSelectedDate(dates[0]);
        }
      } catch (error) {
        console.error('Erro ao carregar perfil e disponibilidade:', error);
        toast.error('Não foi possível carregar a agenda');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileAndAvailability();
  }, [username, navigate]);

  useEffect(() => {
    if (!selectedDate || !availabilitySlots.length) return;
    
    const diaSemana = selectedDate.getDay();
    const slots = availabilitySlots.filter(slot => slot.dia_semana === diaSemana);
    
    const timeSlots: TimeSlot[] = [];
    
    slots.forEach(slot => {
      const [startHour, startMinute] = slot.hora_inicio.split(':').map(Number);
      const [endHour, endMinute] = slot.hora_fim.split(':').map(Number);
      
      let currentHour = startHour;
      let currentMinute = startMinute;
      
      while (
        currentHour < endHour || 
        (currentHour === endHour && currentMinute < endMinute)
      ) {
        const dateTime = setHours(
          setMinutes(new Date(selectedDate), currentMinute),
          currentHour
        );
        
        const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
        if (!isToday || isAfter(dateTime, new Date())) {
          timeSlots.push({
            time: `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`,
            dateTime
          });
        }
        
        currentMinute += 60;
        if (currentMinute >= 60) {
          currentHour += Math.floor(currentMinute / 60);
          currentMinute = currentMinute % 60;
        }
      }
    });
    
    timeSlots.sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
    setAvailableTimes(timeSlots);
    setSelectedTime(null);
  }, [selectedDate, availabilitySlots]);

  useEffect(() => {
    const checkBookedTimes = async () => {
      if (!profileData || !selectedDate || !availableTimes.length) return;
      
      try {
        const startOfSelectedDate = startOfDay(selectedDate).toISOString();
        const endOfSelectedDate = startOfDay(addDays(selectedDate, 1)).toISOString();
        
        const { data, error } = await supabase
          .from('agendamentos')
          .select('data_hora')
          .eq('user_id', profileData.id)
          .eq('status', 'agendado')
          .gte('data_hora', startOfSelectedDate)
          .lt('data_hora', endOfSelectedDate);
        
        if (error) throw error;
        
        const bookedTimes = new Set(data.map(booking => format(parseISO(booking.data_hora), 'HH:mm')));
        const availableFilteredTimes = availableTimes.filter(
          slot => !bookedTimes.has(slot.time)
        );
        
        setAvailableTimes(availableFilteredTimes);
      } catch (error) {
        console.error('Erro ao verificar horários agendados:', error);
      }
    };
    
    checkBookedTimes();
  }, [profileData, selectedDate, availableTimes.length]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (timeSlot: TimeSlot) => {
    setSelectedTime(timeSlot);
  };

  const handleContinue = () => {
    if (selectedTime) {
      setStep(2);
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!profileData || !selectedTime) return;
    
    setBookingLoading(true);
    
    try {
      const bookingDateTime = selectedTime.dateTime.toISOString();
      
      const { error } = await supabase
        .from('agendamentos')
        .insert([{
          user_id: profileData.id,
          nome_cliente: data.nome_cliente,
          email_cliente: data.email_cliente,
          data_hora: bookingDateTime,
          status: 'agendado'
        }]);
      
      if (error) throw error;
      
      toast.success('Agendamento realizado com sucesso!');
      navigate(`/agenda/${username}/sucesso`);
    } catch (error) {
      console.error('Erro ao realizar agendamento:', error);
      toast.error('Não foi possível realizar o agendamento.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <AlertCircle className="w-16 h-16 text-error-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Usuário não encontrado</h1>
        <p className="text-gray-600 mb-6">
          O usuário solicitado não existe ou não configurou sua disponibilidade.
        </p>
        <Link to="/">
          <Button>Voltar para o início</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-card overflow-hidden">
        <div className="bg-primary-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Agendar com {profileData.username}</h1>
          <div className="flex items-center mt-2">
            <Calendar className="h-5 w-5 mr-2" />
            <span>Selecione um horário disponível</span>
          </div>
        </div>

        {step === 1 ? (
          <div className="p-6">
            {availableDates.length === 0 ? (
              <div className="text-center p-6">
                <AlertCircle className="w-12 h-12 text-error-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Sem disponibilidade</h2>
                <p className="text-gray-600">
                  Este usuário não configurou horários disponíveis.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">1. Escolha uma data</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {availableDates.map((date) => (
                      <button
                        key={date.toISOString()}
                        className={`p-3 rounded-md border text-center transition-all ${
                          selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'border-gray-300 hover:border-primary-500 hover:bg-primary-50'
                        }`}
                        onClick={() => handleDateSelect(date)}
                      >
                        <div className="font-medium">
                          {format(date, 'EEE', { locale: ptBR })}
                        </div>
                        <div className="text-sm">
                          {format(date, 'dd/MM')}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">2. Escolha um horário</h2>
                  {availableTimes.length === 0 ? (
                    <div className="p-4 border border-gray-200 rounded-md bg-gray-50 text-center">
                      <p className="text-gray-600">
                        Não há horários disponíveis para esta data. Por favor, selecione outra data.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableTimes.map((timeSlot) => (
                        <button
                          key={timeSlot.time}
                          className={`p-3 text-center border rounded-md transition-all ${
                            selectedTime?.time === timeSlot.time
                              ? 'calendar-time-slot-selected'
                              : 'calendar-time-slot'
                          }`}
                          onClick={() => handleTimeSelect(timeSlot)}
                        >
                          <div className="flex items-center justify-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {timeSlot.time}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <Button
                    onClick={handleContinue}
                    disabled={!selectedTime}
                    icon={<ArrowRight className="h-4 w-4" />}
                  >
                    Continuar
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">3. Preencha seus dados</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <span className="font-medium text-gray-700">
                      {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </span>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-gray-700">
                      {selectedTime?.time}
                    </span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                  id="nome_cliente"
                  label="Seu nome"
                  type="text"
                  autoComplete="name"
                  error={errors.nome_cliente?.message}
                  {...register('nome_cliente', { 
                    required: 'Nome é obrigatório',
                    minLength: {
                      value: 3,
                      message: 'Nome deve ter no mínimo 3 caracteres'
                    }
                  })}
                />

                <Input
                  id="email_cliente"
                  label="Seu email"
                  type="email"
                  autoComplete="email"
                  error={errors.email_cliente?.message}
                  {...register('email_cliente', { 
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Email inválido'
                    }
                  })}
                />

                <div className="mt-6 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    isLoading={bookingLoading}
                  >
                    Confirmar agendamento
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;