import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ALL_CATEGORY_ID, categories } from '@/constants';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { createNewProduct, initialProductState } from '@/helpers/product';
import { uploadImage } from '@/utils/imageUpload';
import useProductsStore, {
  useAddProduct,
} from '@/store/product/useProductsStore';
import useToastStore from '../../../store/toast/useToastStore';

export const ProductRegistrationModal = ({
  isOpen,
  onClose,
  onProductAdded,
}) => {
  const { mutate: addProduct } = useAddProduct();
  const { addToast } = useToastStore();

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setProduct((prev) => ({ ...prev, [name]: value }));
  // };
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      price: '',
      description: '',
      categoryId: '',
      image: null,
    },
  });

  const onSubmit = async (data) => {
    try {
      if (!data.image) {
        throw new Error('이미지를 선택해야 합니다.');
      }

      const imageUrl = await uploadImage(data.image);
      if (!imageUrl) {
        throw new Error('이미지 업로드에 실패했습니다.');
      }

      const newProduct = createNewProduct({ ...data, image: imageUrl });
      addProduct(newProduct, {
        onSuccess: () => {
          onClose();
          onProductAdded();
          addToast('등록 성공!', 'success');
        },
        onError: (error) => {
          console.error('물품 등록에 실패했습니다.', error);
        },
      });
    } catch (error) {
      addToast('등록 실패', 'error');
      console.error('물품 등록에 실패했습니다.', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('image', file);
    }
  };

  // const handleCategoryChange = (value) => {
  //   setProduct((prev) => ({
  //     ...prev,
  //     category: { ...prev.category, id: value },
  //   }));
  // };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>상품 등록</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <Input {...register('title')} placeholder="상품명" />
          <Input
            {...register('price', { valueAsNumber: true })}
            type="number"
            placeholder="가격"
          />
          <Textarea
            {...register('description')}
            className="resize-none"
            placeholder="상품 설명"
          />
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((category) => category.id !== ALL_CATEGORY_ID)
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          />
          <Input
            className="cursor-pointer"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <DialogFooter>
            <Button type="submit">등록</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
