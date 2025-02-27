import React, { useState } from "react";
import { MdExpandMore } from "react-icons/md";
import { SupportTicket } from "../../types";

interface AdminTicketsTableProps {
  tickets: SupportTicket[];
  onCloseTicket: (ticketId: string) => void;
}

export default function AdminTicketsTable({
  tickets,
  onCloseTicket,
}: AdminTicketsTableProps) {
  const [expandedOpenTicketId, setExpandedOpenTicketId] = useState<string | null>(null);
  const [expandedClosedTicketId, setExpandedClosedTicketId] = useState<string | null>(null);
  const [showClosedTable, setShowClosedTable] = useState(false);

  const openTickets = tickets.filter((t) => t.status === "open");
  const closedTickets = tickets.filter((t) => t.status === "closed");

  function handleOpenRowClick(ticketId: string) {
    if (expandedOpenTicketId === ticketId) {
      setExpandedOpenTicketId(null);
    } else {
      setExpandedOpenTicketId(ticketId);
    }
  }

  function handleClosedRowClick(ticketId: string) {
    if (expandedClosedTicketId === ticketId) {
      setExpandedClosedTicketId(null);
    } else {
      setExpandedClosedTicketId(ticketId);
    }
  }

  return (
    <div className="text-white">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Open Tickets</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th className="p-2 border border-gray-600">User Email</th>
                <th className="p-2 border border-gray-600">Subject</th>
                <th className="p-2 border border-gray-600">Status</th>
                <th className="p-2 border border-gray-600">Created</th>
                <th className="p-2 border border-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {openTickets.map((t) => {
                const isExpanded = expandedOpenTicketId === t._id;
                return (
                  <React.Fragment key={t._id}>
                    <tr
                      onClick={() => t._id && handleOpenRowClick(t._id)}
                      className="bg-gray-800 hover:bg-gray-700 cursor-pointer"
                    >
                      <td className="p-2 border border-gray-600">{t.userEmail}</td>
                      <td className="p-2 border border-gray-600 flex items-center space-x-2">
                        <span>{t.subject}</span>
                        <MdExpandMore
                          className={`transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </td>
                      <td className="p-2 border border-gray-600">{t.status}</td>
                      <td className="p-2 border border-gray-600">
                        {new Date(t.createdAt).toLocaleString()}
                      </td>
                      <td className="p-2 border border-gray-600">
                        {t.status === "open" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              t._id && onCloseTicket(t._id);
                            }}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Close
                          </button>
                        )}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-gray-700">
                        <td colSpan={5} className="p-3 border border-gray-600">
                          <h4 className="font-semibold mb-1">Message:</h4>
                          <p>{t.message}</p>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-2">
          <h3 className="text-xl font-semibold">Closed Tickets</h3>
          <button
            onClick={() => setShowClosedTable((prev) => !prev)}
            className="bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-500"
          >
            {showClosedTable ? "Hide" : "Show"}
          </button>
        </div>
        {showClosedTable && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse shadow">
              <thead className="bg-gray-700 text-white">
                <tr>
                  <th className="p-2 border border-gray-600">User Email</th>
                  <th className="p-2 border border-gray-600">Subject</th>
                  <th className="p-2 border border-gray-600">Status</th>
                  <th className="p-2 border border-gray-600">Created</th>
                  <th className="p-2 border border-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {closedTickets.map((t) => {
                  const isExpanded = expandedClosedTicketId === t._id;
                  return (
                    <React.Fragment key={t._id}>
                      <tr
                        onClick={() => t._id && handleClosedRowClick(t._id)}
                        className="bg-gray-800 hover:bg-gray-700 cursor-pointer"
                      >
                        <td className="p-2 border border-gray-600">{t.userEmail}</td>
                        <td className="p-2 border border-gray-600 flex items-center space-x-2">
                          <span>{t.subject}</span>
                          <MdExpandMore
                            className={`transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </td>
                        <td className="p-2 border border-gray-600">{t.status}</td>
                        <td className="p-2 border border-gray-600">
                          {new Date(t.createdAt).toLocaleString()}
                        </td>
                        <td className="p-2 border border-gray-600" />
                      </tr>
                      {isExpanded && (
                        <tr className="bg-gray-700">
                          <td colSpan={5} className="p-3 border border-gray-600">
                            <h4 className="font-semibold mb-1">Message:</h4>
                            <p>{t.message}</p>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}