import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Popover } from "@/components/ui/popover";
import { useSelector } from "react-redux";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { toast } from "react-hot-toast";

const shortListingStatus = ["Accepted", "Rejected"];
const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.applicationSlice);

  const statusHandler = async (status,id) => {
    try {
        const res = await axios.post(`${APPLICATION_API_END_POINT}/update-application-status/${id  }`, {status},{
            withCredentials:true
        });
        if (res.data.success){
            toast.success(res.data.message);
        }
    } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
    }
  }
  return (
    <div>
      <Table>
        <TableCaption>List of all applicants for this job</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants &&
            applicants?.applicationSlice?.map((item) => (
              <tr key={item._id}>
                <TableCell>{item?.applicant?.name}</TableCell>
                <TableCell>{item?.applicant?.email}</TableCell>
                <TableCell>{item?.applicant?.contact}</TableCell>
                <TableCell>
                    {
                        item?.applicant?.profile?.resume ? <Button variant="outline" size="sm" onClick={() => window.open(item?.applicant?.profile?.resume, "_blank")}>
                    View Resume
                  </Button> : "N/A"
                    }
                  
                </TableCell>
                <TableCell>{item?.applicant?.createdAt?.split("T")[0]}</TableCell>
                <TableCell className="float-right cursor-pointer">
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal />
                    </PopoverTrigger>
                    <PopoverContent className="w-40">
                      {shortListingStatus.map((status, index) => {
                        return (
                          <div onClick={()=>statusHandler(status,item?._id)}
                            key={index}
                            className="flex w-fit items-center my-2 cursor-pointer"
                          >
                            <span>{status}</span>
                          </div>
                        );
                      })}
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </tr>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
