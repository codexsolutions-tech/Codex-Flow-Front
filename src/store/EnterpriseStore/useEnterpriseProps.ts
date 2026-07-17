import EnterpriseType from "../../types/EnterpriseType";

interface useEnterpriseProps {
  enterprise: EnterpriseType | null;
  fetchEnterprise: (id: number) => void;
  updateEnterprise: (id: number, data: Partial<EnterpriseType>) => Promise<void>;
}

export default useEnterpriseProps;
