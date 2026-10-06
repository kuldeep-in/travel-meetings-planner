// Thin fetch wrapper around the FastAPI backend.

async function req(method, path, body) {
  const opts = { method, headers: {} };
  if (body !== undefined) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(`/api${path}`, opts);
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const j = await res.json();
      detail = j.detail || detail;
    } catch (e) {
      /* ignore */
    }
    throw new Error(detail);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  me: () => req("GET", "/me"),
  myAccountUsage: () => req("GET", "/me/account-usage"),

  listAccounts: () => req("GET", "/accounts"),
  setAccountPriority: (id, priority) =>
    req("PUT", `/accounts/${encodeURIComponent(id)}/priority`, { priority }),
  accountMeetings: (id) =>
    req("GET", `/accounts/${encodeURIComponent(id)}/meetings`),
  accountUseCases: (id) =>
    req("GET", `/accounts/${encodeURIComponent(id)}/use-cases`),
  accountUsage: (id) =>
    req("GET", `/accounts/${encodeURIComponent(id)}/usage`),

  listAccountPlans: (id) =>
    req("GET", `/accounts/${encodeURIComponent(id)}/plans`),
  createAccountPlan: (id, p) =>
    req("POST", `/accounts/${encodeURIComponent(id)}/plans`, p),
  getPlan: (planId) => req("GET", `/plans/${planId}`),
  updatePlan: (planId, p) => req("PUT", `/plans/${planId}`, p),
  setPlanStatus: (planId, status) => req("PUT", `/plans/${planId}/status`, { status }),
  deletePlan: (planId) => req("DELETE", `/plans/${planId}`),
  createPlanItem: (planId, item) => req("POST", `/plans/${planId}/items`, item),
  updatePlanItem: (itemId, item) => req("PUT", `/plan-items/${itemId}`, item),
  deletePlanItem: (itemId) => req("DELETE", `/plan-items/${itemId}`),

  listLinks: () => req("GET", "/links"),

  getPto: () => req("GET", "/pto"),
  setPto: (p) => req("PUT", "/pto", p),

  listFeedback: () => req("GET", "/feedback"),
  submitFeedback: (f) => req("POST", "/feedback", f),

  listPhotos: () => req("GET", "/photos"),
  setMyPhoto: (photo) => req("POST", "/photos", { photo }),
  deleteMyPhoto: () => req("DELETE", "/photos"),

  listUsers: () => req("GET", "/users"),
  createUser: (u) => req("POST", "/users", u),
  updateUser: (email, u) => req("PUT", `/users/${encodeURIComponent(email)}`, u),
  deleteUser: (email) => req("DELETE", `/users/${encodeURIComponent(email)}`),

  listTrips: () => req("GET", "/trips"),
  createTrip: (t) => req("POST", "/trips", t),
  getTrip: (id) => req("GET", `/trips/${id}`),
  updateTrip: (id, t) => req("PUT", `/trips/${id}`, t),
  deleteTrip: (id) => req("DELETE", `/trips/${id}`),

  addMember: (id, m) => req("POST", `/trips/${id}/members`, m),
  updateMember: (id, email, m) =>
    req("PUT", `/trips/${id}/members/${encodeURIComponent(email)}`, m),
  reorderMembers: (id, order) =>
    req("PUT", `/trips/${id}/members/reorder`, { order }),
  removeMember: (id, email) =>
    req("DELETE", `/trips/${id}/members/${encodeURIComponent(email)}`),

  listMeetings: (id) => req("GET", `/trips/${id}/meetings`),
  createMeeting: (id, m) => req("POST", `/trips/${id}/meetings`, m),
  updateMeeting: (mid, m) => req("PUT", `/meetings/${mid}`, m),
  deleteMeeting: (mid) => req("DELETE", `/meetings/${mid}`),

  listCities: (id) => req("GET", `/trips/${id}/cities`),
  setCity: (id, c) => req("PUT", `/trips/${id}/cities`, c),

  // Master city list (Settings → City setup)
  listCityNames: () => req("GET", "/cities"),
  addCityName: (name) => req("POST", "/cities", { name }),
  renameCityName: (name, newName) =>
    req("PUT", `/cities/${encodeURIComponent(name)}`, { name: newName }),
  reorderCityNames: (order) => req("PUT", "/cities/reorder", { order }),
  deleteCityName: (name) => req("DELETE", `/cities/${encodeURIComponent(name)}`),

  // Architecture strategy (per account) + tool catalog (Settings → Tool setup)
  getAccountArchitecture: (id) =>
    req("GET", `/accounts/${encodeURIComponent(id)}/architecture`),
  setArchitectureRows: (id, capabilityId, triplet) =>
    req("PUT", `/accounts/${encodeURIComponent(id)}/architecture/${encodeURIComponent(capabilityId)}`,
      triplet), // { current: [...], intermediate: [...], future: [...] }
  getArchitectureCatalog: () => req("GET", "/architecture/catalog"),
  createArchTool: (t) => req("POST", "/architecture/tools", t),
  updateArchTool: (toolId, patch) =>
    req("PUT", `/architecture/tools/${toolId}`, patch),
  deleteArchTool: (toolId) => req("DELETE", `/architecture/tools/${toolId}`),

  // Target-architecture diagram (React Flow canvas) — one per account.
  getArchDiagram: (id) =>
    req("GET", `/accounts/${encodeURIComponent(id)}/target-architecture`),
  setArchDiagram: (id, diagram) =>
    req("PUT", `/accounts/${encodeURIComponent(id)}/target-architecture`, { diagram }),

  // Org chart (people reporting tree) — one per account.
  getOrgChart: (id) => req("GET", `/accounts/${encodeURIComponent(id)}/org-chart`),
  saveOrgChart: (id, chart) =>
    req("PUT", `/accounts/${encodeURIComponent(id)}/org-chart`, { chart }),
};
