"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect } from "react";
import { financeSchema, FinanceSchema } from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import { createFinance, updateFinance } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const FinanceForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FinanceSchema>({
    resolver: zodResolver(financeSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createFinance : updateFinance,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Finance record has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new finance record" : "Update the finance record"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Name (e.g. Month)"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Income"
          name="income"
          type="number"
          defaultValue={data?.income}
          register={register}
          error={errors?.income}
        />
        <InputField
          label="Expense"
          name="expense"
          type="number"
          defaultValue={data?.expense}
          register={register}
          error={errors?.expense}
        />
        <InputField
          label="Date"
          name="date"
          type="date"
          defaultValue={data?.date?.toISOString().split("T")[0]}
          register={register}
          error={errors?.date}
        />
      </div>
      {data && (
        <InputField
          label="Id"
          name="id"
          defaultValue={data?.id}
          register={register}
          error={errors?.id}
          hidden
        />
      )}
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Submit" : "Update"}
      </button>
    </form>
  );
};

export default FinanceForm;
