import { formatRelative, parseISO } from "date-fns";
import globals from "../global.json";

export const fetchAll = async ({
  desiloContract,
  ceramic,
  idx
}, projectId) => {
  return Promise.resolve(reviews);
};

export const add = (data) => {
  reviews.push({
    id: reviews.length,
    ...data
  });
};

let reviewText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Quisque efficitur efficitur vehicula. Fusce in dapibus nunc. 
Sed lacus nunc, fermentum in placerat quis, vestibulum viverra odio. 
Sed tempor imperdiet aliquam. Donec aliquet risus erat, vitae egestas dolor consectetur ut.
In hac habitasse platea dictumst. Nullam eleifend elementum arcu, sed posuere velit aliquet at. 
Cras feugiat dignissim tempor. Integer blandit est leo, nec ultrices elit interdum quis.
Integer non nisi nisi. Donec bibendum sollicitudin urna, ut faucibus est vestibulum ut. 
Fusce luctus massa nec dui tincidunt venenatis.`

let reviews = [
  {
    id: 1,
    content: reviewText,
    author: "Chinmay",
    publishedAt: formatRelative(parseISO("2021-08-08"), new Date()),
  },
  {
    id: 2,
    content: reviewText,
    author: "Sandwich",
    publishedAt:formatRelative(parseISO("2021-08-09"), new Date()),
  },
  {
    id: 3,
    content: reviewText,
    author: "Jacky",
    publishedAt: formatRelative(parseISO("2021-08-10"), new Date()),
  },
];

