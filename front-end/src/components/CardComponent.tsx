interface CardComponentProps {
  driverName: string;
  driverImage: string;
  vehicle: string;
  description: string;
  rating: number;
  comment: string;
  value: number;
  onClick: () => void;
  isSelected: boolean;
}

export const CardComponent: React.FC<CardComponentProps> = ({
  driverName,
  driverImage,
  vehicle,
  description,
  rating,
  comment,
  value,
  onClick,
  isSelected,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white shadow-md rounded-lg p-6 cursor-pointer transition duration-300 transform ${
        isSelected
          ? 'border-emerald-600 scale-105'
          : 'border-transparent scale-100'
      } border-4`}
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          {driverImage ? (
            <img
              src={driverImage}
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="bg-gray-300 w-full h-full flex items-center justify-center text-lg font-bold">
              {driverName[0]}
            </div>
          )}
        </div>
        <div className="ml-4">
          <h2 className="text-lg font-semibold">{driverName}</h2>
          <p className="text-gray-500 text-sm">{vehicle}</p>
        </div>
      </div>
      <div className="text-gray-600 mb-4 space-y-1">
        <p>
          <span className="font-semibold">Descrição:</span> {description}
        </p>
        <p>
          <span className="font-semibold">Avaliação:</span> {rating} ★
        </p>
        <p>
          <span className="font-semibold">Comentário:</span> {comment}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-xl font-bold text-emerald-600">
          R$ {value.toFixed(2)}
        </p>
      </div>
    </div>
  );
};
