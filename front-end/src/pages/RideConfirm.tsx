import { useNavigate } from 'react-router-dom';
import { CardComponent } from '../components/CardComponent';
import { rideConfirm } from '../api/rideConfirm';
import { useRide } from '../context/rideContext';
import { useState, useEffect } from 'react';
import { LeafletMap } from '../components/MapComponent';
import { NavbarComponent } from '../components/NavbarComponent';

export function RideConfirm() {
  const [error, setError] = useState<string | null>(null);
  const [driver, setDriver] = useState<{
    id: number;
    name: string;
    value: number;
  } | null>(null);
  const { estimate, saveEstimate } = useRide();

  const calcKm = estimate?.distance ? estimate.distance / 1000 : 0;

  const numericDuration = estimate?.duration.replace(/s$/, '');
  const calcMin = numericDuration
    ? (parseFloat(numericDuration) / 60).toFixed(2)
    : 0;

  const navigate = useNavigate();

  const handleChooseDriver = async () => {
    setError(null);

    if (!driver?.id || !driver.name || driver.value === undefined) {
      setError('Por favor, escolha um motorista');
      return;
    }

    const data = new Date().toLocaleDateString();
    const hour = new Date().toLocaleTimeString();

    try {
      const confirmResponse = await rideConfirm({
        customer_id: estimate?.inputs?.customerId || 0,
        origin: estimate?.inputs?.origin || '',
        destination: estimate?.inputs?.destination || '',
        distance: Number(estimate?.distance) / 1000 || 0,
        duration: `${calcMin} Min`,
        driver: {
          id: driver.id,
          name: driver.name,
        },
        value: driver.value,
        date_created: `${data} | ${hour}`,
      });

      if (!estimate) {
        return;
      }

      saveEstimate(estimate, {
        ...estimate.inputs,
        driverId: driver.id,
      });

      navigate('/history', { state: confirmResponse });
    } catch (error) {
      console.error(error);
      setError('Erro ao confirmar corrida');
    }
  };

  useEffect(() => {
    if (!estimate || estimate === null) {
      navigate('/');
    }
  }, [estimate, navigate]);

  return (
    <>
      <NavbarComponent page="/" text="Solicitar Viagem" />

      <div className="container mx-auto px-4 py-8 space-y-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-emerald-600">
            Opções de Viagem
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Selecione a melhor opção para sua corrida
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Informações da Viagem
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-gray-700 text-lg">
                <span className="font-semibold">Origem:</span>{' '}
                {estimate?.inputs?.origin}
              </p>
              <p className="text-gray-700 text-lg">
                <span className="font-semibold">Destino:</span>{' '}
                {estimate?.inputs?.destination}
              </p>
            </div>
            <div>
              <p className="text-gray-700 text-lg">
                <span className="font-semibold">Distância:</span>{' '}
                {calcKm.toFixed(2)} km
              </p>
              <p className="text-gray-700 text-lg">
                <span className="font-semibold">Duração:</span> {calcMin} Min
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg shadow-md border border-gray-300">
          <LeafletMap
            encodedPolyline={
              estimate?.routeResponse[0].polyline.encodedPolyline || ''
            }
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Escolha um Motorista
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {estimate?.options?.map((option, index) => (
              <CardComponent
                key={index}
                driverName={option.name}
                driverImage={''}
                vehicle={option.vehicle || 'Veículo não informado'}
                description={option.description || 'Sem descrição'}
                rating={option.review.rating || 0}
                comment={option.review.comment || 'Sem comentários'}
                value={option.value || 0}
                onClick={() =>
                  setDriver({
                    id: option.id,
                    name: option.name,
                    value: option.value || 0,
                  })
                }
                isSelected={driver?.id === option.id}
              />
            ))}
          </div>
        </div>

        <div className="text-center">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            onClick={handleChooseDriver}
            className="bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xl font-bold py-3 px-8 rounded-lg shadow-lg hover:from-emerald-600 hover:to-green-700 transition duration-300"
          >
            Confirmar Motorista
          </button>
        </div>
      </div>
    </>
  );
}
