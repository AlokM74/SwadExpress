export const isPresentInFavorites = (favorites, restaurant) => {
  for (let item of favorites || []) {
    if (String(restaurant.id) === String(item.id)) {
      return true;
    }
  }

  return false;
};