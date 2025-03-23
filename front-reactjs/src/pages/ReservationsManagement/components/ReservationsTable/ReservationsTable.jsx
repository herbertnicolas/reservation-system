import React, { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableRow } from "../../../../components/ui/table";

export function ReservationsTable({ reservations, onEdit }) {
  return (
    <div className="rounded-md border w-full p-4">
      <Table>
        <thead>
          <tr>
            <th>Identificador</th>
            <th>Tipo</th>
            <th>Status</th>
            <th>Editar</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length ? (
            reservations.map((reservation) => (
              <TableRow key={reservation._id}>
                <TableCell>{reservation._id}</TableCell>
                <TableCell>{reservation.type}</TableCell>
                <TableCell>{reservation.statusReserva}</TableCell>
                <TableCell>
                  <Button
                    className="bg-blue-500 text-white"
                    onClick={() => onEdit(reservation)}
                  >
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-gray-500 py-4">
                Nenhuma reserva encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
