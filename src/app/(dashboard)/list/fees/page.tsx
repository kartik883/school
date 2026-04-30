import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Fee, Prisma, Student } from "@prisma/client";
import Image from "next/image";
import { auth, currentUser } from "@clerk/nextjs/server";
import PaymentButton from "@/components/PaymentButton";
import Script from "next/script";

type FeeList = Fee & { student: Student };

const FeeListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const user = await currentUser();
  const role = user?.publicMetadata?.role as string | undefined;
  const currentUserId = user?.id;

  const columns = [
    {
      header: "Student",
      accessor: "student",
    },
    {
      header: "Total Amount",
      accessor: "amount",
      className: "hidden md:table-cell",
    },
    {
      header: "Amount Paid",
      accessor: "amountPaid",
      className: "hidden md:table-cell",
    },
    {
      header: "Remaining",
      accessor: "remaining",
      className: "hidden md:table-cell",
    },
    {
      header: "Status",
      accessor: "status",
      className: "hidden lg:table-cell",
    },
    {
      header: "Due Date",
      accessor: "dueDate",
      className: "hidden lg:table-cell",
    },
    ...(role === "admin" || (role === "parent")
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: FeeList) => {
    const remaining = item.amount - item.amountPaid;
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
      >
        <td className="flex items-center gap-4 p-4">
          <div className="flex flex-col">
            <h3 className="font-semibold">{item.student.name} {item.student.surname}</h3>
            <p className="text-xs text-gray-500">{item.description}</p>
          </div>
        </td>
        <td className="hidden md:table-cell">₹{item.amount}</td>
        <td className="hidden md:table-cell">₹{item.amountPaid}</td>
        <td className="hidden md:table-cell">₹{remaining}</td>
        <td className="hidden lg:table-cell">
          <span className={`px-2 py-1 rounded-md text-xs font-semibold ${item.status === 'PAID' ? 'bg-green-100 text-green-600' : item.status === 'PARTIAL' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
            {item.status}
          </span>
        </td>
        <td className="hidden lg:table-cell">{new Date(item.dueDate).toLocaleDateString()}</td>
        <td>
          <div className="flex items-center gap-2">
            {role === "admin" && (
              <>
                <FormContainer table="fee" type="update" data={item} />
                <FormContainer table="fee" type="delete" id={item.id} />
              </>
            )}
            {role === "parent" && item.status !== "PAID" && remaining > 0 && (
              <PaymentButton feeId={item.id} amount={remaining} />
            )}
          </div>
        </td>
      </tr>
    );
  };

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION
  const query: Prisma.FeeWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.student = { name: { contains: value, mode: "insensitive" } };
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITIONS
  if (role === "parent" && currentUserId) {
    query.parentId = currentUserId;
  }
  if (role === "student" && currentUserId) {
    query.studentId = currentUserId;
  }

  const [data, count] = await prisma.$transaction([
    prisma.fee.findMany({
      where: query,
      include: {
        student: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.fee.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 relative">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Fees Management</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              <FormContainer table="fee" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default FeeListPage;
