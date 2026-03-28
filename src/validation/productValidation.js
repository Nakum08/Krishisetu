import * as Yup from 'yup';

export const productValidationSchema = Yup.object().shape({
  crop: Yup.string().required('Crop name is required'),
  quantity: Yup.string().required('Quantity is required'),
  pricePerKg: Yup.string().required('Price per Kg is required'),
  category: Yup.string().required('Category is required'),
  nutrition: Yup.object().shape({
    calories: Yup.string(),
    protein: Yup.string(),
    carbohydrates: Yup.string(),
    fiber: Yup.string(),
    fat: Yup.string(),
  }),
}); 