import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  PopoverContent,
  Popover,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreHorizontal, Edit2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const CompanyTable = () => {
  const { allCompanies: raw, searchCompanybyText } = useSelector(
    (store) => store.companySlice,
);
const allCompanies = Array.isArray(raw) ? raw : [];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filterCompany, setFilterCompany] = useState([]);

  useEffect(() => {
    const filtered = allCompanies.filter((company) => {
      if (!searchCompanybyText) return true;
      return company?.name
        ?.toLowerCase()
        .includes(searchCompanybyText.toLowerCase());
    });
    setFilterCompany(filtered);
  }, [JSON.stringify(allCompanies), searchCompanybyText]);

  return (
    <div>
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <Table>
          <TableCaption className="text-xs text-gray-400 mb-3">
            List of all registered companies
          </TableCaption>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="text-xs font-semibold text-[#0066FF] uppercase tracking-wide">
                Logo
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#0066FF] uppercase tracking-wide">
                Name
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#0066FF] uppercase tracking-wide">
                Date
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#0066FF] uppercase tracking-wide">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filterCompany.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-gray-400 text-sm py-10"
                >
                  No companies found
                </TableCell>
              </TableRow>
            ) : (
              filterCompany.map((company) => (
                <TableRow
                  key={company._id}
                  className="hover:bg-blue-50 transition-colors duration-150"
                >
                  <TableCell>
                    <Avatar className="h-9 w-9 ring-2 ring-blue-100">
                      <AvatarImage src={company.logo} />
                    </Avatar>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-gray-800">
                    {company.name}
                  </TableCell>
                  <TableCell className="text-sm text-gray-400">
                    {company.createdAt?.split("T")[0]}
                  </TableCell>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <MoreHorizontal className="h-4 w-4 text-gray-500" />
                      </PopoverTrigger>
                      <PopoverContent className="w-32 p-2 rounded-xl shadow-md border border-gray-100">
                        <div
                          onClick={() =>
                            navigate(`/admin/companies/${company._id}`)
                          }
                          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-blue-50 hover:text-[#0066FF] cursor-pointer transition-colors text-sm"
                        >
                          <Edit2 className="h-4 w-4" />
                          <span>Edit</span>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CompanyTable;
