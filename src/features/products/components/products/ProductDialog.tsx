import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2 } from "lucide-react";

import type { Category, Product } from "../../types";
import {
  productSchema,
  type ProductFormValues,
} from "../../schemas/product.schema";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

import { Switch } from "@/components/ui/switch";
import { productService } from "../../services/product.service";

type ProductDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  
  product?: Product;
  categories: Category[];

  onSubmit: (values: ProductFormValues) => Promise<void>;
};

export default function ProductDialog({
  open,
  onOpenChange,
  product,
  categories,
  onSubmit,
}: ProductDialogProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category_id: null,
      name: "",
      image_url: null,
      selling_price: 0,
      unit_cost: null,
      is_visible: true,
    },
  });

  useEffect(() => {
    if (!open) return;

    if (product) {
      reset({
        category_id: product.category_id,
        name: product.name,
        image_url: null,
        selling_price: product.selling_price,
        unit_cost: product.unit_cost,
        is_visible: product.is_visible,
      });

      setPreviewUrl(
        product.image_url
          ? productService.getImageUrl(product.image_url)
          : null,
      );

      return;
    }

    reset({
      category_id: null,
      name: "",
      image_url: null,
      selling_price: 0,
      unit_cost: 0,
      is_visible: true,
    });

    setPreviewUrl(null);
  }, [open, product, reset]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (file && file.size > 5 * 1024 * 1024) {
      event.target.value = "";
      return;
    }

    setValue("image_url", file, {
      shouldValidate: true,
    });

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(product?.image_url ?? null);
    }
  }

  async function submit(values: ProductFormValues) {
    await onSubmit(values);

    onOpenChange(false);

    reset();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!isSubmitting) {
          onOpenChange(value);
        }
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "New Product"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>

            <label
              htmlFor="image"
              className="flex h-52 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-muted transition hover:border-primary"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Product Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <ImagePlus className="h-10 w-10" />

                  <div className="text-center">
                    <p className="font-medium">Click to upload image</p>

                    <p className="text-xs">PNG, JPG or WEBP</p>
                  </div>
                </div>
              )}
            </label>

            <Input
              id="image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>

            <Input id="name" placeholder="Americano" {...register("name")} />

            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Category</Label>

            <Controller
              control={control}
              name="category_id"
              render={({ field }) => (
                <Select
                  value={field.value ?? "none"}
                  onValueChange={(value) =>
                    field.onChange(value === "none" ? null : value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {field.value === null || field.value === "none"
                        ? "No Category"
                        : categories.find((c) => c.id === field.value)?.name}
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="none">No Category</SelectItem>

                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="selling_price">Selling Price</Label>

              <Controller
                control={control}
                name="selling_price"
                render={({ field }) => (
                  <Input
                    id="selling_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? null : Number(e.target.value),
                      )
                    }
                  />
                )}
              />

              {errors.selling_price && (
                <p className="text-sm text-destructive">
                  {errors.selling_price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit_cost">Unit Cost</Label>

              <Controller
                control={control}
                name="unit_cost"
                render={({ field }) => (
                  <Input
                    id="unit_cost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? null : Number(e.target.value),
                      )
                    }
                  />
                )}
              />

              {errors.unit_cost && (
                <p className="text-sm text-destructive">
                  {errors.unit_cost.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label className="text-base">Available on Menu</Label>

              <p className="text-sm text-muted-foreground">
                Customers can order this product.
              </p>
            </div>

            <Controller
              control={control}
              name="is_visible"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : product ? (
                "Save Changes"
              ) : (
                "Create Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
