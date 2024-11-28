import { useEffect, useState } from 'react';
import { rideHistory, rideHistoryResponse } from '../api/rideHistory';
import { useRide } from '../context/rideContext';
import { NavbarComponent } from '../components/NavbarComponent';

export function RideHistory() {
  const { estimate } = useRide();
  const [rideHistoryData, setRideHistoryData] =
    useState<rideHistoryResponse | null>(null);

  const [filteredRides, setFilteredRides] =
    useState<rideHistoryResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customerId, setCustomerId] = useState<number | null>(
    estimate?.inputs?.customerId ? Number(estimate.inputs.customerId) : null,
  );

  const [inputCustomerId, setInputCustomerId] = useState<string>(
    estimate?.inputs?.customerId ? String(estimate.inputs.customerId) : '',
  );

  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [userName, setUserName] = useState<string | null>(null);

  const loadRideHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!customerId) {
        setError('Por favor, insira um ID de usuário.');
        return;
      }

      const data = await rideHistory(customerId, 0);
      setRideHistoryData(data);
      setFilteredRides(data);

      setUserName(`Usuário #${customerId}`);
    } catch (err) {
      console.error(err);
      setError('Usuário não encontrado. Por favor, tente novamente.');
      setUserName(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterByDriver = (driverName: string) => {
    setSelectedDriver(driverName);
    if (driverName === '') {
      setFilteredRides(rideHistoryData);
    } else {
      const filtered = rideHistoryData?.rides.filter(
        (ride) => ride.driver.name === driverName,
      );
      setFilteredRides({
        ...rideHistoryData,
        customer_id: rideHistoryData?.customer_id ?? 0,
        rides: filtered || [],
      });
    }
  };

  const calculateTotalSpent = () => {
    return (
      filteredRides?.rides.reduce(
        (acc, ride) => acc + parseFloat(ride.value),
        0,
      ) || 0
    );
  };

  useEffect(() => {
    if (customerId !== null) {
      loadRideHistory();
    }
  }, [customerId]);

  return (
    <>
      {' '}
      <NavbarComponent page="/" text="Solicitar Viagem" />
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className=" mx-0  my-0 top-0 left-0 right-0 w-screen"></div>
        <div className="top-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h1 className="text-3xl font-bold text-emerald-600 text-center mb-4">
            Histórico de Corridas
          </h1>
          <p className="text-center text-gray-600 mb-4">
            Pesquise o histórico de corridas inserindo o ID do usuário abaixo.
          </p>

          {userName && (
            <p className="text-center text-emerald-600 font-semibold mb-4">
              Procurando corridas de: <span>{userName}</span>
            </p>
          )}

          {error && (
            <div className="text-red-500 text-center mb-4 font-semibold">
              {error}
            </div>
          )}

          <div className="flex flex-col md:flex-row items-end gap-4">
            <div className="flex flex-col w-full md:w-1/2">
              <label
                htmlFor="customerId"
                className="font-semibold text-gray-700"
              >
                ID do Usuário:
              </label>
              <input
                type="number"
                id="customerId"
                value={inputCustomerId}
                onChange={(e) => setInputCustomerId(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 mt-2"
                placeholder="Digite o ID do usuário"
              />
            </div>
            <div className="flex w-full md:w-auto justify-center">
              <button
                onClick={() => setCustomerId(Number(inputCustomerId))}
                disabled={!inputCustomerId.trim()}
                className={`w-full md:w-auto px-6 py-3 rounded-lg transition ${
                  inputCustomerId.trim()
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Pesquisar
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center text-gray-600">Carregando...</div>
        )}

        {filteredRides && filteredRides.rides.length > 0 && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center gap-4">
                <label
                  htmlFor="driverFilter"
                  className="font-semibold text-gray-700"
                >
                  Filtrar por Motorista:
                </label>
                <select
                  id="driverFilter"
                  value={selectedDriver}
                  onChange={(e) => handleFilterByDriver(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="">Todos os motoristas</option>
                  {rideHistoryData?.rides
                    ?.map((ride) => ride.driver.name)
                    ?.filter(
                      (name, index, self) => self.indexOf(name) === index,
                    )
                    ?.map((name, index) => (
                      <option key={index} value={name}>
                        {name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {filteredRides.rides.map((ride, index) => (
                <div
                  key={ride.id}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:border-emerald-600 transition duration-300 relative"
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Corrida #{ride.id}
                  </h2>
                  {index === 0 && (
                    <span className="absolute top-2 right-2 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded">
                      Mais Recente
                    </span>
                  )}
                  <p className="text-gray-700">
                    <span className="font-semibold">Origem:</span> {ride.origin}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Destino:</span>{' '}
                    {ride.destination}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Distância:</span>{' '}
                    {Number(ride.distance)} km
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Duração:</span>{' '}
                    {ride.duration}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Valor:</span> R${' '}
                    {ride.value}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Motorista:</span>{' '}
                    {ride.driver.name}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Data | Hora:</span>{' '}
                    {ride.date_created}
                  </p>
                </div>
              ))}
            </div>

            <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-emerald-700 transition duration-300">
              <p className="text-lg font-semibold">
                Total de Corridas: {filteredRides.rides.length}
              </p>
              <p className="text-lg font-semibold">
                Total Gasto: R$ {calculateTotalSpent().toFixed(2)}
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
