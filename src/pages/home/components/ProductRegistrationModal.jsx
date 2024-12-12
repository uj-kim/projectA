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

import { createNewProduct, initialProductState } from '@/helpers/product';
// import { addProduct } from '@/store/product/productsActions';
import { useAddProduct } from '../../../store/product/useProductStore';
import { uploadImage } from '@/utils/imageUpload';

export const ProductRegistrationModal = ({
  isOpen,
  onClose,
  onProductAdded,
}) => {
  const [product, setProduct] = useState(initialProductState);
  const { mutate: addProduct } = useAddProduct();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setProduct((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async () => {
    if (!product.image) {
      console.error('이미지를 선택해야 합니다.');
      return;
    }

    try {
      const imageUrl = await uploadImage(product.image);
      const newProduct = createNewProduct(product, imageUrl);

      addProduct(newProduct, {
        onSuccess: () => {
          onClose();
          onProductAdded();
        },
        onError: (error) => {
          console.error('이미지 업로드에 실패했습니다.', error.message);
        },
      });
    } catch (error) {
      console.error('물품 등록에 실패했습니다.', error.message);
    }
  };

  const handleCategoryChange = (value) => {
    setProduct((prev) => ({
      ...prev,
      category: { ...prev.category, id: value },
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>상품 등록</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            name="title"
            placeholder="상품명"
            onChange={handleChange}
            value={product.title || ''}
          />
          <Input
            name="price"
            type="number"
            placeholder="가격"
            onChange={handleChange}
            value={product.price || ''}
          />
          <Textarea
            name="description"
            className="resize-none"
            placeholder="상품 설명"
            onChange={handleChange}
            value={product.description || ''}
          />
          <Select
            name="categoryId"
            onValueChange={handleCategoryChange}
            value={product.category.id || ''}
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
          <Input
            className="cursor-pointer"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>등록</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
