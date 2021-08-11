import { formatDistance } from "date-fns";
import globals from "../global.json";

export const fetchAll = async (
  desiloContract,
  ceramic,
  idx
) => {
  let projects = await desiloContract.methods.getAllProjects().call();
  let affiliations = await desiloContract.methods.getAllAffiliations().call();
  let groups = await desiloContract.methods.getAllGroups().call();

  console.log(projects);
  let projectURIs = projects.map((elem) => ({ streamId: elem.uri }));
  console.log(projectURIs);
  let projectCeramic = await ceramic.multiQuery(projectURIs);
  let projectDict = await Promise.all(Object.keys(projectCeramic).map(
    async (key, index) => {
      let content = projectCeramic[key].content;
      content.author = await Promise.all(projectCeramic[key].controllers.map(
        async (did) => (await idx.get("basicProfile", did)).name
      ));
      content.createdAt = formatDistance(
        new Date(projects[index].createdAt * 1000),
        new Date(),
        { addSuffix: true }
      );
      content.id = key;
      content.groups = [];
      affiliations[index].forEach((isAffiliated, index) => {
        if (isAffiliated) {
          content.groups.push(groups[index]);
        }
      });
      return content;
    }
  ));

  console.log(projectDict);
  return projectDict;
};

export const fetch = async (
  desiloContract,
  ceramic,
  idx,
  id
) => {
  let stream = await fetchAll(desiloContract, ceramic, idx);
  return Promise.resolve(stream.find((project) => project.id === id));
};

export const add = (data) => {
  projects.push({
    id: projects.length + 1,
    ...data,
  });
  return Promise.resolve(
    projects.find((project) => project.id === project.length)
  );
};

export const update = (id, data) => {
  return Promise.resolve({
    ...projects.find((project) => project.id === id),
    ...data,
  });
};

export const remove = (id) => {
  const index = projects.findIndex((project) => project.id === id);
  projects.splice(index, 1);
  return Promise.resolve(true);
};

let projects = [
  {
    id: 1,
    title: "A first project",
    summary: "Lorem ipsum",
    groups: [{ id: 1, name: "Group A" }],
    author: "Chinmay",
    createdAt: "2021-08-06",
  },
  {
    id: 2,
    title: "A second project",
    summary: "Lorem ipsum",
    groups: [
      { id: 1, name: "Group A" },
      { id: 2, name: "Group B" },
    ],
    author: "Sandwich",
    createdAt: "2021-08-07",
  },
  {
    id: 3,
    title: "A third project",
    summary: "Lorem ipsum",
    groups: [{ id: 3, name: "Group C" }],
    author: "Jacky",
    createdAt: "2021-08-08",
  },
];
