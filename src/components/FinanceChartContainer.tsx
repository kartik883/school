import prisma from "@/lib/prisma";
import FinanceChart from "./FinanceChart";
import Image from "next/image";

const FinanceChartContainer = async () => {
  const data = await prisma.finance.findMany({
    orderBy: {
      date: "asc",
    },
  });

  const chartData = data.map((item) => ({
    name: item.name,
    income: item.income,
    expense: item.expense,
  }));

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Finance</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <FinanceChart data={chartData} />
    </div>
  );
};

export default FinanceChartContainer;
