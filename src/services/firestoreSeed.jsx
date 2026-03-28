import { getFirestore, doc, setDoc, getDocs } from 'firebase/firestore';
import app from './firebase';

const db = getFirestore(app);

export const createCategory = async (category) => {
  try {
    await setDoc(doc(db, 'categories', category.id), category);
    console.log(`Category "${category.name}" created successfully.`);
  } catch (error) {
    console.error(`Error creating category "${category.name}": `, error);
  }
};

export const seedCategories = async () => {
  const categories = [
    {
      id: 'vegetables',
      name: 'Vegetables',
      imageUri: 'https://assets.cntraveller.in/photos/60ba23b90f3a5367ec9fe85b/16:9/w_960,c_limit/Farm-fresh-produce-1366x768.jpg',
    },
    {
      id: 'fruits',
      name: 'Fruits',
      imageUri: 'https://www.shutterstock.com/shutterstock/photos/148363040/display_1500/stock-photo-basket-of-fresh-organic-fruits-in-the-garden-148363040.jpg',
    },
    {
      id: 'grains',
      name: 'Grains',
      imageUri: 'https://hips.hearstapps.com/hmg-prod/images/gettyimages-611609590-6627de2d8c0bb.jpg?crop=1.00xw:0.753xh;0,0&resize=1200:*',
    },
    {
      id: 'nuts',
      name: 'Nuts',
      imageUri: 'https://www.datocms-assets.com/20941/1636995833-nutshero.png?auto=compress&dpr=0.95&fm=jpg&w=850',
    },
    {
      id: 'legumes',
      name: 'Legumes',
      imageUri: 'https://media.gettyimages.com/id/1178796552/photo/top-view-of-leguminous-seeds-on-rustic-wood-table.jpg?s=612x612&w=0&k=20&c=HK5vsoieCf5I6dW_RxaNqM9nR1L1MXLwm10-bOOm0tA=',
    },
    {
      id: 'spices',
      name: 'Spices',
      imageUri: 'https://media.gettyimages.com/id/497186232/photo/indian-spices-in-wooden-trays.jpg?s=612x612&w=0&k=20&c=JXv3WFsyPZ8s21FEDQ_YexvMSeOd9r3yGWd1JY8UTrg=',
    },
    {
      id: 'honey',
      name: 'Honey',
      imageUri: 'https://i.pinimg.com/736x/39/da/eb/39daebc95fe2d3cd2ce527195224c6d4.jpg',
    },
  ];

  for (const category of categories) {
    await createCategory(category);
  }
};


// seedCategories();

