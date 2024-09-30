import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { Category } from './category.model'; // Assuming you have a Category model
import { ICategory } from './category.interface'; // Assuming you have a Category interface

const createCategory = async (payload: ICategory) => {
  return await Category.create(payload);
};

const getCategoryById = async (categoryId: string) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return category;
};

const getAllCategories = async (query: Record<string, unknown>) => {
  const categoryQuery = new QueryBuilder(Category.find({isDeleted: false}), query)
    .search(['name']) 
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await categoryQuery.modelQuery;
  const metaData = await categoryQuery.countTotal();
  return {
    meta: metaData,
    data: result,
  };
};

const updateCategoryById = async (
  categoryId: string,
  payload: Partial<ICategory>,
) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    { _id: categoryId },
    payload,
    {
      new: true,
      runValidators: true,
    },
  );

  return updatedCategory;
};

const deleteCategoryById = async (categoryId: string) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }

  // Set the category as deleted or remove from DB
  const result = await Category.findByIdAndUpdate(categoryId, {
    isDeleted: true, 
  });

  return result;
};

export const CategoryService = {
  createCategory,
  getCategoryById,
  getAllCategories,
  updateCategoryById,
  deleteCategoryById,
};