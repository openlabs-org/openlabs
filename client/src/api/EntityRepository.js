import { formatDistance, formatRelative, parseISO } from "date-fns";
import globals from "../global.json";
import { status, retrieve } from "../api/Web3storage";

const fileIcon = require("extract-file-icon");

export const fetchAll = async (
  { desiloContract, ceramic, idx, account },
  projectId
) => {
  let response = await desiloContract.methods
    .getProjectEntities(projectId)
    .call();
  let ids = response[0];
  let entities = response[1];
  let entityCeramic = await ceramic.multiQuery(
    entities.map((e) => ({
      streamId: e,
    }))
  );
  let allEntities = await Promise.all(
    Object.keys(entityCeramic).map(async (key, index) => {
      let entity = {};
      entity.id = ids[index];
      let allCommits = entityCeramic[key].anchorCommitIds;
      if (
        allCommits.length == 0 ||
        allCommits[allCommits.length - 1].toString() !=
          entityCeramic[key].commitId.toString()
      )
        allCommits = allCommits.concat([entityCeramic[key].commitId]);
      entity.uri = key;
      entity.content = await Promise.all(
        allCommits.map(async (e) => {
          let content = (await ceramic.loadStream(e)).content;
          return content;
        })
      );
      let reviews = await desiloContract.methods
        .getAllReviews(ids[index])
        .call();
      entity.reviews = await Promise.all(
        reviews.map(async (review, i) => {
          let content = await ceramic.loadStream(review.uri);
          let combined = Object.assign({}, content.content, review);
          // combined.author = await Promise.all(
          //   content.controllers.map(async (did) =>
          //     Object.assign(
          //       {},
          //       {
          //         did,
          //       },
          //       await idx.get("basicProfile", did)
          //     )
          //   )
          // );
          // Assume only one author
          combined.author = Object.assign(
            {},
            {
              did: content.controllers[0],
            },
            await idx.get("basicProfile", content.controllers[0])
          );


          combined.publishedAt = formatDistance(
            new Date(combined.publishedAt * 1000),
            new Date(),
            { addSuffix: true }
          );

          combined.unstake = await desiloContract.methods
            .canUnstake(ids[index], i)
            .call();
          return combined;
        })
      );
      return entity;
    })
  );

  console.log(allEntities);

  return allEntities;
};

// export const add = (data) => {
//   entities.push({
//     id: entities.length,
//     ...data,
//   });
// };

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
  name: "examplev1.csv",
  file: require("../resources/example.csv"),
  publishedAt: formatRelative(parseISO("2021-08-08"), new Date()),
};

let entitySample2 = {
  name: "examplev2.csv",
  file: require("../resources/example.csv"),
  publishedAt: formatRelative(parseISO("2021-08-08"), new Date()),
};

let entitiesSample = [
  {
    id: 1,
    content: [entitySample1, entitySample2],
    reviews: [reviewSample],
  },
];
