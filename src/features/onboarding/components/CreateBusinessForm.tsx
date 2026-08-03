import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/app/providers/AppProvider";
import { MoveRight, Building2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  businessSchema,
  type BusinessFormValues,
} from "../schemas/business.schema";
import { businessService } from "../services/business.service";

export default function CreateBusinessForm() {
  const navigate = useNavigate();
  const { refreshBusiness } = useApp();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: "",
      businessType: "",
      currency: "PHP",
      logo: null,
    },
  });

  const businessName = watch("name");

  useEffect(() => {
    if (errors.logo?.message) {
      toast.error(errors.logo.message, { id: "err-logo" });
    }
    if (errors.name?.message) {
      toast.error(errors.name.message, { id: "err-name" });
    }
    if (errors.businessType?.message) {
      toast.error(errors.businessType.message, { id: "err-type" });
    }
    if (errors.currency?.message) {
      toast.error(errors.currency.message, { id: "err-currency" });
    }
  }, [
    errors.logo?.message,
    errors.name?.message,
    errors.businessType?.message,
    errors.currency?.message,
  ]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("Logo must be smaller than 5 MB.", { id: "err-logo" });
      event.target.value = "";
      setValue("logo", null, { shouldValidate: true });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      return;
    }

    setValue("logo", file, { shouldValidate: true });
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  }

  async function onSubmit(data: BusinessFormValues) {
    try {
      toast.dismiss("submit-error");

      await businessService.create({
        name: data.name,
        business_type: data.businessType,
        currency: data.currency,
        logo: data.logo ?? null,
      });

      await refreshBusiness();
      toast.success("Business created successfully.");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error("Unable to create your business.", {
        id: "submit-error",
      });
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white shadow-xs">
        <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-gray-50 transition-all duration-300">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Business logo preview"
              className="h-full w-full object-cover animate-in fade-in zoom-in-95 duration-200"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-gray-400 animate-in fade-in duration-300">
              <Building2 className="h-8 w-8 stroke-[1.5]" />
              <span className="text-[10px] font-semibold mt-1 uppercase tracking-wider text-gray-400">
                {businessName ? businessName.slice(0, 2) : "UI"}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-1.5">
          <Label
            htmlFor="logo"
            className="text-sm font-medium flex items-baseline gap-1.5"
          >
            Business Logo
            <span className="text-xs text-gray-400 font-normal">
              (Optional)
            </span>
          </Label>
          <p className="text-xs text-gray-500 leading-normal">
            Supports PNG or JPG. A square resolution works best.
          </p>
          <Input
            id="logo"
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="h-9 py-1 text-xs cursor-pointer file:text-xs file:font-medium"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Business Name</Label>
        <Input
          id="name"
          placeholder="Acme Coffee"
          {...register("name")}
          className="py-5"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessType">Business Type</Label>
        <Input
          id="businessType"
          placeholder="Coffee Shop"
          className="py-5"
          {...register("businessType")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="currency">Currency</Label>

        <Controller
          control={control}
          name="currency"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full py-5 flex items-center justify-between font-semibold">
                <SelectValue />
              </SelectTrigger>

              <SelectContent className="p-2 font-semibold">
                <SelectItem value="PHP" className="py-2 cursor-pointer">
                  PHP
                </SelectItem>
                <SelectItem value="USD" className="py-2 cursor-pointer">
                  USD
                </SelectItem>
                <SelectItem value="EUR" className="py-2 cursor-pointer">
                  EUR
                </SelectItem>
                <SelectItem value="JPY" className="py-2 cursor-pointer">
                  JPY
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* 🚀 Submit Button */}
      <Button
        type="submit"
        className="w-full transition-all duration-200 active:scale-[0.99] py-5"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Creating Business...
          </span>
        ) : (
          <span className="flex items-center gap-2 group">
            Finish set up
            <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        )}
      </Button>
    </form>
  );
}
