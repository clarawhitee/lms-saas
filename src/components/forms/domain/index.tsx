"use client";

import { FormGenerator } from "@/components/global/form-generator";
import { Loader } from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { useCustomDomain } from "@/hooks/groups";
import { cn } from "@/lib/utils";
import { CircleAlert, CircleCheck } from "lucide-react";

type CustomDomainFormProps = {
  groupid: string;
};

export const CustomDomainForm = ({ groupid }: CustomDomainFormProps) => {
  const { register, errors, onAddDomain, isPending, data } = useCustomDomain(groupid);

  return (
    <div className="flex flex-col items-center gap-y-6 p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg max-w-lg mx-auto transition-all duration-300">
      <form
        className="flex w-full gap-x-4 items-end mt-4"
        onSubmit={onAddDomain}
      >
        <FormGenerator
          register={register}
          errors={errors}
          name="domain"
          label="Domain"
          inputType="input"
          type="text"
          placeholder={data?.domain || "e.g. example.com"}
          className="w-full text-white placeholder-gray-400 bg-gray-700 focus:bg-gray-600 rounded-lg p-3 shadow-md transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-400"
        />
        <Button
          className={cn(
            "flex items-center justify-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg px-5 py-3 shadow-md transition-all duration-300",
            isPending && "bg-blue-500 cursor-wait"
          )}
          variant="outline"
          disabled={isPending}
        >
          <Loader loading={isPending}>Add Domain</Loader>
        </Button>
      </form>
      <div
        className={cn(
          "flex items-center gap-x-3 p-4 w-full rounded-xl text-sm shadow-lg transition-all duration-300",
          data?.status.misconfigured ? "bg-red-500 text-white" : "bg-green-500 text-white"
        )}
      >
        {data?.status.misconfigured ? (
          <CircleAlert size={20} className="text-white" />
        ) : (
          <CircleCheck size={20} className="text-white" />
        )}
        <p className="text-white font-medium">
          {data?.status.misconfigured
            ? "DNS not configured correctly"
            : "DNS configured correctly"}
        </p>
      </div>
    </div>
  );
};
