import React from "react";
import { SelectInput } from "~/domains/common/ui/SelectInput";

export const MemberRoleInput = () => {
  const options = [
    { label: "Admin", value: "admin" },
    // { label: "Member", value: "member" },
  ];

  const value = "admin";

  return <SelectInput options={options} value={value} onChange={() => {}} />;
};
