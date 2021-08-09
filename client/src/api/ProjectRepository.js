export const fetchAll = async (ceramic, projectsListId) => {
  let stream = await ceramic.loadStream(projectsListId);
  let projectCuratedStreamIdList = stream.projects;
  const queries = projectCuratedStreamIdList.map((elem) => ({
    streamId: elem,
  }));
  const streamMap = await ceramic.multiQuery(queries);
  return streamMap;
};

export const fetch = async (ceramic, projectsListId, id) => {
  let stream = await fetchAll(ceramic, projectsListId);
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
