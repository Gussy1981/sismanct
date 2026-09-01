import ListadoCorrectivo from "../../listados/listadoCorrectivo";
import { useLocation } from "react-router-dom";

const CorrectivoAdmin = () => {
  const location = useLocation();
  const pedido = location.state?.pedido;

  return (
    <>
      <div className="flex justify-center items-center text-center h4 py-4">
        Gestion de Mantenimiento Correctivo
      </div>
      <ListadoCorrectivo pedido={pedido} />
    </>
  );
};

export default CorrectivoAdmin;
