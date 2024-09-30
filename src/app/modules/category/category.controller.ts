import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CategoryService } from './category.service'; // Assuming you have a CategoryService with necessary methods

const createCategory = catchAsync(async (req, res) => {
  const result = await CategoryService.createCategory(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Category is created successfully',
    data: result,
  });
});

const getCategoryById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CategoryService.getCategoryById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category is retrieved successfully',
    data: result,
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const result = await CategoryService.getAllCategories(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Categories are retrieved successfully',
    meta: result.meta, 
    data: result.data,
  });
});

const updateCategoryById = catchAsync(async (req, res) => {
  const categoryId = req?.params?.id;
  const result = await CategoryService.updateCategoryById(categoryId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category is updated successfully',
    data: result,
  });
});

const deleteCategoryById = catchAsync(async (req, res) => {
  const { id } = req.params;
  await CategoryService.deleteCategoryById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category is deleted successfully',
    data: null,
  });
});

export const CategoryController = {
  createCategory,
  getCategoryById,
  getAllCategories,
  updateCategoryById,
  deleteCategoryById,
};