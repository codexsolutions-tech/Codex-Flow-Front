import sysgrafix from "./sysgrafix.service";

const WorkflowService = {
  create: (spreadsheet_date: string) => sysgrafix.post("/workflow/create", { spreadsheet_date, data: [] }),
  update: (spreadsheet_date: string, data: unknown[]) => sysgrafix.put("/workflow/update", { spreadsheet_date, data }),
  getByDate: (date: string) => sysgrafix.get(`/workflow/${date}`),
  getAllDates: () => sysgrafix.get("/workflow/dates"),
  deleteByDate: (date: string) => sysgrafix.delete(`/workflow/${date}`),
};

export default WorkflowService;
