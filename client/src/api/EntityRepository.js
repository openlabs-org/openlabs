import { formatRelative, parseISO } from "date-fns";
import globals from "../global.json";

const fileIcon = require("extract-file-icon"); 

export const fetchAll = async ({ desiloContract, ceramic, idx }, projectId) => {
  // let entities = await desiloContract.methods
  //   .getProjectEntities(projectId)
  //   .call();
  return Promise.resolve(entities);
};

export const add = (data) => {
  entities.push({
    id: entities.length,
    ...data,
  });
};

let reviewText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Quisque efficitur efficitur vehicula. Fusce in dapibus nunc. 
Sed lacus nunc, fermentum in placerat quis, vestibulum viverra odio. 
Sed tempor imperdiet aliquam. Donec aliquet risus erat, vitae egestas dolor consectetur ut.
In hac habitasse platea dictumst. Nullam eleifend elementum arcu, sed posuere velit aliquet at. 
Cras feugiat dignissim tempor. Integer blandit est leo, nec ultrices elit interdum quis.
Integer non nisi nisi. Donec bibendum sollicitudin urna, ut faucibus est vestibulum ut. 
Fusce luctus massa nec dui tincidunt venenatis.`;

let reviewSample = {
  content: reviewText,
  author: "Chinmay",
  publishedAt: formatRelative(parseISO("2021-08-08"), new Date()),
};

let entitySample1 = {
  icon : fileIcon("../resources/example.csv", 64),
  name: "examplev1.csv",
  file: require("../resources/example.csv"),
  publishedAt: formatRelative(parseISO("2021-08-08"), new Date()),

}

let entitySample2 = {
  icon : fileIcon("../resources/example.csv", 64),
  name: "examplev2.csv",
  file: require("../resources/example.csv"),
  publishedAt: formatRelative(parseISO("2021-08-08"), new Date()),
}

let entities = [
  {
    id: 1,
    content: [entitySample1, entitySample2],
    reviews: [reviewSample]
  },
];


