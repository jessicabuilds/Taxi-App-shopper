import { rideEstimate } from '../api/rideEstimate';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RideEstimateResponse } from '../api/rideEstimate';
import Logo from '../assets/undraw_vintage_414k.svg';
import { useRide } from '../context/rideContext';
import { NavbarComponent } from '../components/NavbarComponent';

export function RideRequest() {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [customerId, setCustomerId] = useState<number>();
  const [error, setError] = useState<string | null>(null);
  const { saveEstimate } = useRide();

  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerId || !origin || !destination) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    try {
      const estimateData: RideEstimateResponse = await rideEstimate({
        customer_id: Number(customerId),
        origin,
        destination,
      });

      saveEstimate(estimateData, {
        customerId,
        origin,
        destination,
        driverId: 0,
      });

      navigate('/confirm', { state: estimateData });
    } catch (error) {
      console.error(error);
      setError('Erro ao calcular estimativa de corrida');
    }
  };

  return (
    <>
      <NavbarComponent page="/history" text="Histórico" />
      <div className="h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <img src={Logo} alt="Logo de Taxi" className="h-36" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Solicitação de Viagem
          </h1>

          <form className="space-y-5">
            <div>
              <label
                htmlFor="customerId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                ID do Usuário
              </label>
              <input
                id="customerId"
                type="text"
                placeholder="Digite seu ID"
                value={customerId}
                onChange={(e) => setCustomerId(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="origin"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Endereço de Origem
              </label>
              <input
                id="origin"
                type="text"
                placeholder="Digite o endereço de origem"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="destination"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Endereço de Destino
              </label>
              <input
                id="destination"
                type="text"
                placeholder="Digite o endereço de destino"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div>
              <button
                type="submit"
                onClick={handleClick}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition duration-300"
              >
                Estimar viagem
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
