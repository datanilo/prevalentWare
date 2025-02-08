import { NextApiRequest, NextApiResponse } from 'next';
import { gql } from '@apollo/client';
import client from '@/lib/apolloClient';
// Se define la consulta GET_MOVEMENTS directamente aquí
const GET_MOVEMENTS = gql`
  query GetMovements {
    movements {
      id
      concept
      amount
      date
      user {
        name
      }
    }
  }
`;

// Función para generar el CSV
interface Movement {
  id: string;
  concept: string;
  amount: number;
  date: string;
  user: {
    name: string;
  };
}

async function generateCSV(data: Movement[]): Promise<string> {
  const headers = 'ID,Concepto,Monto,Fecha,Usuario\n';
  const rows = data
    .map(
      (movement) =>
        `${movement.id},${movement.concept},${movement.amount},${movement.date},${movement.user.name}`
    )
    .join('\n');
  return headers + rows;
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Se usa el Apollo Client existente para hacer la consulta
      const { data } = await client.query({
        query: GET_MOVEMENTS,
      });

      // Genera el archivo CSV con los datos obtenidos
      const csvContent = await generateCSV(data.movements);

      // Configura los encabezados para la descarga del archivo CSV
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte_movimientos.csv');
      res.status(200).send(csvContent);
    } catch (error) {
      console.error('Error al generar el CSV:', error);
      res.status(500).json({ error: 'Error al generar el CSV' });
    }
  } else {
    // Si no es un GET, devolvemos un error
    res.status(405).json({ error: 'Método no permitido' });
  }
}
