export const STATUS_TERDAFTAR_ID = "3f2a882a-7ddb-4ac8-a88c-25693dc61571";
export const STATUS_DITOLAK_ID = "7099f0ed-7cea-49f1-9dd3-85a0a7850740";
export const STATUS_DITERIMA_ID = "787bc335-16f2-4a99-ae63-e14db3ca845c";
export const STATUS_SELESAI_ID = "99dd296b-d6ba-4d6e-90c2-e526b2e19ab4";

export const AGENDA_STATUSES = {
  TERDAFTAR: STATUS_TERDAFTAR_ID,
  DITOLAK: STATUS_DITOLAK_ID,
  DITERIMA: STATUS_DITERIMA_ID,
  SELESAI: STATUS_SELESAI_ID,
};

export const getAgendaStatusIcon = (statusId) => {
  switch (statusId) {
    case STATUS_SELESAI_ID:
      return "fa fa-check-circle"; // Completed
    case STATUS_DITOLAK_ID:
      return "fa fa-times-circle"; // Rejected
    case STATUS_DITERIMA_ID:
      return "fa fa-check"; // Accepted
    case STATUS_TERDAFTAR_ID:
    default:
      return "fa fa-clock-o"; // Registered/Pending
  }
};

export const getAgendaStatusSemantic = (statusId) => {
  switch (statusId) {
    case STATUS_SELESAI_ID:
      return "completed";
    case STATUS_DITOLAK_ID:
      return "rejected";
    case STATUS_DITERIMA_ID:
      return "accepted";
    case STATUS_TERDAFTAR_ID:
    default:
      return "registered";
  }
};

export const getAgendaCancelReasonKey = (statusId) => {
  switch (statusId) {
    case STATUS_SELESAI_ID:
      return "Cannot cancel - Event completed";
    case STATUS_DITOLAK_ID:
      return "Cannot cancel - Registration rejected";
    case STATUS_DITERIMA_ID:
      return "Cannot cancel - Already accepted";
    default:
      return "Cannot cancel registration";
  }
};
